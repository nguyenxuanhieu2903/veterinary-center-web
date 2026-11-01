from datetime import date, timedelta
from unittest.mock import patch
from django.test import TestCase
from django.urls import reverse
from django.core import mail
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User, Role
from apps.pets.models import Pet, PetGender
from .models import Service, Appointment, AppointmentStatus
from .tasks import send_booking_confirmation_email_task, send_appointment_reminder_email_task


class BookingAPITests(TestCase):
    """
    Bộ kiểm thử Đặt lịch khám, Danh mục Dịch vụ và Quy tắc BR-APP-01, BR-APP-02.
    """
    def setUp(self):
        self.client = APIClient()

        # Mock Celery delay để kiểm tra gọi async task mà không phụ thuộc broker redis thật trong unit tests
        patcher = patch('apps.bookings.views.send_booking_confirmation_email_task.delay')
        self.mock_delay = patcher.start()
        self.addCleanup(patcher.stop)

        # Tạo Khách hàng 1 và Khách hàng 2
        self.customer1 = User.objects.create_user(
            username='khach1',
            password='Password123@',
            role=Role.CUSTOMER,
            email='khach1@example.com',
            first_name='An',
            last_name='Lê'
        )
        self.customer2 = User.objects.create_user(
            username='khach2',
            password='Password123@',
            role=Role.CUSTOMER,
            email='khach2@example.com',
            first_name='Bình',
            last_name='Trần'
        )

        # Tạo 2 Bác sĩ
        self.doctor1 = User.objects.create_user(
            username='dr_minh',
            password='Password123@',
            role=Role.DOCTOR,
            email='dr_minh@example.com',
            first_name='Minh',
            last_name='Bác Sĩ'
        )
        self.doctor2 = User.objects.create_user(
            username='dr_huong',
            password='Password123@',
            role=Role.DOCTOR,
            email='dr_huong@example.com',
            first_name='Hương',
            last_name='Bác Sĩ'
        )

        # Tạo Thú cưng
        self.pet1 = Pet.objects.create(
            owner=self.customer1,
            name='Kiki',
            species='Chó',
            breed='Corgi',
            gender=PetGender.MALE
        )
        self.pet2 = Pet.objects.create(
            owner=self.customer2,
            name='Miu',
            species='Mèo',
            breed='Xiêm',
            gender=PetGender.FEMALE
        )

        # Tạo Dịch vụ khám
        self.service = Service.objects.create(
            name='Khám sức khỏe tổng quát',
            description='Kiểm tra tai, mắt, răng miệng, tim phổi',
            price_vnd=200000,
            duration_minutes=45,
            is_active=True
        )

        self.services_url = reverse('bookings:service_list')
        self.doctors_url = reverse('bookings:doctor_list')
        self.appointments_url = reverse('bookings:appointment_list_create')

        self.future_date = date.today() + timedelta(days=2)
        self.time_slot = "09:00-10:00"

    def get_token(self, username, password='Password123@'):
        resp = self.client.post(reverse('accounts:login'), {
            'username': username,
            'password': password
        }, format='json')
        return resp.data['data']['access']

    def test_list_services_public(self):
        """Mọi người đều có thể xem danh mục Dịch vụ y tế."""
        response = self.client.get(self.services_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['name'], 'Khám sức khỏe tổng quát')

    def test_list_doctors_authenticated(self):
        """Khách hàng đăng nhập xem được danh sách Bác sĩ khả dụng."""
        token = self.get_token('khach1')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.doctors_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 2)

    def test_create_appointment_success(self):
        """Khách hàng đặt lịch khám thành công với thông tin hợp lệ."""
        token = self.get_token('khach1')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        payload = {
            'pet': self.pet1.id,
            'service': self.service.id,
            'doctor': self.doctor1.id,
            'appointment_date': self.future_date.isoformat(),
            'time_slot': self.time_slot,
            'notes': 'Bé cưng có dấu hiệu biếng ăn gần đây.'
        }
        response = self.client.post(self.appointments_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['status'], AppointmentStatus.PENDING)
        self.assertEqual(response.data['data']['customer'], self.customer1.id)
        # Kiểm tra tác vụ Celery được gọi với ID ca khám vừa tạo (BR-APP-02)
        self.mock_delay.assert_called_once_with(response.data['data']['id'])

    def test_create_appointment_unowned_pet_fails(self):
        """Khách hàng 1 không thể đặt lịch cho thú cưng của Khách hàng 2."""
        token = self.get_token('khach1')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        payload = {
            'pet': self.pet2.id,  # Pet của khach2
            'service': self.service.id,
            'doctor': self.doctor1.id,
            'appointment_date': self.future_date.isoformat(),
            'time_slot': self.time_slot,
        }
        response = self.client.post(self.appointments_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('pet', response.data['errors'])

    def test_create_appointment_past_date_fails(self):
        """Không thể đặt lịch vào ngày trong quá khứ."""
        token = self.get_token('khach1')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        past_date = date.today() - timedelta(days=1)
        payload = {
            'pet': self.pet1.id,
            'service': self.service.id,
            'doctor': self.doctor1.id,
            'appointment_date': past_date.isoformat(),
            'time_slot': self.time_slot,
        }
        response = self.client.post(self.appointments_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('appointment_date', response.data['errors'])

    def test_doctor_conflict_validation_br_app_01(self):
        """
        QUY TẮC BR-APP-01:
        1 Bác sĩ không thể nhận 2 ca trùng ngày và khung giờ.
        Chỉ khi ca trước bị HỦY (CANCELLED) thì khung giờ đó mới được mở lại.
        """
        token1 = self.get_token('khach1')
        token2 = self.get_token('khach2')

        # 1. Khách 1 đặt lịch thành công với Bác sĩ 1 vào ngày future_date lúc 09:00-10:00
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token1}')
        payload1 = {
            'pet': self.pet1.id,
            'service': self.service.id,
            'doctor': self.doctor1.id,
            'appointment_date': self.future_date.isoformat(),
            'time_slot': self.time_slot,
        }
        resp1 = self.client.post(self.appointments_url, payload1, format='json')
        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)
        appointment1_id = resp1.data['data']['id']

        # 2. Khách 2 đặt cùng Bác sĩ 1, cùng ngày future_date và cùng khung giờ 09:00-10:00
        # => BẮT BUỘC BỊ TỪ CHỐI HTTP 400 (Trùng lịch)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token2}')
        payload2 = {
            'pet': self.pet2.id,
            'service': self.service.id,
            'doctor': self.doctor1.id,
            'appointment_date': self.future_date.isoformat(),
            'time_slot': self.time_slot,
        }
        resp2 = self.client.post(self.appointments_url, payload2, format='json')
        self.assertEqual(resp2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp2.data['success'])
        self.assertIn('doctor', resp2.data['errors'])

        # Nhưng nếu Khách 2 chọn Bác sĩ 2 thì ĐẶT THÀNH CÔNG
        payload2['doctor'] = self.doctor2.id
        resp2_alt = self.client.post(self.appointments_url, payload2, format='json')
        self.assertEqual(resp2_alt.status_code, status.HTTP_201_CREATED)

        # 3. Khách 1 hủy ca khám ban đầu
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token1}')
        cancel_url = reverse('bookings:appointment_cancel', kwargs={'pk': appointment1_id})
        cancel_resp = self.client.patch(cancel_url)
        self.assertEqual(cancel_resp.status_code, status.HTTP_200_OK)

        # 4. Sau khi ca 1 bị CANCELLED, Khách 2 đặt lại với Bác sĩ 1 vào khung giờ đó => THÀNH CÔNG
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token2}')
        payload2['doctor'] = self.doctor1.id
        # Tạo thêm 1 pet nữa cho khách 2 để tránh trùng pet
        pet2_alt = Pet.objects.create(owner=self.customer2, name='Miu Con', species='Mèo')
        payload2['pet'] = pet2_alt.id
        resp2_retry = self.client.post(self.appointments_url, payload2, format='json')
        self.assertEqual(resp2_retry.status_code, status.HTTP_201_CREATED)

    def test_cancel_appointment_by_other_customer_forbidden(self):
        """Khách hàng khác cố tình gửi request hủy lịch hẹn của người khác bị trả về 403 Forbidden."""
        token1 = self.get_token('khach1')
        token2 = self.get_token('khach2')

        # Khách 1 tạo lịch hẹn
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token1}')
        resp = self.client.post(self.appointments_url, {
            'pet': self.pet1.id,
            'service': self.service.id,
            'doctor': self.doctor1.id,
            'appointment_date': self.future_date.isoformat(),
            'time_slot': '14:00-15:00',
        }, format='json')
        appt_id = resp.data['data']['id']

        # Khách 2 cố tình gửi request hủy ca của khách 1
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token2}')
        cancel_url = reverse('bookings:appointment_cancel', kwargs={'pk': appt_id})
        cancel_resp = self.client.patch(cancel_url)
        self.assertEqual(cancel_resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_celery_task_send_booking_confirmation(self):
        """Kiểm tra Celery Task gửi Email xác nhận đặt lịch ngầm (BR-APP-02, FR-APP-04)."""
        # Tạo trực tiếp 1 appointment trong DB
        appointment = Appointment.objects.create(
            customer=self.customer1,
            pet=self.pet1,
            service=self.service,
            doctor=self.doctor1,
            appointment_date=self.future_date,
            time_slot="10:00-11:00",
            status=AppointmentStatus.PENDING
        )

        # Gọi trực tiếp task synchronous
        result = send_booking_confirmation_email_task(appointment.id)
        self.assertIn("Confirmation email sent", result)

        # Kiểm tra hòm thư outbox của Django test runner
        self.assertEqual(len(mail.outbox), 1)
        sent_email = mail.outbox[0]
        self.assertIn("Xác nhận lịch hẹn khám", sent_email.subject)
        self.assertIn(self.customer1.email, sent_email.to)
        self.assertIn(self.pet1.name, sent_email.body)
        self.assertIn(self.service.name, sent_email.body)

    def test_celery_task_send_appointment_reminder(self):
        """Kiểm tra Celery Task gửi Email nhắc lịch hẹn trước 24h (FR-APP-06)."""
        tomorrow = date.today() + timedelta(days=1)
        appointment = Appointment.objects.create(
            customer=self.customer1,
            pet=self.pet1,
            service=self.service,
            doctor=self.doctor1,
            appointment_date=tomorrow,
            time_slot="08:00-09:00",
            status=AppointmentStatus.CONFIRMED
        )

        mail.outbox = []
        result = send_appointment_reminder_email_task()
        self.assertIn("Sent 1 reminder emails", result)

        self.assertEqual(len(mail.outbox), 1)
        sent_email = mail.outbox[0]
        self.assertIn("Nhắc lịch hẹn khám ngày mai", sent_email.subject)
        self.assertIn(self.customer1.email, sent_email.to)
        self.assertIn(self.pet1.name, sent_email.body)

