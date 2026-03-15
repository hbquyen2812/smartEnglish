from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import SpeakingTopic, SpeakingQuestion, SpeakingAttempt
from .serializers import SpeakingTopicListSerializer, SpeakingTopicDetailSerializer


class SpeakingTopicListView(generics.ListAPIView):
    serializer_class = SpeakingTopicListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = SpeakingTopic.objects.all()
        part = self.request.query_params.get('part')
        if part:
            qs = qs.filter(part=part)
        return qs


class SpeakingTopicDetailView(generics.RetrieveAPIView):
    queryset = SpeakingTopic.objects.all()
    serializer_class = SpeakingTopicDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class SpeakingAnalyzeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        audio_file = request.FILES.get('audio')
        topic_id = request.data.get('topic_id')
        question_id = request.data.get('question_id')

        if not audio_file:
            return Response({'error': 'No audio file provided'}, status=400)

        topic = None
        question = None
        question_text = None

        if topic_id:
            try:
                topic = SpeakingTopic.objects.get(pk=topic_id)
            except SpeakingTopic.DoesNotExist:
                pass

        if question_id:
            try:
                question = SpeakingQuestion.objects.get(pk=question_id)
                question_text = question.question_text
            except SpeakingQuestion.DoesNotExist:
                pass

        from ai_services.speaking_analyzer import SpeakingAnalyzer
        analyzer = SpeakingAnalyzer()
        result = analyzer.analyze(audio_file, topic, question_text)

        SpeakingAttempt.objects.create(
            user=request.user,
            topic=topic,
            question=question,
            audio_file=audio_file,
            transcript=result['transcript'],
            score=result['score'],
            fluency=result['fluency'],
            pronunciation=result['pronunciation'],
            grammar=result['grammar'],
            lexical_resource=result.get('lexical_resource', 0),
            feedback=result['feedback'],
            fluency_feedback=result.get('fluency_feedback', ''),
            pronunciation_feedback=result.get('pronunciation_feedback', ''),
            grammar_feedback=result.get('grammar_feedback', ''),
            lexical_feedback=result.get('lexical_feedback', ''),
        )

        return Response({
            'score': result['score'],
            'transcript': result['transcript'],
            'feedback': result['feedback'],
            'fluency': result['fluency'],
            'pronunciation': result['pronunciation'],
            'grammar': result['grammar'],
            'lexical_resource': result.get('lexical_resource', 0),
            'fluency_feedback': result.get('fluency_feedback', ''),
            'pronunciation_feedback': result.get('pronunciation_feedback', ''),
            'grammar_feedback': result.get('grammar_feedback', ''),
            'lexical_feedback': result.get('lexical_feedback', ''),
        })
