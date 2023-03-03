# Generated by Django 3.2.13 on 2023-02-24 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0008_auto_20230225_0019'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='books',
            name='bookmark_from',
        ),
        migrations.AddField(
            model_name='bookmarks',
            name='bookmarkstartpoint',
            field=models.BigIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='bookmarks',
            name='maxbookmarksupply',
            field=models.BigIntegerField(default=0),
        ),
    ]