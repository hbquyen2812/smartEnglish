from django.contrib import admin
from .models import SpeakingTopic, SpeakingAttempt


@admin.register(SpeakingTopic)
class SpeakingTopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'order']
    list_editable = ['order']


@admin.register(SpeakingAttempt)
class SpeakingAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'topic', 'score', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['created_at']
