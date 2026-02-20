from rest_framework import serializers
from .models import Lesson, Question, AnswerOption


class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = ['id', 'text', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    options = AnswerOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'options']


class LessonListSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'lesson_type', 'level', 'tag',
            'image', 'duration', 'is_recommended', 'questions_count',
        ]


class LessonDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'lesson_type', 'level', 'tag',
            'image', 'duration', 'reading_text', 'audio_file', 'questions',
        ]
