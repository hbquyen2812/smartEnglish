from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Only allow users with admin role."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        profile = getattr(request.user, 'profile', None)
        if profile is None:
            return False
        return profile.role == 'admin'
