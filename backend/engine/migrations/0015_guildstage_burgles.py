# Generated by Django 4.0.3 on 2025-01-08 22:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0014_roominguild_staffingdata_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='guildstage',
            name='Burgles',
            field=models.JSONField(null=True),
        ),
    ]
