from django.db import models

# Create your models here.
class Uploadimage(models.Model):
    uploadimage = models.ImageField(upload_to='upload_images', blank=True, null=True)
    pub_date = models.DateTimeField('date published',auto_now=True, null=False, blank=False)
    class Meta:
        ordering = ['uploadimage']

    def __str__(self):
        return self.uploadimage
