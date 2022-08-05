from api.origintype.models import OriginType
from rest_framework import serializers


class OriginTypeSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = OriginType
        fields = ["id", "origintype", "pub_date"]
        read_only_field = ["id"]
