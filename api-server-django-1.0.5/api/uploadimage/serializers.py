from api.uploadimage.models import Uploadimage
from rest_framework import serializers


class UploadimageSerializer(serializers.ModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Uploadimage
        fields = ["id", "uploadimage", "pub_date"]
        read_only_field = ["id"]
