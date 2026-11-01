from django.conf import settings
from django.db import models


class AppointmentStatus(models.TextChoices):
    PENDING = 'PENDING', 'Chờ xác nhận'
    CONFIRMED = 'CONFIRMED', 'Đã xác nhận'
    COMPLETED = 'COMPLETED', 'Đã hoàn tất'
    CANCELLED = 'CANCELLED', 'Đã hủy'


class Service(models.Model):
    """
    Model Danh mục Dịch vụ Thú y (Khám tổng quát, Tiêm phòng, Phẫu thuật, Tắm tỉa...).
    """
    name = models.CharField(
        max_length=150,
        unique=True,
        verbose_name='Tên dịch vụ'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Mô tả dịch vụ'
    )
    price_vnd = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        verbose_name='Giá niêm yết (VNĐ)'
    )
    duration_minutes = models.PositiveIntegerField(
        default=30,
        verbose_name='Thời lượng dự kiến (phút)'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Trạng thái hoạt động'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Ngày tạo'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Ngày cập nhật'
    )

    class Meta:
        db_table = 'bookings_service'
        verbose_name = 'Dịch vụ y tế'
        verbose_name_plural = 'Danh mục Dịch vụ y tế'
        ordering = ['price_vnd', 'name']

    def __str__(self):
        return f"{self.name} - {self.price_vnd:,.0f} đ"


class Appointment(models.Model):
    """
    Model Quản lý Ca Đặt lịch khám thú cưng.
    """
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments',
        verbose_name='Khách hàng'
    )
    pet = models.ForeignKey(
        'pets.Pet',
        on_delete=models.CASCADE,
        related_name='appointments',
        verbose_name='Thú cưng'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name='appointments',
        verbose_name='Dịch vụ y tế'
    )
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='doctor_appointments',
        limit_choices_to={'role': 'DOCTOR'},
        verbose_name='Bác sĩ phụ trách'
    )
    appointment_date = models.DateField(
        verbose_name='Ngày khám',
        db_index=True
    )
    time_slot = models.CharField(
        max_length=30,
        verbose_name='Khung giờ khám (vd: 09:00-10:00)',
        db_index=True
    )
    status = models.CharField(
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.PENDING,
        verbose_name='Trạng thái lịch hẹn',
        db_index=True
    )
    notes = models.TextField(
        blank=True,
        verbose_name='Ghi chú của khách hàng / Triệu chứng ban đầu'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Thời điểm đặt'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Thời điểm cập nhật'
    )

    class Meta:
        db_table = 'bookings_appointment'
        verbose_name = 'Lịch hẹn khám'
        verbose_name_plural = 'Danh sách Lịch hẹn khám'
        ordering = ['-appointment_date', 'time_slot']

    def __str__(self):
        return f"Lịch khám #{self.id}: {self.pet.name} ({self.customer.username}) - {self.appointment_date} {self.time_slot}"
