from api.balance.models import Balance
from rest_framework import serializers


class BalanceSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Balance
        fields = ["id", "user_id", "deposite_cc_value", "pub_date"]
        read_only_field = ["id"]
