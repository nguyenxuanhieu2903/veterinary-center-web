"""
ASGI config for veterinary_center project.
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinary_center.settings')

application = get_asgi_application()
