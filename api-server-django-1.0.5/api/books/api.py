from rest_framework import generics
from rest_framework.response import Response
from .serializers import BooksSerializer
from .models import Books
from api.books.permissions import IsStaff

class BooksCreateApi(generics.CreateAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

class BooksApi(generics.ListAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

    def get_queryset(self):
        if(self.request.user.is_superuser):
            return Books.objects.all()
        else:
            return Books.objects.all().filter(user=self.request.user)

class BooksUpdateApi(generics.RetrieveUpdateAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

class BooksDeleteApi(generics.DestroyAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer