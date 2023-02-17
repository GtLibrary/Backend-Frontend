from rest_framework import generics
from rest_framework.response import Response
from api.authorinfo.serializers import AuthorinfoSerializer
from api.authorinfo.models import Authorinfo
from api.authorinfo.permissions import IsStaff

class AuthorinfoCreateApi(generics.CreateAPIView):
    permission_classes = (IsStaff,)
    queryset = Authorinfo.objects.all()
    serializer_class = AuthorinfoSerializer

    def perform_create(self, serializer_class):
        serializer_class.save(user=self.request.user)

class AuthorinfoApi(generics.ListAPIView):
    queryset = Authorinfo.objects.all()
    serializer_class = AuthorinfoSerializer

class AuthorinfoUpdateApi(generics.RetrieveUpdateAPIView):
    permission_classes = (IsStaff,)
    queryset = Authorinfo.objects.all()
    serializer_class = AuthorinfoSerializer

class AuthorinfoDeleteApi(generics.DestroyAPIView):
    permission_classes = (IsStaff,)
    queryset = Authorinfo.objects.all()
    serializer_class = AuthorinfoSerializer