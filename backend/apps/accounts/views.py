from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from config.responses import api_response
from .models import Role
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    UserProfileUpdateSerializer,
)
from .permissions import IsCustomer, IsDoctor, IsStaff, IsAdmin, IsStaffOrAdmin


class RegisterView(APIView):
    """
    API đăng ký tài khoản Khách hàng mới (CUSTOMER).
    POST /api/v1/accounts/register/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            data = UserSerializer(user).data
            return api_response(
                success=True,
                code=status.HTTP_201_CREATED,
                message="Đăng ký tài khoản thành công.",
                data=data,
                http_status=status.HTTP_201_CREATED,
            )
        return api_response(
            success=False,
            code=status.HTTP_400_BAD_REQUEST,
            message="Thông tin đăng ký không hợp lệ.",
            errors=serializer.errors,
            http_status=status.HTTP_400_BAD_REQUEST,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    API đăng nhập nhận JWT Token và thông tin User.
    POST /api/v1/accounts/login/ hoặc POST /api/v1/accounts/token/
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            return api_response(
                success=True,
                code=status.HTTP_200_OK,
                message="Đăng nhập thành công.",
                data=response.data,
            )
        return response


class CustomTokenRefreshView(TokenRefreshView):
    """
    API làm mới JWT Access Token.
    POST /api/v1/accounts/token/refresh/
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            return api_response(
                success=True,
                code=status.HTTP_200_OK,
                message="Làm mới access token thành công.",
                data=response.data,
            )
        return response


class ProfileView(APIView):
    """
    API xem và cập nhật hồ sơ cá nhân của người dùng hiện tại.
    GET /api/v1/accounts/profile/
    PUT/PATCH /api/v1/accounts/profile/
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Lấy thông tin cá nhân thành công.",
            data=serializer.data,
        )

    def put(self, request):
        return self._update(request, partial=False)

    def patch(self, request):
        return self._update(request, partial=True)

    def _update(self, request, partial):
        serializer = UserProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=partial,
            context={'request': request}
        )
        if serializer.is_valid():
            user = serializer.save()
            data = UserSerializer(user).data
            return api_response(
                success=True,
                code=status.HTTP_200_OK,
                message="Cập nhật thông tin cá nhân thành công.",
                data=data,
            )
        return api_response(
            success=False,
            code=status.HTTP_400_BAD_REQUEST,
            message="Thông tin cập nhật không hợp lệ.",
            errors=serializer.errors,
            http_status=status.HTTP_400_BAD_REQUEST,
        )


# ============================================================================
# CÁC ENDPOINT KIỂM THỬ PHÂN QUYỀN RBAC (Dành cho Unit Tests & Verify BR-ACL-01)
# ============================================================================

class DoctorPortalTestView(APIView):
    """
    Endpoint bảo vệ dành riêng cho Bác sĩ. Khách hàng/Nhân viên không có quyền truy cập.
    """
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Truy cập Doctor Portal thành công.",
            data={"doctor_id": request.user.id, "username": request.user.username}
        )


class StaffDashboardTestView(APIView):
    """
    Endpoint bảo vệ dành riêng cho Nhân viên/Admin. Khách hàng không có quyền truy cập.
    """
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]

    def get(self, request):
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Truy cập Staff Dashboard thành công.",
            data={"staff_id": request.user.id, "username": request.user.username}
        )


class AdminPanelTestView(APIView):
    """
    Endpoint bảo vệ dành riêng cho Admin.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Truy cập Admin Panel thành công.",
            data={"admin_id": request.user.id, "username": request.user.username}
        )
