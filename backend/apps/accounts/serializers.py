from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Role

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer hiển thị thông tin chi tiết người dùng.
    """
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'role',
            'role_display',
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'avatar',
            'date_joined',
        )
        read_only_fields = ('id', 'role', 'role_display', 'date_joined')


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer tiếp nhận và kiểm thực thông tin đăng ký tài khoản Khách hàng mới.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        help_text="Mật khẩu tối thiểu 8 ký tự."
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Xác nhận lại mật khẩu."
    )

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'phone_number',
            'address',
        )

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Tên đăng nhập này đã được sử dụng.")
        return value

    def validate_email(self, value):
        if value and User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email này đã được sử dụng bởi một tài khoản khác.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": ["Mật khẩu xác nhận không khớp."]})
        
        # Áp dụng bộ validator mật khẩu mặc định của Django
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Luôn đặt vai trò là CUSTOMER cho tài khoản tự đăng ký
        user = User(
            role=Role.CUSTOMER,
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Tùy biến JWT Token response trả về kèm thông tin User hồ sơ cá nhân.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer cập nhật thông tin hồ sơ người dùng hiện tại.
    """
    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'address',
            'avatar',
        )

    def validate_email(self, value):
        user = self.context['request'].user
        if value and User.objects.filter(email__iexact=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Email này đã được sử dụng bởi một tài khoản khác.")
        return value

