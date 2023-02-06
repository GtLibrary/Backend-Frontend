from django.db import models
from django.conf import settings
# Create your models here.

class Apikey(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)
    api_key = models.CharField(max_length=200, default='')

    def __str__(self):
        return self.user.__str__()