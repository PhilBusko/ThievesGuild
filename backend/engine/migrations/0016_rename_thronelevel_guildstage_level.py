# Generated by Django 4.0.3 on 2025-01-08 22:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0015_guildstage_burgles'),
    ]

    operations = [
        migrations.RenameField(
            model_name='guildstage',
            old_name='ThroneLevel',
            new_name='Level',
        ),
    ]
