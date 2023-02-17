from api.authorinfo.models import Authorinfo
from rest_framework import serializers


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

class AuthorinfoSerializer(DynamicFieldsModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True)
    author_imageurl = serializers.ImageField(required=False)

    class Meta:
        model = Authorinfo
        fields = ('__all__')
        read_only_field = ["id"]
    
    def get_author_imageurl(self, Authorinfo):
        request = self.context.get('request')
        if Authorinfo.author_imageurl:
            author_imageurl = Authorinfo.author_imageurl.url
        else:
            author_imageurl = ''
            
        return request.build_absolute_uri(author_imageurl)
