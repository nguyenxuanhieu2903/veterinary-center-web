from django.urls import path
from .views import PetListCreateView, PetDetailView, PetMedicalHistoryView

app_name = 'pets'

urlpatterns = [
    path('', PetListCreateView.as_view(), name='pet_list_create'),
    path('<int:pk>/', PetDetailView.as_view(), name='pet_detail'),
    path('<int:pk>/medical-history/', PetMedicalHistoryView.as_view(), name='pet_medical_history'),
]

