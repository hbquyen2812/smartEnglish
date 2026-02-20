from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserProfileSerializer, UserProgressSerializer
from .models import UserProfile, UserProgress


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class UserProgressListView(generics.ListAPIView):
    serializer_class = UserProgressSerializer

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)
