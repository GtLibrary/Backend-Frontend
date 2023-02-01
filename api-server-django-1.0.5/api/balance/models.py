from django.db import models

# Create your models here.
class Balance(models.Model):
    user_id = models.CharField(max_length=200, default='')
    deposite_cc_value = models.DecimalField(max_digits = 12, decimal_places=3, default=0.0)
    pub_date = models.DateTimeField('date published',auto_now=True, null=False, blank=False)
    class Meta:
        ordering = ['user_id']

    def __str__(self):
        return self.user_id