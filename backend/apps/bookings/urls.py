from django.urls import path
from .views import (
    ServiceListView,
    DoctorListView,
    AppointmentListCreateView,
    AppointmentDetailView,
    AppointmentCancelView,
)

app_name = 'bookings'

urlpatterns = [
    # Dịch vụ & Bác sĩ
    path('services/', ServiceListView.as_view(), name='service_list'),
    path('doctors/', DoctorListView.as_view(), name='doctor_list'),

    # Lịch hẹn khám
    path('appointments/', AppointmentListCreateView.as_view(), name='appointment_list_create'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment_detail'),
    path('appointments/<int:pk>/cancel/', AppointmentCancelView.as_view(), name='appointment_cancel'),
]

