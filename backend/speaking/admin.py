from django.contrib import admin
from .models import SpeakingTopic, SpeakingQuestion, SpeakingAttempt


class SpeakingQuestionInline(admin.TabularInline):
    model = SpeakingQuestion
    extra = 3


@admin.register(SpeakingTopic)
class SpeakingTopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'part', 'order']
    list_filter = ['part']
    list_editable = ['order']
    inlines = [SpeakingQuestionInline]


@admin.register(SpeakingAttempt)
class SpeakingAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'topic', 'question', 'score', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['created_at']
