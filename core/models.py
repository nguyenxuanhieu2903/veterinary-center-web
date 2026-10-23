from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.exceptions import ValidationError
from decimal import Decimal



# ==============================================================================
# 1. CUSTOM USER MODEL (Auth & Phân quyền 4 vai trò - TV1)
# ==============================================================================
class CustomUser(AbstractUser):
    """
    Mô hình người dùng mở rộng hỗ trợ 4 vai trò độc lập:
    - CUSTOMER: Khách hàng / Chủ thú cưng
    - DOCTOR: Bác sĩ thú y phụ trách khám chữa
    - STAFF: Nhân viên trung tâm hỗ trợ & quản lý đơn
    - ADMIN: Quản trị viên hệ thống
    """
    ROLE_CUSTOMER = 'CUSTOMER'
    ROLE_DOCTOR = 'DOCTOR'
    ROLE_STAFF = 'STAFF'
    ROLE_ADMIN = 'ADMIN'

    ROLE_CHOICES = [
        (ROLE_CUSTOMER, 'Khách hàng'),
        (ROLE_DOCTOR, 'Bác sĩ thú y'),
        (ROLE_STAFF, 'Nhân viên trung tâm'),
        (ROLE_ADMIN, 'Quản trị viên'),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_CUSTOMER,
        verbose_name='Vai trò người dùng',
        db_index=True
    )
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        verbose_name='Số điện thoại'
    )
    address = models.TextField(
        blank=True,
        null=True,
        verbose_name='Địa chỉ liên hệ'
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name='Ảnh đại diện'
    )

    class Meta:
        verbose_name = 'Người dùng'
        verbose_name_plural = 'Danh sách Người dùng'
        ordering = ['-date_joined']

    def __str__(self):
        role_label = dict(self.ROLE_CHOICES).get(self.role, self.role)
        return f"{self.username} ({self.get_full_name() or 'Chưa đặt tên'}) - [{role_label}]"

    @property
    def is_customer(self):
        return self.role == self.ROLE_CUSTOMER

    @property
    def is_doctor(self):
        return self.role == self.ROLE_DOCTOR

    @property
    def is_staff_member(self):
        return self.role == self.ROLE_STAFF

    @property
    def is_admin_user(self):
        return self.role == self.ROLE_ADMIN or self.is_superuser

    def save(self, *args, **kwargs):
        # Tự động đồng bộ quyền truy cập Django Admin & Superuser dựa trên vai trò
        if self.role in [self.ROLE_STAFF, self.ROLE_ADMIN]:
            self.is_staff = True
        elif not self.is_superuser:
            self.is_staff = False

        if self.role == self.ROLE_ADMIN:
            self.is_superuser = True

        super().save(*args, **kwargs)


# ==============================================================================
# 2. PHÂN HỆ Y TẾ & ĐẶT LỊCH (Medical & Booking - TV2)
# ==============================================================================
class Pet(models.Model):
    """
    Hồ sơ thú cưng cá nhân thuộc quyền sở hữu của Khách hàng
    """
    GENDER_CHOICES = [
        ('MALE', 'Đực'),
        ('FEMALE', 'Cái'),
        ('UNKNOWN', 'Không rõ'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pets',
        verbose_name='Chủ sở hữu'
    )
    name = models.CharField(max_length=100, verbose_name='Tên thú cưng')
    species = models.CharField(
        max_length=50,
        verbose_name='Loài',
        help_text='Ví dụ: Chó, Mèo, Thỏ, Chim...'
    )
    breed = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Giống loài'
    )
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        default='UNKNOWN',
        verbose_name='Giới tính'
    )
    birth_date = models.DateField(
        blank=True,
        null=True,
        verbose_name='Ngày sinh / Tuổi ước lượng'
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Cân nặng (kg)'
    )
    health_condition = models.TextField(
        blank=True,
        null=True,
        verbose_name='Tình trạng sức khỏe / Tiền sử bệnh'
    )
    image = models.ImageField(
        upload_to='pets/',
        blank=True,
        null=True,
        verbose_name='Ảnh thú cưng'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo hồ sơ')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật lần cuối')

    class Meta:
        verbose_name = 'Thú cưng'
        verbose_name_plural = 'Danh sách Thú cưng'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.species}) - Chủ: {self.owner.username}"


class Service(models.Model):
    """
    Danh mục Dịch vụ Thú y tại Trung tâm (Khám, Tiêm chủng, Phẫu thuật, Grooming...)
    """
    name = models.CharField(max_length=150, verbose_name='Tên dịch vụ')
    description = models.TextField(blank=True, null=True, verbose_name='Mô tả chi tiết')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Giá dịch vụ (VNĐ)')
    duration = models.PositiveIntegerField(default=30, verbose_name='Thời lượng khám dự kiến (phút)')
    is_active = models.BooleanField(default=True, verbose_name='Đang hoạt động kinh doanh')
    image = models.ImageField(upload_to='services/', blank=True, null=True, verbose_name='Ảnh dịch vụ')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')

    class Meta:
        verbose_name = 'Dịch vụ thú y'
        verbose_name_plural = 'Danh mục Dịch vụ'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {int(self.price):,} VNĐ"


