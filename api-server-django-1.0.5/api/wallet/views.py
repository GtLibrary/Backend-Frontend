from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import WalletSerializer, WalletTransactionSerializer
from .models import *
from rest_framework import generics
from rest_framework import status
from django.utils import timezone
# Create your views here

class WalletInfo(APIView):
    def get(self, request):
        # user_id = request.data['user_id']
        wallet = Wallet.objects.get(user=request.user)
        data = WalletSerializer(wallet).data
        return Response(data)

@api_view(['GET'])
def getwalletinfo(request):
    wallet = object
    try:
        wallet = Wallet.objects.get(user=request.user)
    except Wallet.DoesNotExist:
        wallet, created = Wallet.objects.update_or_create(
            user = request.user,
            defaults={ "user_id": request.user.id, 'currency': 'CC'}
        )
    data = WalletSerializer(wallet).data
    return Response(data)

@api_view(['GET'])
def wallet_transactions(request):
    #paginator = PageNumberPagination()
    #wallet = Wallet.objects.get(user=request.user)
    transactions = WalletTransaction.objects.filter(wallet__user=request.user)
    #context = paginator.paginate_queryset(transactions, request)
    serializer = WalletTransactionSerializer(transactions, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def transaction_detail(request, transaction_pk):
    try:
        transaction = WalletTransaction.objects.get(
            id=transaction_pk, wallet__user=request.user)
    except WalletTransaction.DoesNotExist:
        return Response({"status": False, "detail": "Transaction Not Found"}, status.HTTP_404_NOT_FOUND)

    serializer = WalletTransactionSerializer(transaction)

    return Response(serializer.data)


@api_view(['POST'])
def deposit_funds(request):
    wallet = object
    try:
        wallet = Wallet.objects.get(user=request.user)
    except Wallet.DoesNotExist:
        wallet, created = Wallet.objects.update_or_create(
            user = request.user,
            defaults={ "user_id": request.user.id, 'currency': 'CC'}
        )

    deposit = WalletTransaction.objects.create(
        wallet = wallet,
        transaction_type = "deposit",
        amount = request.data['amount'],
        source = wallet,
        destination = wallet,
    )

    try:
        serializer = WalletTransactionSerializer(deposit)
        return Response(serializer.data)
    except deposit.DoesNotExist:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def transfer(request):
    wallet = object
    try:
        wallet = Wallet.objects.get(user=request.data['user_id'])
    except Wallet.DoesNotExist:
        wallet, created = Wallet.objects.update_or_create(
            user_id = request.data['user_id'],
            defaults={ 'user_id': request.data['user_id'], 'currency': 'CC'}
        )

    transfer = WalletTransaction.objects.create(
        wallet = wallet,
        transaction_type = "transfer",
        amount = request.data['amount'],
        source = wallet,
        destination = wallet,
    )

    try:
        serializer = WalletTransactionSerializer(transfer)
        return Response(serializer.data)
    except transfer.DoesNotExist:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)