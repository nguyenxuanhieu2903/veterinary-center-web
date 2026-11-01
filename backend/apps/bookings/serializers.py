from datetime import date
from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.pets.models import Pet
from apps.accounts.models import Role
from .models import Service, Appointment, AppointmentStatus

User = get_user_model()


class ServiceSerializer(serializers.ModelSerializer):
    """
    Serializer hiển thị danh mục Dịch vụ y tế.
    """
    class Meta:
        model = Service
        fields = (
            'id',
            'name',
            'description',
            'price_vnd',
            'duration_minutes',
            'is_active',
        )


class DoctorSimpleSerializer(serializers.ModelSerializer):
    """
    Serializer hiển thị danh sách Bác sĩ khả dụng.
    """
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'full_name',
            'phone_number',
            'avatar',
        )

    def get_full_name(self, obj):
        name = obj.get_full_name().strip()
        return name if name else obj.username


class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer hiển thị thông tin chi tiết lịch hẹn khám.
    """
    customer_username = serializers.ReadOnlyField(source='customer.username')
    customer_name = serializers.ReadOnlyField(source='customer.get_full_name')
    pet_name = serializers.ReadOnlyField(source='pet.name')
    pet_species = serializers.ReadOnlyField(source='pet.species')
    service_name = serializers.ReadOnlyField(source='service.name')
    service_price = serializers.ReadOnlyField(source='service.price_vnd')
    doctor_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Appointment
        fields = (
            'id',
            'customer',
            'customer_username',
            'customer_name',
            'pet',
            'pet_name',
            'pet_species',
            'service',
            'service_name',
            'service_price',
            'doctor',
            'doctor_name',
            'appointment_date',
            'time_slot',
            'status',
            'status_display',
            'notes',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'customer', 'status', 'created_at', 'updated_at')

    def get_doctor_name(self, obj):
        if not obj.doctor:
            return "Chưa phân công"
        name = obj.doctor.get_full_name().strip()
        return name if name else obj.doctor.username


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer xử lý đặt lịch khám mới kèm ràng buộc nghiệp vụ BR-APP-01.
    """
    class Meta:
        model = Appointment
        fields = (
            'pet',
            'service',
            'doctor',
            'appointment_date',
            'time_slot',
            'notes',
        )

    def validate_pet(self, pet):
        request = self.context.get('request')
        user = request.user if request else None

        # Khách hàng chỉ được đặt lịch cho thú cưng do chính mình sở hữu
        if user and user.role == Role.CUSTOMER and pet.owner != user:
            raise serializers.ValidationError("Bạn chỉ có thể đặt lịch cho thú cưng do chính mình sở hữu.")
        return pet

    def validate_doctor(self, doctor):
        if doctor and doctor.role != Role.DOCTOR:
            raise serializers.ValidationError("Người dùng được chọn không phải là Bác sĩ thú y.")
        return doctor

    def validate_appointment_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("Không thể đặt lịch khám cho một ngày trong quá khứ.")
        return value

    def validate(self, attrs):
        doctor = attrs.get('doctor')
        appointment_date = attrs.get('appointment_date')
        time_slot = attrs.get('time_slot')
        pet = attrs.get('pet')

        # 1. Ràng buộc BR-APP-01: Kiểm tra Bác sĩ không thể nhận 2 ca trùng thời gian
        if doctor and appointment_date and time_slot:
            conflict = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                time_slot=time_slot
            ).exclude(status=AppointmentStatus.CANCELLED).exists()

            if conflict:
                raise serializers.ValidationError({
                    "doctor": ["Bác sĩ này đã có lịch khám vào khung giờ trên. Vui lòng chọn bác sĩ hoặc khung giờ khác."]
                })

        # 2. Ràng buộc: Thú cưng không được có 2 lịch hẹn trùng nhau trong cùng khung giờ
        if pet and appointment_date and time_slot:
            pet_conflict = Appointment.objects.filter(
                pet=pet,
                appointment_date=appointment_date,
                time_slot=time_slot
            ).exclude(status=AppointmentStatus.CANCELLED).exists()

            if pet_conflict:
                raise serializers.ValidationError({
                    "pet": ["Thú cưng này đã có lịch hẹn trong cùng khung giờ."]
                })

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['customer'] = request.user
        validated_data['status'] = AppointmentStatus.PENDING
        return super().create(validated_data)

