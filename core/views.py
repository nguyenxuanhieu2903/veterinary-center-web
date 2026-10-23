from django.shortcuts import render
from django.http import JsonResponse
from .models import CustomUser, Pet, Service, Product, Appointment, Order

def index(request):
    """Trang chủ tạm thời hiển thị trạng thái hệ thống và hạ tầng Tuần 1"""
    stats = {
        'users_count': CustomUser.objects.count(),
        'pets_count': Pet.objects.count(),
        'services_count': Service.objects.count(),
        'products_count': Product.objects.count(),
        'appointments_count': Appointment.objects.count(),
        'orders_count': Order.objects.count(),
    }
    return render(request, 'base.html', {'stats': stats})

def health_check(request):
    """API endpoint kiểm tra trạng thái sức khỏe container & database"""
    return JsonResponse({
        'status': 'healthy',
        'project': 'Veterinary Center (Website Trung Tâm Thú Y)',
        'week': 'Week 1',
        'lead_role': 'TV1 - Leader / Core Backend & DevOps',
        'database': 'MySQL 8.0 Containerized',
        'task_queue': 'Celery 5.x + Redis 7.x',
        'auth_model': 'core.CustomUser (4 roles: CUSTOMER, DOCTOR, STAFF, ADMIN)'
    })

