from django.conf import settings
from django.db import models


class PetGender(models.TextChoices):
    MALE = 'MALE', 'Đực'
    FEMALE = 'FEMALE', 'Cái'
    UNKNOWN = 'UNKNOWN', 'Không xác định'


class Pet(models.Model):
    """
    Model quản lý Hồ sơ Thú cưng.
    Mỗi thú cưng gắn liền với một Khách hàng (User) sở hữu.
    """
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pets',
        verbose_name='Chủ sở hữu'
    )
    name = models.CharField(
        max_length=100,
        verbose_name='Tên thú cưng'
    )
    species = models.CharField(
        max_length=50,
        verbose_name='Loài (Chó, Mèo...)'
    )
    breed = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Giống loài'
    )
    gender = models.CharField(
        max_length=10,
        choices=PetGender.choices,
        default=PetGender.UNKNOWN,
        verbose_name='Giới tính'
    )
    birth_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Ngày sinh'
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Cân nặng (kg)'
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Ghi chú / Tiền sử dị ứng'
    )
    avatar = models.ImageField(
        upload_to='pets/',
        null=True,
        blank=True,
        verbose_name='Ảnh thú cưng'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Ngày tạo hồ sơ'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Ngày cập nhật'
    )

    class Meta:
        db_table = 'pets_pet'
        verbose_name = 'Thú cưng'
        verbose_name_plural = 'Danh sách Thú cưng'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.species}) - Chủ: {self.owner.username}"
