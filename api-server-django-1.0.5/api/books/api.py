from rest_framework import generics
from rest_framework.response import Response
from .serializers import BooksSerializer
from .models import Books

class BooksCreateApi(generics.CreateAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

class BooksApi(generics.ListAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

class BooksUpdateApi(generics.RetrieveUpdateAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

class BooksDeleteApi(generics.DestroyAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer