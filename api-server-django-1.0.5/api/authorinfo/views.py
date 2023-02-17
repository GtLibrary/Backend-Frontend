from rest_framework.decorators import api_view
from api.authorinfo.models import Authorinfo
from rest_framework.response import Response
from api.authorinfo.serializers import AuthorinfoSerializer

# Create your views here.
@api_view(['POST'])
def save_authorinfo(request):
    temp = object
    author_bio = request.data['author_bio']
    author_imageurl = request.data['author_imageurl']
    temp, created = Authorinfo.objects.update_or_create(
        author = request.user,
        defaults={ 'author_id': request.user.id, 'author_bio': author_bio, 'author_imageurl':author_imageurl}
    )

    return Response({"success": "true"})

@api_view(['GET'])
def get_authorinfo(request):
    author = Authorinfo.objects.filter(author=request.user).first()
    data = AuthorinfoSerializer(author).data
    return Response(data)