from django.db import models
from django.conf import settings

# Create your models here.
class Authorinfo(models.Model):
    author_imageurl = models.CharField(max_length=200, default='')
    author_id = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='author', null=True, on_delete=models.CASCADE)
    author_bio = models.TextField()

    class Meta:
        ordering = ['author_id']

    def __str__(self):
        return self.author_id
