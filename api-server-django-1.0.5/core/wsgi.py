"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
#import dotenv
#dotenv.read_dotenv(os.path.join(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".."), '.env'))

from dotenv import load_dotenv
load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

_nativeEnvironment = os.environ.copy()

application = get_wsgi_application()
