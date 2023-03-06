from django.db import models
from django.conf import settings
# Create your models here.

class Wallet(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)
    currency = models.CharField(max_length=50, default='CC')
    created_at = models.DateTimeField(auto_now=True, null=False, blank=False)

    def __str__(self):
        return self.user.__str__()


class WalletTransaction(models.Model):

    TRANSACTION_TYPES = (
        ('deposit', 'deposit'),
        ('transfer', 'transfer'),
    )
    wallet = models.ForeignKey(Wallet, null=True, on_delete=models.CASCADE)
    transaction_type = models.CharField(
        max_length=200, null=True,  choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=100, null=True, decimal_places=2)
    timestamp = models.DateTimeField(auto_now=True, null=False, blank=False)
    source = models.ForeignKey(
        Wallet, null=True, on_delete=models.CASCADE, related_name='source', blank=True)
    destination = models.ForeignKey(
        Wallet, null=True, on_delete=models.CASCADE, related_name='destination', blank=True)

    def __str__(self):
        return self.wallet.user.__str__()