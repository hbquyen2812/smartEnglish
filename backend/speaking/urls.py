from django.urls import path
from . import views

urlpatterns = [
    path('speaking/topics/', views.SpeakingTopicListView.as_view(), name='speaking_topics'),
    path('speaking/topics/<int:pk>/', views.SpeakingTopicDetailView.as_view(), name='speaking_topic_detail'),
    path('speaking/analyze/', views.SpeakingAnalyzeView.as_view(), name='speaking_analyze'),
    path('speaking/chat/', views.SpeakingChatView.as_view(), name='speaking_chat'),
]
