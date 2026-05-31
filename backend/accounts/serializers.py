from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password as django_validate_password
from .models import UserProfile, UserProgress


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_password(self, value):
        # Áp dụng ràng buộc mật khẩu của Django: chặn mật khẩu toàn số (vd 123456),
        # quá phổ biến, quá ngắn, hoặc quá giống username/email.
        temp_user = User(
            username=self.initial_data.get('username', ''),
            email=self.initial_data.get('email', '') or '',
        )
        django_validate_password(value, user=temp_user)
        return value

    def create(self, validated_data):
        email = validated_data.get('email', '')
        # If email is not valid format, just store it as blank
        if email and '@' not in email:
            email = ''
        user = User.objects.create_user(
            username=validated_data['username'],
            email=email,
            password=validated_data['password'],
        )
        UserProfile.objects.create(user=user)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    today_completed = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'avatar', 'role', 'level', 'daily_goal', 'streak', 'today_completed']
        read_only_fields = ['role']

    def get_today_completed(self, obj):
        from django.utils import timezone
        today = timezone.now().date()
        return UserProgress.objects.filter(
            user=obj.user,
            completed=True,
            completed_at__date=today,
        ).count()


class UserProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model = UserProgress
        fields = ['id', 'lesson', 'lesson_title', 'completed', 'score', 'completed_at']