class Appointment(models.Model):
    """
    Lịch hẹn khám chữa bệnh thú y
    """
    STATUS_PENDING = 'PENDING'
    STATUS_CONFIRMED = 'CONFIRMED'
    STATUS_COMPLETED = 'COMPLETED'
    STATUS_CANCELLED = 'CANCELLED'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Chờ xác nhận'),
        (STATUS_CONFIRMED, 'Đã xác nhận'),
        (STATUS_COMPLETED, 'Đã hoàn thành'),
        (STATUS_CANCELLED, 'Đã hủy'),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments',
        verbose_name='Khách hàng'
    )
    pet = models.ForeignKey(
        Pet,
        on_delete=models.PROTECT,
        related_name='appointments',
        verbose_name='Thú cưng',
        help_text='Thú cưng phải thuộc quyền sở hữu của khách hàng đặt lịch'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='appointments',
        verbose_name='Dịch vụ đăng ký'
    )
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_appointments',
        limit_choices_to={'role': CustomUser.ROLE_DOCTOR},
        verbose_name='Bác sĩ phụ trách'
    )
    appointment_date = models.DateField(verbose_name='Ngày hẹn khám')
    time_slot = models.CharField(
        max_length=50,
        verbose_name='Khung giờ khám',
        help_text='Ví dụ: 08:00 - 09:00, 09:00 - 10:00'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        verbose_name='Trạng thái lịch hẹn',
        db_index=True
    )
    notes = models.TextField(blank=True, null=True, verbose_name='Ghi chú của khách hàng')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày đặt lịch')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật lần cuối')

    class Meta:
        verbose_name = 'Lịch hẹn khám'
        verbose_name_plural = 'Danh sách Lịch hẹn khám'
        ordering = ['-appointment_date', 'time_slot']
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'appointment_date', 'time_slot'],
                condition=~models.Q(status='CANCELLED') & models.Q(doctor__isnull=False),
                name='unique_active_doctor_appointment_slot'
            )
        ]

    def clean(self):
        super().clean()
        # BR-APP-01: Khách hàng chỉ được đặt lịch cho thú cưng do mình sở hữu
        if hasattr(self, 'pet') and hasattr(self, 'customer') and self.pet and self.customer:
            if self.pet.owner_id != self.customer_id:
                raise ValidationError({
                    'pet': 'Thú cưng này không thuộc quyền sở hữu của khách hàng đã chọn.'
                })

        # BR-APP-02: Một Bác sĩ không thể nhận 2 lịch khám trùng nhau trong cùng một ca/khung giờ
        if self.doctor_id and self.appointment_date and self.time_slot and self.status != self.STATUS_CANCELLED:
            overlapping = Appointment.objects.filter(
                doctor_id=self.doctor_id,
                appointment_date=self.appointment_date,
                time_slot=self.time_slot
            ).exclude(status=self.STATUS_CANCELLED)

            if self.pk:
                overlapping = overlapping.exclude(pk=self.pk)

            if overlapping.exists():
                raise ValidationError({
                    'time_slot': f"Bác sĩ đã có lịch khám khác trong khung giờ '{self.time_slot}' ngày {self.appointment_date}."
                })

    def __str__(self):
        return f"Lịch hẹn #{self.id}: {self.pet.name} - {self.appointment_date} ({self.time_slot}) [{self.get_status_display()}]"



class MedicalRecord(models.Model):
    """
    Hồ sơ bệnh án và lịch sử điều trị y tế của Thú cưng
    """
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='medical_record',
        verbose_name='Lịch hẹn liên quan'
    )
    pet = models.ForeignKey(
        Pet,
        on_delete=models.CASCADE,
        related_name='medical_records',
        verbose_name='Thú cưng'
    )
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='diagnosed_records',
        limit_choices_to={'role': CustomUser.ROLE_DOCTOR},
        verbose_name='Bác sĩ chẩn đoán'
    )
    symptoms = models.TextField(verbose_name='Triệu chứng bệnh nhận diện')
    diagnosis = models.TextField(verbose_name='Kết quả chẩn đoán y khoa')
    prescription = models.TextField(
        blank=True,
        null=True,
        verbose_name='Đơn thuốc & Phác đồ điều trị'
    )
    revisit_date = models.DateField(
        blank=True,
        null=True,
        verbose_name='Ngày hẹn tái khám'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày lập bệnh án')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật lần cuối')

    class Meta:
        verbose_name = 'Bệnh án thú y'
        verbose_name_plural = 'Danh sách Bệnh án thú y'
        ordering = ['-created_at']

    def __str__(self):
        return f"Bệnh án #{self.id}: {self.pet.name} - Bs. {self.doctor.get_full_name() or self.doctor.username}"


