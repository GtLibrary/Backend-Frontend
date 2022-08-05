from django.db import models

# Create your models here.
class BookType(models.Model):
    booktype = models.CharField(max_length=200, default='')
    pub_date = models.DateTimeField('date published',auto_now=True, null=False, blank=False)
    class Meta:
        ordering = ['booktype']

    def __str__(self):
        return self.booktype