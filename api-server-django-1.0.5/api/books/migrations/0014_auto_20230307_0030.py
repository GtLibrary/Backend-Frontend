# Generated by Django 3.2.13 on 2023-03-06 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0013_alter_books_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='books',
            name='adcontent',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='books',
            name='introduction',
            field=models.TextField(default='', null=True),
        ),
    ]