# ==============================================================================
# 3. PHÂN HỆ CỬA HÀNG & ĐƠN HÀNG (Shop & Order - TV3)
# ==============================================================================
class Product(models.Model):
    """
    Danh mục Sản phẩm thú cưng (Thức ăn, Thuốc, Phụ kiện, Đồ chơi...)
    """
    name = models.CharField(max_length=150, verbose_name='Tên sản phẩm')
    category = models.CharField(
        max_length=100,
        verbose_name='Danh mục sản phẩm',
        help_text='Ví dụ: Thức ăn, Phụ kiện, Vệ sinh, Y tế'
    )
    description = models.TextField(blank=True, null=True, verbose_name='Mô tả sản phẩm')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Giá bán niêm yết (VNĐ)')
    stock_quantity = models.PositiveIntegerField(default=0, verbose_name='Số lượng tồn kho')
    is_active = models.BooleanField(default=True, verbose_name='Đang kinh doanh')
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name='Ảnh sản phẩm')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày thêm')

    class Meta:
        verbose_name = 'Sản phẩm'
        verbose_name_plural = 'Danh mục Sản phẩm'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - Kho: {self.stock_quantity} - {int(self.price):,} VNĐ"


class Order(models.Model):
    """
    Quản lý Đơn hàng mua sản phẩm (Thanh toán COD)
    """
    STATUS_PENDING = 'PENDING'
    STATUS_PROCESSING = 'PROCESSING'
    STATUS_SHIPPED = 'SHIPPED'
    STATUS_COMPLETED = 'COMPLETED'
    STATUS_CANCELLED = 'CANCELLED'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Chờ xử lý'),
        (STATUS_PROCESSING, 'Đang chuẩn bị hàng'),
        (STATUS_SHIPPED, 'Đang giao hàng'),
        (STATUS_COMPLETED, 'Hoàn thành / Đã thanh toán'),
        (STATUS_CANCELLED, 'Đã hủy đơn'),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Khách hàng đặt mua'
    )
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Tổng tiền đơn hàng (VNĐ)'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        verbose_name='Trạng thái đơn hàng',
        db_index=True
    )
    shipping_address = models.TextField(verbose_name='Địa chỉ nhận hàng')
    phone_number = models.CharField(max_length=15, verbose_name='Số điện thoại nhận hàng')
    notes = models.TextField(blank=True, null=True, verbose_name='Ghi chú của khách hàng')
    is_stock_deducted = models.BooleanField(
        default=False,
        verbose_name='Đã trừ tồn kho',
        help_text='Tự động đánh dấu khi chuyển sang Processing/Shipped'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo đơn')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật lần cuối')

    class Meta:
        verbose_name = 'Đơn hàng'
        verbose_name_plural = 'Danh sách Đơn hàng'
        ordering = ['-created_at']

    def __str__(self):
        return f"Đơn hàng #{self.id} - {self.customer.username} - {int(self.total_amount):,} VNĐ [{self.get_status_display()}]"

    def recalculate_total(self):
        """Tự động tính toán lại tổng tiền từ OrderItems tại Backend (tránh gian lận giá Client)"""
        total = sum(item.quantity * item.price_at_purchase for item in self.items.all())
        self.total_amount = total
        self.save(update_fields=['total_amount'])
        return total

    def deduct_stock(self):
        """BR-ORD-02, BR-ORD-03: Trừ tồn kho khi đơn hàng được chuẩn bị/giao hàng"""
        from django.db import transaction
        if self.is_stock_deducted:
            return

        with transaction.atomic():
            for item in self.items.select_related('product').select_for_update():
                if not item.product.is_active:
                    raise ValidationError(f"Sản phẩm '{item.product.name}' đã ngưng kinh doanh.")
                if item.product.stock_quantity < item.quantity:
                    raise ValidationError(
                        f"Sản phẩm '{item.product.name}' chỉ còn {item.product.stock_quantity} trong kho, "
                        f"không đủ số lượng yêu cầu ({item.quantity})."
                    )
                item.product.stock_quantity -= item.quantity
                item.product.save(update_fields=['stock_quantity'])

            self.is_stock_deducted = True
            self.save(update_fields=['is_stock_deducted'])

    def restore_stock(self):
        """Khôi phục lại tồn kho nếu đơn hàng bị hủy sau khi đã trừ kho"""
        from django.db import transaction
        if not self.is_stock_deducted:
            return

        with transaction.atomic():
            for item in self.items.select_related('product').select_for_update():
                item.product.stock_quantity += item.quantity
                item.product.save(update_fields=['stock_quantity'])

            self.is_stock_deducted = False
            self.save(update_fields=['is_stock_deducted'])



class OrderItem(models.Model):
    """
    Chi tiết từng sản phẩm trong Đơn hàng
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Đơn hàng'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='order_items',
        verbose_name='Sản phẩm'
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name='Số lượng')
    price_at_purchase = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name='Đơn giá lúc mua (VNĐ)'
    )

    class Meta:
        verbose_name = 'Chi tiết đơn hàng'
        verbose_name_plural = 'Các mặt hàng trong đơn'

    def __str__(self):
        return f"{self.product.name} x {self.quantity} ({int(self.price_at_purchase):,} VNĐ)"

    @property
    def subtotal(self):
        return self.quantity * self.price_at_purchase
