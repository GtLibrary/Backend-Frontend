from django.shortcuts import render
from rest_framework.decorators import api_view
from api.openaikey.models import Apikey
from rest_framework.response import Response
from api.openaikey.serializers import openaikeySerializer

# Create your views here.
@api_view(['POST'])
def save_openaikey(request):
    temp = object
    user_id = request.data['user_id']
    api_key = request.data['api_key']
    
    temp, created = Apikey.objects.update_or_create(
        user_id = user_id,
        defaults={ 'user_id': user_id, 'api_key': api_key}
    )

    print(temp)

    return Response({"success": "true"})

@api_view(['GET'])
def get_openaikey(request, pk):
    api_key = Apikey.objects.filter(user_id=pk).first()
    data = openaikeySerializer(api_key).data
    return Response(data)