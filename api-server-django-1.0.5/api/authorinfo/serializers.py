from api.authorinfo.models import Authorinfo
from rest_framework import serializers


class AuthorinfoSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Authorinfo
        fields = ["id", "author_id", "author_bio", "author_imageurl"]
        read_only_field = ["id"]