# Generated by Django 4.0.3 on 2024-09-09 00:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('emporium', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='throneroom',
            name='MagicSlots',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
