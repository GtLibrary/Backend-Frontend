# Generated by Django 3.2.13 on 2023-02-02 18:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api_wallet', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wallettransaction',
            name='status',
        ),
    ]
