# Generated by Django 3.2.13 on 2023-05-15 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0019_auto_20230512_1049'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='epub_file',
            field=models.FileField(blank=True, null=True, upload_to='epub/'),
        ),
        migrations.AlterField(
            model_name='books',
            name='byteperbookmark',
            field=models.TextField(default='0'),
        ),
    ]