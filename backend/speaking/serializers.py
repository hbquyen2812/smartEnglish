from rest_framework import serializers
from .models import SpeakingTopic, SpeakingQuestion, SpeakingAttempt


class SpeakingQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeakingQuestion
        fields = ['id', 'question_text', 'order']


class SpeakingTopicListSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = SpeakingTopic
        fields = ['id', 'title', 'part', 'description', 'order', 'questions_count']


class SpeakingTopicDetailSerializer(serializers.ModelSerializer):
    questions = SpeakingQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = SpeakingTopic
        fields = ['id', 'title', 'part', 'description', 'order', 'questions']


class SpeakingResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeakingAttempt
        fields = ['score', 'transcript', 'feedback', 'fluency', 'pronunciation',
                  'grammar', 'lexical_resource', 'fluency_feedback',
                  'pronunciation_feedback', 'grammar_feedback', 'lexical_feedback']
