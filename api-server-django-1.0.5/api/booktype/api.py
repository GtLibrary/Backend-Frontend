from rest_framework import generics
from rest_framework.response import Response
from .serializers import BookTypeSerializer
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from .models import BookType

class BookTypeCreateApi(generics.CreateAPIView):
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeApi(generics.ListAPIView):
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeUpdateApi(generics.RetrieveUpdateAPIView):
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeDeleteApi(generics.DestroyAPIView):
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer