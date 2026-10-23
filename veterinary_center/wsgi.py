"""
WSGI config for veterinary_center project.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinary_center.settings')

application = get_wsgi_application()
