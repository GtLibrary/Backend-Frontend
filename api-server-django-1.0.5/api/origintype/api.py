from rest_framework import generics
from rest_framework.response import Response
from .serializers import OriginTypeSerializer
from .models import OriginType
from api.origintype.permissions import IsSuperUser

class OriginTypeCreateApi(generics.CreateAPIView):
    permission_classes = (IsSuperUser,)
    queryset = OriginType.objects.all()
    serializer_class = OriginTypeSerializer

class OriginTypeApi(generics.ListAPIView):
    queryset = OriginType.objects.all()
    serializer_class = OriginTypeSerializer

class OriginTypeUpdateApi(generics.RetrieveUpdateAPIView):
    permission_classes = (IsSuperUser,)
    queryset = OriginType.objects.all()
    serializer_class = OriginTypeSerializer

class OriginTypeDeleteApi(generics.DestroyAPIView):
    permission_classes = (IsSuperUser,)
    queryset = OriginType.objects.all()
    serializer_class = OriginTypeSerializer