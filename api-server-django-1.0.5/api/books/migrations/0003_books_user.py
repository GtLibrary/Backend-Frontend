# Generated by Django 3.2.13 on 2023-01-31 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0002_auto_20230109_1906'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='user',
            field=models.CharField(default='', max_length=200),
        ),
    ]
