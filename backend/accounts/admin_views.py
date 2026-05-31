from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Avg, Count, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta

from .permissions import IsAdmin
from .models import UserProfile, UserProgress
from .admin_serializers import (
    AdminUserSerializer, AdminUserUpdateSerializer,
    AdminLessonSerializer, AdminSpeakingTopicSerializer,
)
from lessons.models import Lesson
from speaking.models import SpeakingTopic, SpeakingAttempt


# ─── Dashboard Stats ───

class AdminStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        total_lessons = Lesson.objects.count()
        total_topics = SpeakingTopic.objects.count()

        # Average score
        avg_score = UserProgress.objects.filter(
            completed=True
        ).aggregate(avg=Avg('score'))['avg'] or 0

        # Completions count
        total_completions = UserProgress.objects.filter(completed=True).count()

        # Recent registrations (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        new_users_30d = User.objects.filter(date_joined__gte=thirty_days_ago).count()

        # Registrations per day (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        registrations_chart = list(
            User.objects.filter(date_joined__gte=seven_days_ago)
            .annotate(date=TruncDate('date_joined'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        for item in registrations_chart:
            item['date'] = item['date'].isoformat()

        # Top lessons by completions
        top_lessons = list(
            UserProgress.objects.filter(completed=True)
            .values('lesson__title', 'lesson__lesson_type')
            .annotate(completions=Count('id'), avg_score=Avg('score'))
            .order_by('-completions')[:5]
        )

        # Score distribution
        score_ranges = {
            'excellent': UserProgress.objects.filter(completed=True, score__gte=80).count(),
            'good': UserProgress.objects.filter(completed=True, score__gte=60, score__lt=80).count(),
            'needs_work': UserProgress.objects.filter(completed=True, score__lt=60).count(),
        }

        # Recent users (last 10)
        recent_users = list(
            User.objects.select_related('profile')
            .order_by('-date_joined')[:10]
            .values('id', 'username', 'email', 'is_active', 'date_joined')
        )
        for u in recent_users:
            u['date_joined'] = u['date_joined'].isoformat()
            try:
                profile = UserProfile.objects.get(user_id=u['id'])
                u['role'] = profile.role
                u['level'] = profile.level
            except UserProfile.DoesNotExist:
                u['role'] = 'user'
                u['level'] = 'Beginner'

        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'new_users_30d': new_users_30d,
            'total_lessons': total_lessons,
            'total_topics': total_topics,
            'avg_score': round(avg_score, 1),
            'total_completions': total_completions,
            'registrations_chart': registrations_chart,
            'top_lessons': top_lessons,
            'score_distribution': score_ranges,
            'recent_users': recent_users,
        })


# ─── User CRUD ───

class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminUserSerializer

    def get_queryset(self):
        qs = User.objects.select_related('profile').all().order_by('-date_joined')
        search = self.request.query_params.get('search')
        role = self.request.query_params.get('role')
        if search:
            qs = qs.filter(Q(username__icontains=search) | Q(email__icontains=search))
        if role:
            qs = qs.filter(profile__role=role)
        return qs


class AdminUserDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        try:
            user = User.objects.select_related('profile').get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        return Response(AdminUserSerializer(user).data)

    def put(self, request, pk):
        try:
            user = User.objects.select_related('profile').get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        serializer = AdminUserUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if 'is_active' in data:
            user.is_active = data['is_active']
            user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        if 'role' in data:
            profile.role = data['role']
        if 'level' in data:
            profile.level = data['level']
        profile.save()

        return Response(AdminUserSerializer(user).data)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        if user == request.user:
            return Response({'error': 'Cannot delete yourself'}, status=400)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Lesson CRUD ───

def _auto_generate_audio(lesson):
    """Sinh audio TTS cho bài Listening có transcript. Bọc an toàn để không
    làm hỏng việc lưu nếu gTTS lỗi (vd mất mạng)."""
    if lesson.lesson_type == 'listening' and (lesson.reading_text or '').strip():
        try:
            from ai_services.tts import generate_lesson_audio
            generate_lesson_audio(lesson, force=False)
        except Exception:
            pass


class AdminLessonListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminLessonSerializer

    def get_queryset(self):
        qs = Lesson.objects.all()
        lesson_type = self.request.query_params.get('type')
        level = self.request.query_params.get('level')
        if lesson_type:
            qs = qs.filter(lesson_type=lesson_type)
        if level:
            qs = qs.filter(level=level)
        return qs

    def perform_create(self, serializer):
        lesson = serializer.save()
        _auto_generate_audio(lesson)


class AdminLessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminLessonSerializer
    queryset = Lesson.objects.all()

    def perform_update(self, serializer):
        lesson = serializer.save()
        _auto_generate_audio(lesson)


# ─── Speaking Topic CRUD ───

class AdminSpeakingTopicListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminSpeakingTopicSerializer
    queryset = SpeakingTopic.objects.all()


class AdminSpeakingTopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminSpeakingTopicSerializer
    queryset = SpeakingTopic.objects.all()
