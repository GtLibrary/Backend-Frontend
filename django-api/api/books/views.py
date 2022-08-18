from django.shortcuts import render
from api.books.serializers import BooksSerializer
from api.books.models import Books
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def getbooklist(request):
    fields = ('id', 'title','image_url')
    books = Books.objects.all().only('id', 'title','image_url')
    data = BooksSerializer(books, context={"request": request}, many=True, fields = fields).data
    return Response(data)