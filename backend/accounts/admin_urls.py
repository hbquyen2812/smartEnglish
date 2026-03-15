from django.urls import path
from . import admin_views

urlpatterns = [
    # Dashboard stats
    path('stats/', admin_views.AdminStatsView.as_view(), name='admin_stats'),
    # User CRUD
    path('users/', admin_views.AdminUserListView.as_view(), name='admin_users'),
    path('users/<int:pk>/', admin_views.AdminUserDetailView.as_view(), name='admin_user_detail'),
    # Lesson CRUD
    path('lessons/', admin_views.AdminLessonListCreateView.as_view(), name='admin_lessons'),
    path('lessons/<int:pk>/', admin_views.AdminLessonDetailView.as_view(), name='admin_lesson_detail'),
    # Speaking Topic CRUD
    path('topics/', admin_views.AdminSpeakingTopicListCreateView.as_view(), name='admin_topics'),
    path('topics/<int:pk>/', admin_views.AdminSpeakingTopicDetailView.as_view(), name='admin_topic_detail'),
]
