# Generated by Django 4.0.3 on 2024-02-16 03:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0006_rename_typer1_guildstage_background_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='thiefinguild',
            name='Wounds',
            field=models.IntegerField(default=0),
        ),
    ]