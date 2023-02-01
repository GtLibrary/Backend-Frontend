from rest_framework import generics
from rest_framework.response import Response
from .serializers import BalanceSerializer
from .models import Balance

class BalanceCreateApi(generics.CreateAPIView):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

class BalanceApi(generics.ListAPIView):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

class BalanceUpdateApi(generics.RetrieveUpdateAPIView):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

class BalanceDeleteApi(generics.DestroyAPIView):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer