# Generated by Django 4.0.3 on 2024-07-19 20:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0020_guildexpedition_slotno'),
    ]

    operations = [
        migrations.AddField(
            model_name='guild',
            name='DungeonCheck',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='guild',
            name='VaultGems',
            field=models.IntegerField(default=10),
        ),
    ]