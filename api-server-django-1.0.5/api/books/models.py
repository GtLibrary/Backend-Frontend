from django.db import models
import os
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()
# Create your models here.
class Books(models.Model):
    title = models.CharField(max_length=200, default='')
    introduction = models.TextField(default = '', null=True)
    content = models.TextField(default = '')
    adcontent = models.JSONField(default={})
    image_url = models.ImageField(upload_to='post_main_images', blank=True, null=True)
    author_name = models.CharField(max_length=200, default='')
    author_wallet = models.CharField(max_length=200, default='')
    bookmark_img_url = models.ImageField(upload_to='post_bookmark_images', blank=True, null=True)
    curserial_number = models.CharField(max_length=200, default='')
    datamine = models.CharField(max_length=200, default='')
    origin_type_id = models.BigIntegerField(default=0)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='user', null=True, on_delete=models.CASCADE)
    book_type_id = models.BigIntegerField(default=0)
    max_book_supply = models.BigIntegerField(default=-1)
    max_hardbound_supply = models.BigIntegerField(default=-1)
    book_price = models.DecimalField(max_digits = 10,decimal_places=3, default=0.0)
    hardbound_price = models.DecimalField(max_digits = 10,decimal_places=3, default=0.0)
    book_from = models.BigIntegerField(default=1)
    hardbound_from = models.BigIntegerField(default=1)
    bt_contract_address = models.CharField(max_length=200, default='')
    hb_contract_address = models.CharField(max_length=200, default='')
    bm_listdata = models.JSONField(default=[])
    is_ads = models.BooleanField(default=False)
    pub_date = models.DateTimeField('date published',auto_now=True, null=False, blank=False)
    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


    def datamine_path(datamine):
        return os.path.join(os.environ['DATAMINEROOT'], datamine)
