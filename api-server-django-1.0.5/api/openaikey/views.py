from django.shortcuts import render
from rest_framework.decorators import api_view
from api.openaikey.models import Apikey
from rest_framework.response import Response
from api.openaikey.serializers import openaikeySerializer

# Create your views here.
@api_view(['POST'])
def save_openaikey(request):
    temp = object
    api_key = request.data['api_key']
    
    temp, created = Apikey.objects.update_or_create(
        user = request.user,
        defaults={ 'user_id': request.user.id, 'api_key': api_key}
    )

    return Response({"success": "true"})

@api_view(['GET'])
def get_openaikey(request):
    api_key = Apikey.objects.filter(user=request.user).first()
    data = openaikeySerializer(api_key).data
    return Response(data)