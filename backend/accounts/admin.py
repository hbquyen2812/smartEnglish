from django.contrib import admin
from .models import UserProfile, UserProgress


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'level', 'streak', 'daily_goal']
    list_filter = ['level']


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'completed', 'score', 'completed_at']
    list_filter = ['completed']
