from rest_framework.permissions import BasePermission
from .models import Role


class IsCustomer(BasePermission):
    """
    Quyền truy cập dành riêng cho Khách hàng (hoặc Superuser).
    """
    message = "Quyền truy cập bị từ chối. Chỉ Khách hàng mới có quyền thực hiện thao tác này."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == Role.CUSTOMER or request.user.is_superuser)
        )


class IsDoctor(BasePermission):
    """
    Quyền truy cập dành cho Bác sĩ thú y (hoặc Superuser).
    """
    message = "Quyền truy cập bị từ chối. Chỉ Bác sĩ thú y mới có quyền thực hiện thao tác này."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == Role.DOCTOR or request.user.is_superuser)
        )


class IsStaff(BasePermission):
    """
    Quyền truy cập dành cho Nhân viên trung tâm (hoặc Superuser).
    """
    message = "Quyền truy cập bị từ chối. Chỉ Nhân viên trung tâm mới có quyền thực hiện thao tác này."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == Role.STAFF or request.user.is_superuser)
        )


class IsAdmin(BasePermission):
    """
    Quyền truy cập dành cho Quản trị viên (hoặc Superuser).
    """
    message = "Quyền truy cập bị từ chối. Chỉ Quản trị viên mới có quyền thực hiện thao tác này."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == Role.ADMIN or request.user.is_superuser or request.user.is_staff)
        )


class IsStaffOrAdmin(BasePermission):
    """
    Quyền truy cập dành cho Nhân viên hoặc Quản trị viên.
    """
    message = "Quyền truy cập bị từ chối. Chỉ Nhân viên hoặc Quản trị viên mới có quyền thực hiện."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in [Role.STAFF, Role.ADMIN] or request.user.is_superuser or request.user.is_staff)
        )
