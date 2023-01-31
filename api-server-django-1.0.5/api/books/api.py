from html5lib import serializer
from rest_framework import generics
from rest_framework.response import Response
from .serializers import BooksSerializer
from .models import Books

class BooksCreateApi(generics.CreateAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

    def perform_create(self, serializer_class):
        serializer_class.save(user=self.request.user)

class BooksApi(generics.ListAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

    def get_queryset(self):
        print(self.request.user.is_superuser)
        if(self.request.user.is_superuser):
            return Books.objects.all()
        else:
            return Books.objects.all().filter(user=self.request.user)

class BooksUpdateApi(generics.RetrieveUpdateAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

class BooksDeleteApi(generics.DestroyAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer