from api.openaikey.models import Apikey
from rest_framework import serializers


class openaikeySerializer(serializers.ModelSerializer):

    class Meta:
        model = Apikey
        fields = ["id", "user_id", "api_key"]
        read_only_field = ["id"]
