from django.contrib import admin
from .models import Pet


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'species', 'breed', 'gender', 'owner', 'weight', 'created_at')
    list_filter = ('species', 'gender', 'created_at')
    search_fields = ('name', 'breed', 'owner__username', 'owner__first_name', 'owner__last_name')
    ordering = ('-created_at',)
