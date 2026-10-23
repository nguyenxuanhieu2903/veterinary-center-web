import logging
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


@shared_task
def send_booking_confirmation_email(appointment_id):
    """
    FR-APP-04: Tự động gửi Email xác nhận đặt lịch ngầm qua Celery
    """
    from core.models import Appointment
    try:
        appointment = Appointment.objects.select_related('customer', 'pet', 'service', 'doctor').get(id=appointment_id)
        subject = f"[Veterinary Center] Xác nhận lịch hẹn khám #{appointment.id}"
        message = (
            f"Xin chào {appointment.customer.get_full_name() or appointment.customer.username},\n\n"
            f"Lịch hẹn khám của bạn đã được ghi nhận thành công:\n"
            f"- Thú cưng: {appointment.pet.name} ({appointment.pet.species})\n"
            f"- Dịch vụ: {appointment.service.name}\n"
            f"- Bác sĩ: {appointment.doctor.get_full_name() if appointment.doctor else 'Sẽ được phân công'}\n"
            f"- Ngày khám: {appointment.appointment_date}\n"
            f"- Khung giờ: {appointment.time_slot}\n"
            f"- Trạng thái: {appointment.get_status_display()}\n\n"
            f"Cảm ơn bạn đã tin tưởng dịch vụ của Trung Tâm Thú Y!"
        )
        recipient_list = [appointment.customer.email] if appointment.customer.email else []
        if recipient_list:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'no-reply@vetcenter.local',
                recipient_list=recipient_list,
                fail_silently=False,
            )
            logger.info(f"Booking confirmation email sent for appointment #{appointment.id} to {recipient_list}")
        return f"Booking confirmation email processed for appointment #{appointment_id}"
    except Appointment.DoesNotExist:
        logger.error(f"Appointment #{appointment_id} does not exist.")
        return f"Appointment #{appointment_id} not found"
    except Exception as e:
        logger.error(f"Failed to send booking confirmation email for appointment #{appointment_id}: {str(e)}")
        raise e


@shared_task
def send_appointment_reminder_email(appointment_id):
    """
    FR-APP-06: Celery Beat / Task gửi Email nhắc lịch khám trước 24h
    """
    from core.models import Appointment
    try:
        appointment = Appointment.objects.select_related('customer', 'pet', 'service', 'doctor').get(id=appointment_id)
        if appointment.status == Appointment.STATUS_CANCELLED:
            return f"Appointment #{appointment_id} is cancelled, skip reminder."

        subject = f"[Veterinary Center] Nhắc lịch hẹn khám ngày mai cho {appointment.pet.name}"
        message = (
            f"Xin chào {appointment.customer.get_full_name() or appointment.customer.username},\n\n"
            f"Đây là tin nhắn nhắc nhở bạn có lịch hẹn khám thú cưng vào ngày mai:\n"
            f"- Thú cưng: {appointment.pet.name}\n"
            f"- Dịch vụ: {appointment.service.name}\n"
            f"- Giờ khám: {appointment.time_slot} ngày {appointment.appointment_date}\n\n"
            f"Vui lòng đưa thú cưng đến đúng giờ để được phục vụ chu đáo nhất!"
        )
        recipient_list = [appointment.customer.email] if appointment.customer.email else []
        if recipient_list:
            send_mail(
                subject=subject,
                message=message,
                from_email='no-reply@vetcenter.local',
                recipient_list=recipient_list,
                fail_silently=False,
            )
            logger.info(f"Reminder email sent for appointment #{appointment.id}")
        return f"Reminder email processed for appointment #{appointment_id}"
    except Exception as e:
        logger.error(f"Failed to send reminder for appointment #{appointment_id}: {str(e)}")
        raise e
