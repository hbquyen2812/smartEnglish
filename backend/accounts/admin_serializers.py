from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, UserProgress
from lessons.models import Lesson, Question, AnswerOption
from speaking.models import SpeakingTopic


# ─── User Management ───

class AdminUserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)
    level = serializers.CharField(source='profile.level', read_only=True)
    streak = serializers.IntegerField(source='profile.streak', read_only=True)
    lessons_completed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'date_joined',
                  'role', 'level', 'streak', 'lessons_completed']

    def get_lessons_completed(self, obj):
        return UserProgress.objects.filter(user=obj, completed=True).count()


class AdminUserUpdateSerializer(serializers.Serializer):
    is_active = serializers.BooleanField(required=False)
    role = serializers.ChoiceField(choices=['user', 'admin'], required=False)
    level = serializers.ChoiceField(choices=['Beginner', 'Intermediate', 'Advanced'], required=False)


# ─── Lesson Management ───

class AdminAnswerOptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = AnswerOption
        fields = ['id', 'text', 'is_correct', 'order']


class AdminQuestionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    options = AdminAnswerOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'options']


class AdminLessonSerializer(serializers.ModelSerializer):
    questions = AdminQuestionSerializer(many=True, required=False)
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'lesson_type', 'level', 'tag', 'image',
                  'duration', 'reading_text', 'audio_file', 'is_recommended',
                  'order', 'created_at', 'questions', 'questions_count']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        lesson = Lesson.objects.create(**validated_data)
        self._create_questions(lesson, questions_data)
        return lesson

    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if questions_data is not None:
            # Delete old questions and recreate
            instance.questions.all().delete()
            self._create_questions(instance, questions_data)
        return instance

    def _create_questions(self, lesson, questions_data):
        for q_data in questions_data:
            options_data = q_data.pop('options', [])
            q_data.pop('id', None)
            question = Question.objects.create(lesson=lesson, **q_data)
            for o_data in options_data:
                o_data.pop('id', None)
                AnswerOption.objects.create(question=question, **o_data)


# ─── Speaking Topic Management ───

class AdminSpeakingTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeakingTopic
        fields = ['id', 'title', 'category', 'prompt_question', 'order']
