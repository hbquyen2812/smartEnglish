from django.contrib import admin
from .models import Lesson, Question, AnswerOption


class AnswerOptionInline(admin.TabularInline):
    model = AnswerOption
    extra = 4


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 3


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson_type', 'level', 'tag', 'is_recommended', 'order']
    list_filter = ['lesson_type', 'level', 'is_recommended']
    list_editable = ['order', 'is_recommended']
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'lesson', 'order']
    list_filter = ['lesson']
    inlines = [AnswerOptionInline]
