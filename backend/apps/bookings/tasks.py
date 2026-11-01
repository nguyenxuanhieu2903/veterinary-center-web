import logging
from datetime import date, timedelta
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_booking_confirmation_email_task(self, appointment_id):
    """
    Celery Task: Gửi Email xác nhận đặt lịch khám ngầm đến Khách hàng (FR-APP-04).
    Thực thi bất đồng bộ qua Redis Broker để đảm bảo HTTP response < 2s (BR-APP-02).
    """
    from .models import Appointment

    try:
        appointment = Appointment.objects.select_related('customer', 'pet', 'service', 'doctor').get(pk=appointment_id)
        customer = appointment.customer
        recipient_email = customer.email

        if not recipient_email:
            logger.warning(f"[Celery] Khách hàng {customer.username} không có địa chỉ email. Bỏ qua gửi email.")
            return f"No email for user {customer.username}"

        doctor_name = appointment.doctor.get_full_name() or appointment.doctor.username if appointment.doctor else "Sẽ được phân công tại quầy"
        subject = f"Veterinary Center — Xác nhận lịch hẹn khám #{appointment.id}"
        message = (
            f"Kính gửi {customer.get_full_name() or customer.username},\n\n"
            f"Trung tâm Thú y (Veterinary Center) xin thông báo lịch hẹn khám của bạn đã được tiếp nhận thành công:\n"
            f"--------------------------------------------------\n"
            f"• Mã lịch hẹn: #{appointment.id}\n"
            f"• Thú cưng: {appointment.pet.name} ({appointment.pet.species})\n"
            f"• Dịch vụ: {appointment.service.name}\n"
            f"• Ngày hẹn: {appointment.appointment_date.strftime('%d/%m/%Y')}\n"
            f"• Khung giờ: {appointment.time_slot}\n"
            f"• Bác sĩ phụ trách: {doctor_name}\n"
            f"• Trạng thái: {appointment.get_status_display()}\n"
            f"--------------------------------------------------\n\n"
            f"Quý khách vui lòng đưa thú cưng đến trung tâm đúng giờ để được phục vụ tốt nhất.\n"
            f"Hotline hỗ trợ: 1900-VET-CARE (1900 8382).\n\n"
            f"Trân trọng,\nĐội ngũ Bác sĩ Thú y Veterinary Center"
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        logger.info(f"[Celery] Đã gửi email xác nhận đặt lịch #{appointment.id} tới {recipient_email}")
        return f"Confirmation email sent to {recipient_email}"

    except Appointment.DoesNotExist:
        logger.error(f"[Celery] Không tìm thấy lịch hẹn #{appointment_id}")
        return f"Appointment #{appointment_id} not found"
    except Exception as exc:
        logger.error(f"[Celery] Lỗi khi gửi email xác nhận lịch #{appointment_id}: {exc}")
        # Thử lại tối đa 3 lần nếu gặp lỗi kết nối mạng
        try:
            self.retry(exc=exc)
        except Exception:
            return f"Failed to send email: {exc}"


@shared_task(bind=True, max_retries=3, default_retry_delay=120)
def send_appointment_reminder_email_task(self, appointment_id=None):
    """
    Celery Task: Gửi Email nhắc lịch hẹn khám trước 24h (FR-APP-06).
    """
    from .models import Appointment, AppointmentStatus

    sent_count = 0
    try:
        if appointment_id:
            appointments = Appointment.objects.filter(pk=appointment_id)
        else:
            tomorrow = date.today() + timedelta(days=1)
            appointments = Appointment.objects.filter(
                appointment_date=tomorrow,
                status__in=[AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
            ).select_related('customer', 'pet', 'service', 'doctor')

        for appt in appointments:
            customer = appt.customer
            recipient_email = customer.email
            if not recipient_email:
                continue

            doctor_name = appt.doctor.get_full_name() or appt.doctor.username if appt.doctor else "Bác sĩ tại trung tâm"
            subject = f"Veterinary Center — Nhắc lịch hẹn khám ngày mai #{appt.id}"
            message = (
                f"Kính gửi {customer.get_full_name() or customer.username},\n\n"
                f"Trung tâm Thú y xin nhắc bạn về ca khám dự kiến vào ngày mai:\n"
                f"• Thú cưng: {appt.pet.name}\n"
                f"• Dịch vụ: {appt.service.name}\n"
                f"• Thời gian: {appt.appointment_date.strftime('%d/%m/%Y')} lúc {appt.time_slot}\n"
                f"• Bác sĩ: {doctor_name}\n\n"
                f"Hẹn gặp lại bạn và bé cưng tại trung tâm!\n"
                f"Trân trọng,\nVeterinary Center"
            )

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            sent_count += 1

        logger.info(f"[Celery] Đã gửi {sent_count} email nhắc lịch hẹn.")
        return f"Sent {sent_count} reminder emails"

    except Exception as exc:
        logger.error(f"[Celery] Lỗi khi gửi email nhắc lịch: {exc}")
        try:
            self.retry(exc=exc)
        except Exception:
            return f"Failed: {exc}"

