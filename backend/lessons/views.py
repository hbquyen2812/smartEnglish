from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Lesson
from .serializers import LessonListSerializer, LessonDetailSerializer
from accounts.models import UserProgress


class LessonListView(generics.ListAPIView):
    serializer_class = LessonListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Lesson.objects.all()
        lesson_type = self.request.query_params.get('type')
        level = self.request.query_params.get('level')
        recommended = self.request.query_params.get('recommended')

        if lesson_type:
            qs = qs.filter(lesson_type=lesson_type)
        if level:
            qs = qs.filter(level=level)
        if recommended:
            qs = qs.filter(is_recommended=True)
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
            })

        score = (correct / total * 100) if total > 0 else 0

        UserProgress.objects.update_or_create(
            user=request.user,
            lesson=lesson,
            defaults={'completed': True, 'score': score, 'completed_at': timezone.now()},
        )

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
