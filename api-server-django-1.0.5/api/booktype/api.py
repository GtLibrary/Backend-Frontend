from rest_framework import generics
from .serializers import BookTypeSerializer
from .models import BookType
from api.booktype.permissions import IsSuperUser

class BookTypeCreateApi(generics.CreateAPIView):
    permission_classes = (IsSuperUser,)
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeApi(generics.ListAPIView):
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeUpdateApi(generics.RetrieveUpdateAPIView):
    permission_classes = (IsSuperUser,)
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeDeleteApi(generics.DestroyAPIView):
    permission_classes = (IsSuperUser,)
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer