from api.aiprice.models import AIpricemodel
from rest_framework import serializers


class AIpriceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = AIpricemodel
        fields = ["id", "aiprice"]
        read_only_field = ["id"]
