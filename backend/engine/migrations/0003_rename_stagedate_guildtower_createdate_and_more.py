# Generated by Django 4.0.3 on 2024-01-01 23:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0002_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='guildtower',
            old_name='StageDate',
            new_name='CreateDate',
        ),
        migrations.AlterField(
            model_name='guildtower',
            name='CompleteR2',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='guildtower',
            name='CompleteR3',
            field=models.BooleanField(default=False),
        ),
    ]