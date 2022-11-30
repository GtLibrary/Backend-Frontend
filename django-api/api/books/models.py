from django.db import models
import os
from django.conf import settings
from dotenv import load_dotenv
from api.booktype.models import Booktype

load_dotenv()
# Create your models here.
class Books(models.Model):
    title = models.CharField(max_length=200, default='')
    introduction = models.TextField(default = '')
    content = models.TextField(default = '')
    image_url = models.ImageField(upload_to='post_main_images', blank=True, null=True)
    author_name = models.CharField(max_length=200, default='')
    author_wallet = models.CharField(max_length=200, default='')
    bookmark_img_url = models.ImageField(upload_to='post_bookmark_images', blank=True, null=True)
    curserial_number = models.CharField(max_length=200, default='')
    datamine = models.CharField(max_length=200, default='')
    origin_type_id = models.BigIntegerField(default=0)
    book_type_id = models.ForeignKey("Booktype", default=0)
    max_bookmark_supply = models.BigIntegerField(default=-1)
    max_book_supply = models.BigIntegerField(default=-1)
    start_point = models.BigIntegerField(default=1)
    book_price = models.BigIntegerField(default=0)
    bookmark_price = models.BigIntegerField(default=0)
    hardbound = models.CharField(max_length=200, default='')
    hardbound_from = models.CharField(max_length=200, default='')
    hardbound_price = models.BigIntegerField(default=0)
    bt_contract_address = models.CharField(max_length=200, default='')
    hb_contract_address = models.CharField(max_length=200, default='')
    bm_contract_address = models.CharField(max_length=200, default='')
    pub_date = models.DateTimeField('date published',auto_now=True, null=False, blank=False)
    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


    def datamine_path(datamine):
        return os.path.join(os.environ['DATAMINEROOT'], datamine)
