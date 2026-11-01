from django.urls import path
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    ProfileView,
    DoctorPortalTestView,
    StaffDashboardTestView,
    AdminPanelTestView,
)

app_name = 'accounts'

urlpatterns = [
    # Xác thực & Token
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),

    # Hồ sơ cá nhân
    path('profile/', ProfileView.as_view(), name='profile'),

    # Endpoints kiểm thử phân quyền RBAC (BR-ACL-01)
    path('test/doctor-only/', DoctorPortalTestView.as_view(), name='test_doctor_only'),
    path('test/staff-only/', StaffDashboardTestView.as_view(), name='test_staff_only'),
    path('test/admin-only/', AdminPanelTestView.as_view(), name='test_admin_only'),
]

