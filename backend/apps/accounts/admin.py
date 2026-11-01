from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Tùy biến trang quản trị Django Admin cho Custom User Model.
    """
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',)

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Thông tin bổ sung Trung tâm Thú y', {
            'fields': ('role', 'phone_number', 'address', 'avatar'),
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Thông tin bổ sung Trung tâm Thú y', {
            'fields': ('role', 'phone_number', 'address', 'avatar'),
        }),
    )
