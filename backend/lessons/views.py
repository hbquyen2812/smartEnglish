from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta
from .models import Lesson
from .serializers import LessonListSerializer, LessonDetailSerializer
from accounts.models import UserProfile, UserProgress


class LessonPagination(PageNumberPagination):
    """6 bài/trang. Có thể tăng qua ?page_size=... (tối đa 1000)."""
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 1000


class LessonListView(generics.ListAPIView):
    serializer_class = LessonListSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = LessonPagination

    def get_queryset(self):
        qs = Lesson.objects.all()
        lesson_type = self.request.query_params.get('type')
        level = self.request.query_params.get('level')
        recommended = self.request.query_params.get('recommended')
        search = self.request.query_params.get('search')

        if lesson_type:
            qs = qs.filter(lesson_type=lesson_type)
        if level and level != 'All':
            qs = qs.filter(level=level)
        if recommended:
            qs = qs.filter(is_recommended=True)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(tag__icontains=search))
        return qs


class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class SubmitAnswersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, lesson_id):
        answers = request.data.get('answers', {})
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

        questions = lesson.questions.all()
        correct = 0
        total = questions.count()
        results = []

        for question in questions:
            selected_id = answers.get(str(question.id))
            correct_option = question.options.filter(is_correct=True).first()
            is_correct = (str(correct_option.id) == str(selected_id)) if correct_option and selected_id else False
            if is_correct:
                correct += 1
            results.append({
                'question_id': question.id,
                'correct': is_correct,
                'correct_answer': correct_option.id if correct_option else None,
                'correct_answer_text': correct_option.text if correct_option else '',
                'question_text': question.text,
            })

        score = (correct / total * 100) if total > 0 else 0

        progress, created = UserProgress.objects.update_or_create(
            user=request.user,
            lesson=lesson,
            defaults={'completed': True, 'score': score, 'completed_at': timezone.now()},
        )

        # Update streak & daily goal progress
        if created:
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            today = timezone.now().date()
            yesterday = today - timedelta(days=1)

            # Check if user completed a lesson yesterday (to continue streak)
            had_yesterday = UserProgress.objects.filter(
                user=request.user,
                completed=True,
                completed_at__date=yesterday,
            ).exists()

            had_today_before = UserProgress.objects.filter(
                user=request.user,
                completed=True,
                completed_at__date=today,
            ).exclude(pk=progress.pk).exists()

            if not had_today_before:
                # First lesson today
                if had_yesterday:
                    profile.streak += 1
                else:
                    profile.streak = 1
                profile.save()

        # Generate explanations using AI (non-blocking: skip if fails)
        explanations = {}
        try:
            from ai_services.gemini_client import GeminiClient
            client = GeminiClient()
            explanations = client.explain_answers(
                lesson.reading_text,
                [{'question': r['question_text'], 'correct_answer': r['correct_answer_text']} for r in results]
            )
        except Exception as e:
            import traceback
            traceback.print_exc()

        # Attach explanations to results
        for i, r in enumerate(results):
            r['explanation'] = explanations.get(str(i), '')

        return Response({
            'score': score,
            'correct': correct,
            'total': total,
            'results': results,
        })


class ReadingSummarizeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

        from ai_services.gemini_client import GeminiClient
        client = GeminiClient()
        result = client.summarize_and_extract_vocab(text)
        return Response(result)


class WritingAssessView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        essay = request.data.get('essay', '')
        topic = request.data.get('topic', '')
        if not essay:
            return Response({'error': 'No essay provided'}, status=status.HTTP_400_BAD_REQUEST)

        from ai_services.gemini_client import GeminiClient
        client = GeminiClient()
        result = client.assess_writing(essay, topic)
        return Response(result)


class GrammarCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

        from ai_services.gemini_client import GeminiClient
        client = GeminiClient()
        result = client.grammar_correction(text)
        return Response(result)
