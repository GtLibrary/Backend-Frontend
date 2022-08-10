from rest_framework import generics
from rest_framework.response import Response
from .serializers import UploadimageSerializer
from .models import Uploadimage

class UploadimageCreateApi(generics.CreateAPIView):
    queryset = Uploadimage.objects.all()
    serializer_class = UploadimageSerializer

class UploadimageApi(generics.ListAPIView):
    queryset = Uploadimage.objects.all()
    serializer_class = UploadimageSerializer

class UploadimageUpdateApi(generics.RetrieveUpdateAPIView):
    queryset = Uploadimage.objects.all()
    serializer_class = UploadimageSerializer

class UploadimageDeleteApi(generics.DestroyAPIView):
    queryset = Uploadimage.objects.all()
    serializer_class = UploadimageSerializer