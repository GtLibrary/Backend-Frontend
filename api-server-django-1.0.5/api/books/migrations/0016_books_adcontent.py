# Generated by Django 3.2.13 on 2023-03-07 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0015_remove_books_adcontent'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='adcontent',
            field=models.JSONField(default={}),
        ),
    ]
