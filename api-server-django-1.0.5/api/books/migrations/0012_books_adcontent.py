# Generated by Django 3.2.13 on 2023-03-01 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0011_auto_20230301_0214'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='adcontent',
            field=models.TextField(default=''),
        ),
    ]