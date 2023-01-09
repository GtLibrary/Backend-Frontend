from django.db import models

# Create your models here.
class OriginType(models.Model):
    origintype = models.CharField(max_length=200, default='')
    pub_date = models.DateTimeField('date published',auto_now=True, null=False, blank=False)
    class Meta:
        ordering = ['origintype']

    def __str__(self):
        return self.origintype