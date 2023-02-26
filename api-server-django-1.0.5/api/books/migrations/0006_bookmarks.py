# Generated by Django 3.2.13 on 2023-02-24 11:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0005_auto_20230223_0003'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bookmarks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tokenname', models.CharField(default='', max_length=200)),
                ('bookmarkprice', models.DecimalField(decimal_places=3, default=0.0, max_digits=10)),
                ('maxbookmarksupply', models.BigIntegerField(default=-1)),
                ('item_bmcontract_address', models.CharField(default='', max_length=200)),
            ],
            options={
                'ordering': ['tokenname'],
            },
        ),
    ]
