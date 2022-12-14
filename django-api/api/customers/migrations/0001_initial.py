# Generated by Django 3.2.14 on 2022-08-22 09:06

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wallet_address', models.CharField(default='', max_length=200)),
                ('book_id', models.BigIntegerField(default=0)),
                ('pub_date', models.DateTimeField(auto_now=True, verbose_name='date published')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]
