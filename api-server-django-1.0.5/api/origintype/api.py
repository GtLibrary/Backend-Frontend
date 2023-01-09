from rest_framework import generics
from rest_framework.response import Response
from .serializers import OriginTypeSerializer
from .models import OriginType

class OriginTypeCreateApi(generics.CreateAPIView):
    queryset = OriginType.objects.all()
    serializer_class = OriginTypeSerializer

class OriginTypeApi(generics.ListAPIView):
    queryset = OriginType.objects.all()
    serializer_class = OriginTypeSerializer

class OriginTypeUpdateApi(generics.RetrieveUpdateAPIView):
    queryset = OriginType.objects.all()
    serializer_class = OriginTypeSerializer

class OriginTypeDeleteApi(generics.DestroyAPIView):
    queryset = OriginType.objects.all()
    serializer_class = OriginTypeSerializer