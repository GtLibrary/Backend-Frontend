from django.db import models

# Create your models here.
class Books(models.Model):
    title = models.CharField(max_length=200, default='')
    content = models.TextField(default = '')
    image_url = models.URLField(max_length=200, default='')
    author_wallet = models.CharField(max_length=200, default='')
    bookmark_img_url = models.URLField(max_length=200, default='')
    curserial_number = models.CharField(max_length=200, default='')
    datamine = models.CharField(max_length=200, default='')
    origin_type_id = models.BigIntegerField(default=0)
    book_type_id = models.BigIntegerField(default=0)
    pub_date = models.DateTimeField('date published',auto_now=True, null=False, blank=False)
    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title