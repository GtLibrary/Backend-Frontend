from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from api.aiprice.models import AIpricemodel
from rest_framework import generics
from api.aiprice.serializers import AIpriceSerializer
from api.aiprice.permissions import IsSuperUser
# Create your views here

@api_view(['GET'])
def getaiprice(request):
    aiprice = AIpricemodel.objects.last()
    if(aiprice):
        aiprice = aiprice.aiprice
    else:
        aiprice = 0
    
    return Response(aiprice)

class AIpriceSet(generics.CreateAPIView):
    permission_classes = (IsSuperUser,)
    queryset = AIpricemodel.objects.all()
    serializer_class = AIpriceSerializer