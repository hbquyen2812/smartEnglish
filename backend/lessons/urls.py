from django.urls import path
from . import views

urlpatterns = [
    path('lessons/', views.LessonListView.as_view(), name='lesson_list'),
    path('lessons/<int:pk>/', views.LessonDetailView.as_view(), name='lesson_detail'),
    path('lessons/<int:lesson_id>/submit/', views.SubmitAnswersView.as_view(), name='submit_answers'),
    path('ai/summarize/', views.ReadingSummarizeView.as_view(), name='ai_summarize'),
    path('ai/writing-assess/', views.WritingAssessView.as_view(), name='ai_writing_assess'),
    path('ai/grammar-check/', views.GrammarCheckView.as_view(), name='ai_grammar_check'),
]
