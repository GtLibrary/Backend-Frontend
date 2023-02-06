from rest_framework import generics
from rest_framework.response import Response
from .serializers import BookTypeSerializer
from .models import BookType
from .permissions import IsStaff, IsOwner
from rest_framework.permissions import DjangoModelPermissions

class BookTypeCreateApi(generics.CreateAPIView):
    permission_classes = [IsStaff, IsOwner]
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeApi(generics.ListAPIView):
    permission_classes = [IsStaff, IsOwner]
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeUpdateApi(generics.RetrieveUpdateAPIView):
    permission_classes = [IsStaff, IsOwner]
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer

class BookTypeDeleteApi(generics.DestroyAPIView):
    permission_classes = [IsStaff, IsOwner]
    queryset = BookType.objects.all()
    serializer_class = BookTypeSerializer