# Generated by Django 3.2.13 on 2023-01-09 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_books', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='books',
            name='book_price',
            field=models.DecimalField(decimal_places=3, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='books',
            name='book_type_id',
            field=models.BigIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='books',
            name='bookmark_price',
            field=models.DecimalField(decimal_places=3, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='books',
            name='hardbound_price',
            field=models.DecimalField(decimal_places=3, default=0.0, max_digits=10),
        ),
    ]
