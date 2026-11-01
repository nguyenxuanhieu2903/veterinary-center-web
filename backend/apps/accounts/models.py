from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.TextChoices):
    CUSTOMER = 'CUSTOMER', 'Khách hàng'
    DOCTOR = 'DOCTOR', 'Bác sĩ thú y'
    STAFF = 'STAFF', 'Nhân viên trung tâm'
    ADMIN = 'ADMIN', 'Quản trị viên'


class User(AbstractUser):
    """
    Custom User Model cho hệ thống Trung tâm Thú y.
    Kế thừa AbstractUser và mở rộng thêm vai trò (role), số điện thoại, địa chỉ và avatar.
    """
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
        verbose_name='Vai trò',
        db_index=True,
    )
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        verbose_name='Số điện thoại',
    )
    address = models.TextField(
        blank=True,
        verbose_name='Địa chỉ',
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        verbose_name='Ảnh đại diện',
    )

    class Meta:
        db_table = 'accounts_user'
        verbose_name = 'Người dùng'
        verbose_name_plural = 'Danh sách Người dùng'
        ordering = ['-date_joined']

    def __str__(self):
        full_name = self.get_full_name().strip()
        display = full_name if full_name else self.username
        return f"{display} ({self.get_role_display()})"

    @property
    def is_customer(self):
        return self.role == Role.CUSTOMER

    @property
    def is_doctor(self):
        return self.role == Role.DOCTOR

    @property
    def is_staff_member(self):
        return self.role == Role.STAFF

    @property
    def is_admin_user(self):
        return self.role == Role.ADMIN or self.is_superuser
