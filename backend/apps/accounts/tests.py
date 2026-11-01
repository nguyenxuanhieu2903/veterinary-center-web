from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import User, Role


class AccountsAuthTests(TestCase):
    """
    Bộ kiểm thử Đăng ký, Đăng nhập, Token Refresh và Quản lý Profile.
    """
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('accounts:register')
        self.login_url = reverse('accounts:login')
        self.refresh_url = reverse('accounts:token_refresh')
        self.profile_url = reverse('accounts:profile')

        self.valid_user_data = {
            'username': 'nguyenvana',
            'email': 'nguyenvana@example.com',
            'password': 'SecurePassword123@',
            'password_confirm': 'SecurePassword123@',
            'first_name': 'Văn A',
            'last_name': 'Nguyễn',
            'phone_number': '0901234567',
            'address': '123 Đường Nguyễn Huệ, Q1, TP.HCM',
        }

    def test_register_customer_success(self):
        """Kiểm tra đăng ký tài khoản Khách hàng thành công."""
        response = self.client.post(self.register_url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['code'], 201)
        self.assertEqual(response.data['data']['username'], 'nguyenvana')
        self.assertEqual(response.data['data']['role'], Role.CUSTOMER)

        # Kiểm tra user được lưu vào database và mật khẩu được mã hóa an toàn
        user = User.objects.get(username='nguyenvana')
        self.assertTrue(user.check_password('SecurePassword123@'))
        self.assertEqual(user.role, Role.CUSTOMER)

    def test_register_password_mismatch(self):
        """Kiểm tra đăng ký thất bại khi mật khẩu xác nhận không khớp."""
        data = self.valid_user_data.copy()
        data['password_confirm'] = 'DifferentPassword123@'
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('password_confirm', response.data['errors'])

    def test_register_duplicate_username(self):
        """Kiểm tra đăng ký thất bại khi trùng username."""
        self.client.post(self.register_url, self.valid_user_data, format='json')
        response = self.client.post(self.register_url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data['errors'])

    def test_login_success(self):
        """Kiểm tra đăng nhập thành công nhận JWT Tokens."""
        # Đăng ký tài khoản trước
        self.client.post(self.register_url, self.valid_user_data, format='json')

        login_data = {
            'username': 'nguyenvana',
            'password': 'SecurePassword123@'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data'])
        self.assertIn('refresh', response.data['data'])
        self.assertEqual(response.data['data']['user']['username'], 'nguyenvana')

    def test_login_invalid_credentials(self):
        """Kiểm tra đăng nhập thất bại khi sai mật khẩu."""
        login_data = {
            'username': 'nonexistent',
            'password': 'WrongPassword123@'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data['success'])

    def test_token_refresh(self):
        """Kiểm tra làm mới JWT access token qua refresh token."""
        self.client.post(self.register_url, self.valid_user_data, format='json')
        login_resp = self.client.post(self.login_url, {
            'username': 'nguyenvana',
            'password': 'SecurePassword123@'
        }, format='json')
        refresh_token = login_resp.data['data']['refresh']

        refresh_resp = self.client.post(self.refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(refresh_resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_resp.data['data'])

    def test_profile_authenticated_access_and_update(self):
        """Kiểm tra xem và cập nhật hồ sơ cá nhân khi đã đăng nhập."""
        self.client.post(self.register_url, self.valid_user_data, format='json')
        login_resp = self.client.post(self.login_url, {
            'username': 'nguyenvana',
            'password': 'SecurePassword123@'
        }, format='json')
        access_token = login_resp.data['data']['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # 1. GET Profile
        profile_resp = self.client.get(self.profile_url)
        self.assertEqual(profile_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_resp.data['data']['username'], 'nguyenvana')

        # 2. PATCH Profile
        update_data = {
            'first_name': 'Văn Bình',
            'phone_number': '0988776655',
            'role': 'ADMIN'  # Cố tình đổi role sang ADMIN
        }
        patch_resp = self.client.patch(self.profile_url, update_data, format='json')
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_resp.data['data']['first_name'], 'Văn Bình')
        self.assertEqual(patch_resp.data['data']['phone_number'], '0988776655')

        # Đảm bảo role vẫn là CUSTOMER, không bị thay đổi
        user = User.objects.get(username='nguyenvana')
        self.assertEqual(user.role, Role.CUSTOMER)

    def test_profile_unauthenticated_forbidden(self):
        """Kiểm tra truy cập Profile khi chưa đăng nhập trả về 401."""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AccountsRBACTests(TestCase):
    """
    Bộ kiểm thử Phân quyền 4 vai trò (BR-ACL-01: RBAC Access Control).
    """
    def setUp(self):
        self.client = APIClient()
        self.doctor_test_url = reverse('accounts:test_doctor_only')
        self.staff_test_url = reverse('accounts:test_staff_only')
        self.admin_test_url = reverse('accounts:test_admin_only')

        # Tạo 4 tài khoản với 4 vai trò khác nhau
        self.customer_user = User.objects.create_user(
            username='test_customer',
            password='Password123@',
            role=Role.CUSTOMER
        )
        self.doctor_user = User.objects.create_user(
            username='test_doctor',
            password='Password123@',
            role=Role.DOCTOR
        )
        self.staff_user = User.objects.create_user(
            username='test_staff',
            password='Password123@',
            role=Role.STAFF
        )
        self.admin_user = User.objects.create_superuser(
            username='test_admin',
            password='Password123@',
            role=Role.ADMIN
        )

    def get_token_for_user(self, username, password='Password123@'):
        resp = self.client.post(reverse('accounts:login'), {
            'username': username,
            'password': password
        }, format='json')
        return resp.data['data']['access']

    def test_customer_cannot_access_doctor_portal(self):
        """Khách hàng truy cập Doctor Portal bị chặn HTTP 403 Forbidden (BR-ACL-01)."""
        token = self.get_token_for_user('test_customer')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.doctor_test_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(response.data['success'])

    def test_customer_cannot_access_staff_dashboard(self):
        """Khách hàng truy cập Staff Dashboard bị chặn HTTP 403 Forbidden (BR-ACL-01)."""
        token = self.get_token_for_user('test_customer')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.staff_test_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(response.data['success'])

    def test_customer_cannot_access_admin_panel(self):
        """Khách hàng truy cập Admin Panel bị chặn HTTP 403 Forbidden (BR-ACL-01)."""
        token = self.get_token_for_user('test_customer')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.admin_test_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(response.data['success'])

    def test_doctor_access_doctor_portal_success(self):
        """Bác sĩ truy cập Doctor Portal thành công HTTP 200 OK."""
        token = self.get_token_for_user('test_doctor')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.doctor_test_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_doctor_cannot_access_admin_panel(self):
        """Bác sĩ không có quyền truy cập Admin Panel (HTTP 403 Forbidden)."""
        token = self.get_token_for_user('test_doctor')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.admin_test_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_access_staff_dashboard_success(self):
        """Nhân viên truy cập Staff Dashboard thành công HTTP 200 OK."""
        token = self.get_token_for_user('test_staff')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.staff_test_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_staff_cannot_access_doctor_portal(self):
        """Nhân viên không có quyền truy cập Doctor Portal (HTTP 403 Forbidden)."""
        token = self.get_token_for_user('test_staff')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.doctor_test_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_access_all_panels_success(self):
        """Quản trị viên (Admin/Superuser) có quyền truy cập các Panel."""
        token = self.get_token_for_user('test_admin')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Admin truy cập Doctor portal
        doc_resp = self.client.get(self.doctor_test_url)
        self.assertEqual(doc_resp.status_code, status.HTTP_200_OK)

        # Admin truy cập Staff dashboard
        staff_resp = self.client.get(self.staff_test_url)
        self.assertEqual(staff_resp.status_code, status.HTTP_200_OK)

        # Admin truy cập Admin panel
        admin_resp = self.client.get(self.admin_test_url)
        self.assertEqual(admin_resp.status_code, status.HTTP_200_OK)
