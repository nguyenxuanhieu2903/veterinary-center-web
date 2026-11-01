from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from config.responses import api_response
from apps.accounts.models import Role
from .models import Pet
from .serializers import PetSerializer
from .permissions import IsPetOwnerOrStaff


class PetListCreateView(APIView):
    """
    API Danh sách & Thêm mới thú cưng.
    GET /api/v1/pets/
    POST /api/v1/pets/
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        user = request.user
        # Khách hàng chỉ xem thú cưng của mình, Nhân viên/Admin/Bác sĩ có thể xem tất cả
        if user.role == Role.CUSTOMER:
            pets = Pet.objects.filter(owner=user)
        else:
            owner_id = request.query_params.get('owner_id')
            if owner_id:
                pets = Pet.objects.filter(owner_id=owner_id)
            else:
                pets = Pet.objects.all()

        serializer = PetSerializer(pets, many=True)
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Lấy danh sách thú cưng thành công.",
            data=serializer.data,
        )

    def post(self, request):
        serializer = PetSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            pet = serializer.save()
            return api_response(
                success=True,
                code=status.HTTP_201_CREATED,
                message="Tạo hồ sơ thú cưng mới thành công.",
                data=PetSerializer(pet).data,
                http_status=status.HTTP_201_CREATED,
            )
        return api_response(
            success=False,
            code=status.HTTP_400_BAD_REQUEST,
            message="Thông tin thú cưng không hợp lệ.",
            errors=serializer.errors,
            http_status=status.HTTP_400_BAD_REQUEST,
        )


class PetDetailView(APIView):
    """
    API Xem chi tiết, cập nhật và xóa hồ sơ thú cưng.
    GET /api/v1/pets/{id}/
    PUT/PATCH /api/v1/pets/{id}/
    DELETE /api/v1/pets/{id}/
    """
    permission_classes = [IsAuthenticated, IsPetOwnerOrStaff]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, pk):
        try:
            pet = Pet.objects.select_related('owner').get(pk=pk)
            self.check_object_permissions(self.request, pet)
            return pet
        except Pet.DoesNotExist:
            return None

    def get(self, request, pk):
        pet = self.get_object(pk)
        if pet is None:
            return api_response(
                success=False,
                code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy hồ sơ thú cưng.",
                http_status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PetSerializer(pet)
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Lấy thông tin thú cưng thành công.",
            data=serializer.data,
        )

    def put(self, request, pk):
        return self._update(request, pk, partial=False)

    def patch(self, request, pk):
        return self._update(request, pk, partial=True)

    def _update(self, request, pk, partial):
        pet = self.get_object(pk)
        if pet is None:
            return api_response(
                success=False,
                code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy hồ sơ thú cưng.",
                http_status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PetSerializer(pet, data=request.data, partial=partial, context={'request': request})
        if serializer.is_valid():
            updated_pet = serializer.save()
            return api_response(
                success=True,
                code=status.HTTP_200_OK,
                message="Cập nhật hồ sơ thú cưng thành công.",
                data=PetSerializer(updated_pet).data,
            )
        return api_response(
            success=False,
            code=status.HTTP_400_BAD_REQUEST,
            message="Thông tin cập nhật không hợp lệ.",
            errors=serializer.errors,
            http_status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        pet = self.get_object(pk)
        if pet is None:
            return api_response(
                success=False,
                code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy hồ sơ thú cưng.",
                http_status=status.HTTP_404_NOT_FOUND,
            )
        pet.delete()
        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Xóa hồ sơ thú cưng thành công.",
            data={},
        )


class PetMedicalHistoryView(APIView):
    """
    API Xem lịch sử khám bệnh của thú cưng.
    GET /api/v1/pets/{id}/medical-history/
    """
    permission_classes = [IsAuthenticated, IsPetOwnerOrStaff]

    def get(self, request, pk):
        try:
            pet = Pet.objects.get(pk=pk)
            self.check_object_permissions(request, pet)
        except Pet.DoesNotExist:
            return api_response(
                success=False,
                code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy hồ sơ thú cưng.",
                http_status=status.HTTP_404_NOT_FOUND,
            )

        # Lấy danh sách lịch hẹn của thú cưng
        appointments = pet.appointments.select_related('service', 'doctor').all().order_by('-appointment_date')
        history_data = []
        for appt in appointments:
            item = {
                "appointment_id": appt.id,
                "appointment_date": appt.appointment_date,
                "time_slot": appt.time_slot,
                "status": appt.status,
                "status_display": appt.get_status_display(),
                "service_name": appt.service.name if appt.service else None,
                "doctor_name": appt.doctor.get_full_name() if appt.doctor else (appt.doctor.username if appt.doctor else "Chưa phân công"),
                "notes": appt.notes,
            }
            # Nếu có MedicalRecord ở Giai đoạn 3 thì lấy kèm thông tin chẩn đoán
            if hasattr(appt, 'medical_record') and appt.medical_record:
                mr = appt.medical_record
                item["medical_record"] = {
                    "symptoms": mr.symptoms,
                    "diagnosis": mr.diagnosis,
                    "treatment_plan": mr.treatment_plan,
                    "revisit_date": mr.revisit_date,
                }
            history_data.append(item)

        return api_response(
            success=True,
            code=status.HTTP_200_OK,
            message="Lấy lịch sử khám bệnh của thú cưng thành công.",
            data={
                "pet_id": pet.id,
                "pet_name": pet.name,
                "history": history_data
            }
        )
