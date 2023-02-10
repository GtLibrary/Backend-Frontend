from django.db import models

# Create your models here.
class AIpricemodel(models.Model):
    aiprice = models.DecimalField(max_digits=100, null=True, decimal_places=2)
    
    class Meta:
        ordering = ['aiprice']

    def __str__(self):
        return self.aiprice