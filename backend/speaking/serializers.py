from rest_framework import serializers
from .models import SpeakingTopic, SpeakingAttempt


class SpeakingTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeakingTopic
        fields = ['id', 'title', 'category', 'prompt_question']


class SpeakingResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeakingAttempt
        fields = ['score', 'transcript', 'feedback', 'fluency', 'pronunciation', 'grammar']
