from rest_framework.permissions import BasePermission
from apps.accounts.models import Role


class IsPetOwnerOrStaff(BasePermission):
    """
    Quyền truy cập đối tượng Thú cưng:
    - Khách hàng chỉ xem/sửa/xóa thú cưng do chính mình sở hữu.
    - Bác sĩ, Nhân viên, Admin có quyền xem để hỗ trợ điều trị.
    - Chỉ chủ sở hữu (hoặc Admin) mới được sửa/xóa thú cưng.
    """
    message = "Bạn không có quyền truy cập hoặc chỉnh sửa hồ sơ thú cưng này."

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # Admin có toàn quyền
        if user.is_superuser or user.role == Role.ADMIN:
            return True

        # Bác sĩ và Nhân viên được phép xem (GET) để phục vụ khám bệnh
        if request.method in ('GET', 'HEAD', 'OPTIONS') and user.role in (Role.DOCTOR, Role.STAFF):
            return True

        # Chủ sở hữu có toàn quyền trên thú cưng của mình
        return obj.owner == user

