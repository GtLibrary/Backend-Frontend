# Generated by Django 3.2.13 on 2023-05-22 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0020_auto_20230516_0755'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='audio_file',
            field=models.FileField(blank=True, null=True, upload_to='audio/'),
        ),
    ]
