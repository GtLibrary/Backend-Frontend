# Generated by Django 3.2.14 on 2022-08-05 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OriginType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('origintype', models.CharField(default='', max_length=200)),
                ('pub_date', models.DateTimeField(auto_now=True, verbose_name='date published')),
            ],
            options={
                'ordering': ['origintype'],
            },
        ),
    ]
