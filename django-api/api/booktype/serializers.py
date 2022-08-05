from api.booktype.models import BookType
from rest_framework import serializers


class BookTypeSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = BookType
        fields = ["id", "booktype", "pub_date"]
        read_only_field = ["id"]
