# Generated by Django 3.2.13 on 2023-02-27 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0009_auto_20230225_0024'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='is_ads',
            field=models.BooleanField(default=False),
        ),
    ]
