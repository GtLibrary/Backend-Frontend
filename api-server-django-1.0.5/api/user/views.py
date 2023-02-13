from api.user.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
def changepassword(request):

    old_password = request.data['old_password']
    password = request.data['password']
    
    user = request.user
    if not user.check_password(old_password):
        return Response({"success": False}, status.HTTP_208_ALREADY_REPORTED)
    else:
        user.set_password(password)
        user.save()

        return Response({"success": True}, status=status.HTTP_200_OK)