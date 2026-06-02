from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.http import JsonResponse
from django.views.static import serve
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import LoginView

urlpatterns = [
    # Health-check: trả 200 nhanh, không cần đăng nhập (dùng cho UptimeRobot giữ server thức)
    path('healthz/', lambda request: JsonResponse({'status': 'ok'})),
    path('admin/', admin.site.urls),
    # JWT Auth
    path('api/token/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # App endpoints
    path('api/', include('accounts.urls')),
    path('api/', include('lessons.urls')),
    path('api/', include('speaking.urls')),
    # Admin API
    path('api/admin/', include('accounts.admin_urls')),
]

# Phục vụ file media (audio bài nghe, ghi âm) kể cả trên production.
# Lưu ý: Render dùng đĩa tạm (ephemeral) nên file người dùng upload sẽ mất khi server restart.
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
