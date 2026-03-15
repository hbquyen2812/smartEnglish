from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import SpeakingTopic, SpeakingAttempt
from .serializers import SpeakingTopicSerializer


class SpeakingTopicListView(generics.ListAPIView):
    queryset = SpeakingTopic.objects.all()
    serializer_class = SpeakingTopicSerializer
    permission_classes = [permissions.IsAuthenticated]


class SpeakingAnalyzeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        audio_file = request.FILES.get('audio')
        topic_id = request.data.get('topic_id')

        if not audio_file:
            return Response({'error': 'No audio file provided'}, status=400)

        topic = None
        if topic_id:
            try:
                topic = SpeakingTopic.objects.get(pk=topic_id)
            except SpeakingTopic.DoesNotExist:
                pass

        from ai_services.speaking_analyzer import SpeakingAnalyzer
        analyzer = SpeakingAnalyzer()
        result = analyzer.analyze(audio_file, topic)

        SpeakingAttempt.objects.create(
            user=request.user,
            topic=topic,
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
