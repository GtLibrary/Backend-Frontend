from django.db import models

# Create your models here.
class Customers(models.Model):
    wallet_address = models.CharField(max_length=200, default='')
    book_id = models.BigIntegerField(default=0)
    pub_date = models.DateTimeField('date published',auto_now=True, null=False, blank=False)
    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.origintype