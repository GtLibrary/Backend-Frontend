from .models import Wallet, WalletTransaction
from rest_framework import serializers
from django.db.models import Sum

class WalletSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()

    def get_balance(self, obj):
        bal = WalletTransaction.objects.filter(
            wallet=obj).aggregate(Sum('amount'))['amount__sum']
        return bal

    class Meta:
        model = Wallet
        fields = ['id', 'currency', 'balance']


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'transaction_type', 'amount', 'source', 'destination', 'wallet']