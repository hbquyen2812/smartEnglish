from django.urls import path
from . import views

urlpatterns = [
    path('speaking/topics/', views.SpeakingTopicListView.as_view(), name='speaking_topics'),
    path('speaking/analyze/', views.SpeakingAnalyzeView.as_view(), name='speaking_analyze'),
]
