"""
URL configuration for veterinary_center project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Customize Django Admin Header
admin.site.site_header = "Hệ Thống Quản Trị Trung Tâm Thú Y"
admin.site.site_title = "Quản Trị Thú Y"
admin.site.index_title = "Bảng Điều Khiển Quản Trị Viên"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
