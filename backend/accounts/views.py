from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserProfileSerializer, UserProgressSerializer
from .models import UserProfile, UserProgress


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ChangePasswordView(APIView):
    """Change password for logged-in user."""

    def post(self, request):
        current_password = request.data.get('current_password', '')
        new_password = request.data.get('new_password', '')

        if not current_password or not new_password:
            return Response(
                {'error': 'Please provide both current and new password.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 6:
            return Response(
                {'error': 'New password must be at least 6 characters.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(new_password)
        request.user.save()

        # Generate new tokens since password changed
        refresh = RefreshToken.for_user(request.user)
        return Response({
            'message': 'Password changed successfully.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class ForgotPasswordView(APIView):
    """Request password reset."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '')
        email = request.data.get('email', '')

        if not username:
            return Response(
                {'error': 'Please enter your username.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {'error': 'Account not found. Please check your username.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Verify email matches (if user has email)
        if user.email and email:
            if user.email.lower() != email.lower():
                return Response(
                    {'error': 'Email does not match the account.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Generate reset token
        import secrets
        from django.core.cache import cache
        token = secrets.token_urlsafe(32)
        cache.set(f'reset_{token}', user.id, timeout=900)  # 15 minutes

        return Response({
            'message': 'Reset token generated. Use it to set a new password.',
            'reset_token': token,
        })


class ResetPasswordView(APIView):
    """Reset password using token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token', '')
        new_password = request.data.get('new_password', '')

        if not token or not new_password:
            return Response(
                {'error': 'Token and new password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 6:
            return Response(
                {'error': 'Password must be at least 6 characters.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from django.core.cache import cache
        user_id = cache.get(f'reset_{token}')
        if not user_id:
            return Response(
                {'error': 'Invalid or expired reset token. Please try again.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.set_password(new_password)
        user.save()
        cache.delete(f'reset_{token}')

        return Response({'message': 'Password reset successfully. You can now login.'})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')

        if not username or not password:
            return Response(
                {'error': 'Please enter both username and password.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if user exists
        if not User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Account does not exist. Please check your username or register.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check password
        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {'error': 'Incorrect password. Please try again.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {'error': 'This account has been disabled.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class UserProgressListView(generics.ListAPIView):
    serializer_class = UserProgressSerializer

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)
