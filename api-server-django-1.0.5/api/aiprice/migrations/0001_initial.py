# Generated by Django 3.2.13 on 2023-02-09 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AIpricemodel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('aiprice', models.DecimalField(decimal_places=2, max_digits=100, null=True)),
            ],
            options={
                'ordering': ['aiprice'],
            },
        ),
    ]
