from api.books.models import Books
from rest_framework import serializers


class BooksSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Books
        fields = ["id", "title", "content", "image_url", "author_wallet", "bookmark_img_url", "curserial_number", "datamine", "origin_type_id", "book_type_id", "pub_date"]
        read_only_field = ["id"]
