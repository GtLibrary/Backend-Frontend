from rest_framework import generics
from rest_framework.response import Response
from .serializers import BooksSerializer
from .models import Books
from api.books.permissions import IsStaff
import os
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings

class BooksCreateApi(generics.CreateAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

    def perform_create(self, serializer_class):
        # cwd = os.getcwd()
        # fontpath = (cwd + '/static/fonts/century-gothic.ttf')
        # font = ImageFont.truetype(fontpath, 36)

        # title = self.request.data.get('title')
        # max_book_supply = self.request.data.get('max_book_supply')
        # max_hardbound_supply = self.request.data.get('max_hardbound_supply')
        # bm_listdata = self.request.data.get('bm_listdata')
        # image_file = self.request.FILES.get('image_url')

        # for i in range(int(max_book_supply)):

        #     try: 
        #         img = Image.open(image_file)
        #     except OSError:
        #         return OSError

        #     if img.format not in ['JPEG', 'PNG', 'GIF']:
        #         raise ValueError('Unsupported image format')
        #     # # Check the image size (optional)
        #     # if image_file.size > 2 * 1024 * 1024:
        #     #     raise ValueError('Image size exceeds 2MB limit')
        #     # # Check the image dimensions (optional)
        #     # if img.width < 800 or img.height < 600:
        #     #     raise ValueError('Image dimensions are too small')
        #     # # # ... do something with the image ...

        #     d1 = ImageDraw.Draw(img)

        #     # Token Name and Token ID
        #     text = 'Book "' + title + '" #' + str(i)
        #     text_width, text_height = d1.textsize(text)
        #     x = 28
        #     y = img.height - text_height - 46
        #     d1.text((x, y), text, fill=(255, 0, 0, 255), font=font)

        #     media_root = settings.MEDIA_ROOT
        #     subonepath = 'booknfts'
        #     subtwopath = title.replace(' ', '_')
        #     folderpath = os.path.join(media_root, subonepath, subtwopath)
        #     if not os.path.exists(folderpath):
        #         os.makedirs(folderpath)
        #     customized_image_path = f'Book${title}${i}.png'
        #     image_abs_path = os.path.join(media_root, subonepath, subtwopath, customized_image_path)
        #     img.save(image_abs_path)

        serializer_class.save(user=self.request.user)

class BooksApi(generics.ListAPIView):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

    def get_queryset(self):
        if(self.request.user.is_superuser):
            return Books.objects.all()
        else:
            return Books.objects.all().filter(user=self.request.user)

class BooksUpdateApi(generics.RetrieveUpdateAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer

class BooksDeleteApi(generics.DestroyAPIView):
    permission_classes = (IsStaff,)
    queryset = Books.objects.all()
    serializer_class = BooksSerializer