# Generated by Django 3.2.13 on 2023-03-28 07:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0016_books_adcontent'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='book_description',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='books',
            name='hardbound_description',
            field=models.TextField(default=''),
        ),
    ]
