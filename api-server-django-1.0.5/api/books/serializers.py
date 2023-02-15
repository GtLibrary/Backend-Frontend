from api.books.models import Books
from rest_framework import serializers
from api.booktype.serializers import BookTypeSerializer
from api.user.serializers import UserSerializer

class DynamicFieldsModelSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
class BooksSerializer(DynamicFieldsModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True)
    image_url = serializers.ImageField(required=False)

    class Meta:
        model = Books
        fields = ('__all__')
        read_only_field = ["id"]
    
    def get_image_url(self, Books):
        request = self.context.get('request')
        if Books.image_url:
            image_url = Books.image_url.url
        else:
            image_url = ''
        return request.build_absolute_uri(image_url)
