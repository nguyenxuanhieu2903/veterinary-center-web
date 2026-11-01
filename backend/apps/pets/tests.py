from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User, Role
from .models import Pet, PetGender


class PetAPITests(TestCase):
    """
    Bộ kiểm thử CRUD Thú cưng và Ràng buộc quyền sở hữu (FR-PET-01 -> FR-PET-05, BR-ACL-01).
    """
    def setUp(self):
        self.client = APIClient()

        # Tạo Khách hàng A
        self.customer_a = User.objects.create_user(
            username='khachhang_a',
            password='Password123@',
            role=Role.CUSTOMER,
            email='customer_a@example.com'
        )

        # Tạo Khách hàng B
        self.customer_b = User.objects.create_user(
            username='khachhang_b',
            password='Password123@',
            role=Role.CUSTOMER,
            email='customer_b@example.com'
        )

        # Tạo Bác sĩ
        self.doctor = User.objects.create_user(
            username='bacsi_lan',
            password='Password123@',
            role=Role.DOCTOR,
            email='doctor_lan@example.com'
        )

        # Tạo thú cưng thuộc sở hữu của Khách hàng A
        self.pet_a = Pet.objects.create(
            owner=self.customer_a,
            name='Miu Miu',
            species='Mèo',
            breed='Mèo Anh lông ngắn',
            gender=PetGender.FEMALE,
            weight=4.5
        )

        # Tạo thú cưng thuộc sở hữu của Khách hàng B
        self.pet_b = Pet.objects.create(
            owner=self.customer_b,
            name='Lu Lu',
            species='Chó',
            breed='Golden Retriever',
            gender=PetGender.MALE,
            weight=25.0
        )

        self.list_create_url = reverse('pets:pet_list_create')
        self.detail_a_url = reverse('pets:pet_detail', kwargs={'pk': self.pet_a.id})
        self.detail_b_url = reverse('pets:pet_detail', kwargs={'pk': self.pet_b.id})
        self.history_a_url = reverse('pets:pet_medical_history', kwargs={'pk': self.pet_a.id})

    def get_token(self, username, password='Password123@'):
        resp = self.client.post(reverse('accounts:login'), {
            'username': username,
            'password': password
        }, format='json')
        return resp.data['data']['access']

    def test_create_pet_authenticated_success(self):
        """Khách hàng tạo hồ sơ thú cưng mới thành công, tự động gán chủ sở hữu."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        payload = {
            'name': 'Bim Bim',
            'species': 'Chó',
            'breed': 'Poodle',
            'gender': PetGender.MALE,
            'weight': 3.2,
            'notes': 'Dị ứng phấn hoa'
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['name'], 'Bim Bim')
        self.assertEqual(response.data['data']['owner'], self.customer_a.id)

        # Kiểm tra trong DB
        pet = Pet.objects.get(name='Bim Bim')
        self.assertEqual(pet.owner, self.customer_a)

    def test_create_pet_unauthenticated_fails(self):
        """Tạo thú cưng khi chưa đăng nhập bị trả về 401."""
        response = self.client.post(self.list_create_url, {'name': 'Ghost'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_pets_customer_isolation(self):
        """Khách hàng A chỉ xem được thú cưng của mình, không thấy thú cưng của Khách hàng B."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data']

        pet_names = [item['name'] for item in data]
        self.assertIn('Miu Miu', pet_names)
        self.assertNotIn('Lu Lu', pet_names)

    def test_get_pet_detail_owner_success(self):
        """Chủ thú cưng xem chi tiết thú cưng của mình thành công."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.detail_a_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Miu Miu')

    def test_get_pet_detail_other_customer_forbidden(self):
        """Khách hàng A sửa URL để xem thú cưng của Khách hàng B bị trả về 403 Forbidden (BR-ACL-01)."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.detail_b_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(response.data['success'])

    def test_update_pet_owner_success(self):
        """Chủ thú cưng cập nhật thông tin thành công."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.patch(self.detail_a_url, {'weight': 5.0}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['data']['weight']), 5.0)

    def test_update_pet_other_customer_forbidden(self):
        """Khách hàng A cố tình sửa thông tin thú cưng của Khách hàng B bị trả về 403 Forbidden."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.patch(self.detail_b_url, {'weight': 30.0}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_pet_owner_success(self):
        """Chủ thú cưng xóa hồ sơ thú cưng thành công."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.delete(self.detail_a_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Pet.objects.filter(id=self.pet_a.id).exists())

    def test_doctor_can_view_any_pet(self):
        """Bác sĩ có quyền xem hồ sơ thú cưng của khách hàng để phục vụ khám chữa bệnh."""
        token = self.get_token('bacsi_lan')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.detail_a_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Miu Miu')

    def test_pet_medical_history_endpoint(self):
        """Xem lịch sử khám bệnh của thú cưng thành công."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.history_a_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('history', response.data['data'])

    def test_get_pet_medical_history_other_customer_forbidden(self):
        """Khách hàng A cố tình xem lịch sử khám của thú cưng thuộc Khách hàng B bị chặn 403 Forbidden (BR-ACL-01)."""
        token = self.get_token('khachhang_a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        history_b_url = reverse('pets:pet_medical_history', kwargs={'pk': self.pet_b.id})
        response = self.client.get(history_b_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

