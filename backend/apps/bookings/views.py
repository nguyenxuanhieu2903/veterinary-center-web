import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model

from config.responses import api_response
from apps.accounts.models import Role
from .models import Service, Appointment, AppointmentStatus
from .serializers import (
    ServiceSerializer,
    DoctorSimpleSerializer,
    AppointmentSerializer,
    AppointmentCreateSerializer,
)
from .tasks import send_booking_confirmation_email_task

logger = logging.getLogger(__name__)
User = get_user_model()


class ServiceListView(APIView):
    """
    API Lấy danh sách Dịch vụ Thú y khả dụng.
    GET /api/v1/bookings/services/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        services = Service.objects.filter(is_active=True)
        serializer = ServiceSerializer(services, many=True)
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Lấy danh mục dịch vụ thành công.",
            data=serializer.data,
        )


class DoctorListView(APIView):
    """
    API Lấy danh sách Bác sĩ Thú y khả dụng cho việc chọn ca khám.
    GET /api/v1/bookings/doctors/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctors = User.objects.filter(role=Role.DOCTOR, is_active=True)
        serializer = DoctorSimpleSerializer(doctors, many=True)
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Lấy danh sách bác sĩ thành công.",
            data=serializer.data,
        )


class AppointmentListCreateView(APIView):
    """
    API Danh sách & Đặt lịch khám mới.
    GET /api/v1/bookings/appointments/
    POST /api/v1/bookings/appointments/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        queryset = Appointment.objects.select_related('customer', 'pet', 'service', 'doctor')

        if user.role == Role.CUSTOMER:
            # Khách hàng chỉ xem lịch của chính mình
            appointments = queryset.filter(customer=user)
        elif user.role == Role.DOCTOR:
            # Bác sĩ xem ca khám được phân công
            appointments = queryset.filter(doctor=user)
        else:
            # Staff và Admin xem toàn bộ
            appointments = queryset.all()

        # Bộ lọc tùy chọn (Filter params)
        date_param = request.query_params.get('date')
        status_param = request.query_params.get('status')
        if date_param:
            appointments = appointments.filter(appointment_date=date_param)
        if status_param:
            appointments = appointments.filter(status=status_param)

        serializer = AppointmentSerializer(appointments, many=True)
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Lấy danh sách lịch khám thành công.",
            data=serializer.data,
        )

    def post(self, request):
        serializer = AppointmentCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            appointment = serializer.save()

            # BR-APP-02: Đẩy tác vụ gửi Email xác nhận ngầm qua Celery Worker
            try:
                send_booking_confirmation_email_task.delay(appointment.id)
            except Exception as exc:
                logger.warning(f"[Celery] Chưa kết nối được Redis Broker để gửi email: {exc}")

            return api_response(
                success=True,
                code=status.HTTP_201_CREATED,
                message="Đặt lịch khám thành công. Lịch hẹn đang chờ xác nhận.",
                data=AppointmentSerializer(appointment).data,
                http_status=status.HTTP_201_CREATED,
            )

        return api_response(
            success=False,
            code=status.HTTP_400_BAD_REQUEST,
            message="Thông tin đặt lịch không hợp lệ.",
            errors=serializer.errors,
            http_status=status.HTTP_400_BAD_REQUEST,
        )


class AppointmentDetailView(APIView):
    """
    API Xem chi tiết một ca khám.
    GET /api/v1/bookings/appointments/{id}/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            appointment = Appointment.objects.select_related('customer', 'pet', 'service', 'doctor').get(pk=pk)
        except Appointment.DoesNotExist:
            return api_response(
                success=False,
                code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy lịch hẹn khám.",
                http_status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        # Kiểm tra quyền: Chỉ chủ lịch hẹn, Bác sĩ được gán, hoặc Staff/Admin mới được xem
        if user.role == Role.CUSTOMER and appointment.customer != user:
            return api_response(
                success=False,
                code=status.HTTP_403_FORBIDDEN,
                message="Bạn không có quyền xem thông tin lịch khám này.",
                http_status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AppointmentSerializer(appointment)
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Lấy chi tiết lịch khám thành công.",
            data=serializer.data,
        )


class AppointmentCancelView(APIView):
    """
    API Hủy lịch khám.
    PATCH /api/v1/bookings/appointments/{id}/cancel/
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            appointment = Appointment.objects.select_related('customer').get(pk=pk)
        except Appointment.DoesNotExist:
            return api_response(
                success=False,
                code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy lịch hẹn khám.",
                http_status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        # Chỉ chủ sở hữu ca khám hoặc Nhân viên/Admin mới có quyền hủy
        if user.role == Role.CUSTOMER and appointment.customer != user:
            return api_response(
                success=False,
                code=status.HTTP_403_FORBIDDEN,
                message="Bạn không có quyền hủy lịch khám này.",
                http_status=status.HTTP_403_FORBIDDEN,
            )

        if appointment.status in [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]:
            return api_response(
                success=False,
                code=status.HTTP_400_BAD_REQUEST,
                message=f"Không thể hủy ca khám đã ở trạng thái {appointment.get_status_display()}.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        appointment.status = AppointmentStatus.CANCELLED
        appointment.save()

        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Hủy lịch khám thành công.",
            data=AppointmentSerializer(appointment).data,
        )
