from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser,
    Pet,
    Service,
    Product,
    Appointment,
    MedicalRecord,
    Order,
    OrderItem,
)


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',)

    fieldsets = UserAdmin.fieldsets + (
        ('Thông tin phân quyền & mở rộng', {
            'fields': ('role', 'phone_number', 'address', 'avatar')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Thông tin bổ sung', {
            'fields': ('role', 'phone_number', 'address', 'avatar')
        }),
    )


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'species', 'breed', 'gender', 'weight', 'owner', 'created_at')
    list_filter = ('species', 'gender', 'created_at')
    search_fields = ('name', 'breed', 'owner__username', 'owner__email', 'owner__first_name')
    autocomplete_fields = ('owner',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'duration', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('price', 'is_active')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'stock_quantity', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'category', 'description')
    list_editable = ('price', 'stock_quantity', 'is_active')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'customer', 'service', 'doctor', 'appointment_date', 'time_slot', 'status')
    list_filter = ('status', 'appointment_date', 'service')
    search_fields = ('pet__name', 'customer__username', 'doctor__username', 'notes')
    list_editable = ('status',)
    autocomplete_fields = ('customer', 'pet', 'doctor')


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'doctor', 'appointment', 'revisit_date', 'created_at')
    list_filter = ('revisit_date', 'created_at')
    search_fields = ('pet__name', 'doctor__username', 'symptoms', 'diagnosis')
    autocomplete_fields = ('pet', 'doctor')


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('subtotal',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'total_amount', 'status', 'is_stock_deducted', 'phone_number', 'created_at')
    list_filter = ('status', 'is_stock_deducted', 'created_at')
    search_fields = ('customer__username', 'shipping_address', 'phone_number')
    list_editable = ('status',)
    readonly_fields = ('is_stock_deducted',)
    inlines = [OrderItemInline]
    autocomplete_fields = ('customer',)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Tự động trừ hoặc khôi phục tồn kho khi trạng thái đơn đổi trong Admin
        if obj.status in [Order.STATUS_PROCESSING, Order.STATUS_SHIPPED] and not obj.is_stock_deducted:
            try:
                obj.deduct_stock()
                self.message_user(request, f"Đã trừ tồn kho thành công cho Đơn hàng #{obj.id}.")
            except Exception as e:
                self.message_user(request, f"Lỗi trừ kho: {str(e)}", level='ERROR')
        elif obj.status == Order.STATUS_CANCELLED and obj.is_stock_deducted:
            obj.restore_stock()
            self.message_user(request, f"Đã khôi phục tồn kho cho Đơn hàng #{obj.id}.")



@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'price_at_purchase', 'subtotal')
    list_filter = ('product__category',)
    search_fields = ('order__id', 'product__name')
