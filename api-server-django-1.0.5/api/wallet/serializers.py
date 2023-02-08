from .models import Wallet, WalletTransaction
from rest_framework import serializers
from django.db.models import Sum
from decimal import Decimal

class WalletSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()

    def get_balance(self, obj):
        depositbal = WalletTransaction.objects.filter(
            wallet=obj, transaction_type="deposit").aggregate(Sum('amount'))['amount__sum']
        transferbal = WalletTransaction.objects.filter(
            wallet=obj, transaction_type="transfer").aggregate(Sum('amount'))['amount__sum']
        bal = Decimal(0 if depositbal is None else depositbal) - Decimal(0 if transferbal is None else transferbal)
        return bal

    class Meta:
        model = Wallet
        fields = ['id', 'currency', 'balance']


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'transaction_type', 'amount', 'source', 'destination', 'wallet']