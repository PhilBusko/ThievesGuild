# Generated by Django 4.0.3 on 2024-02-19 14:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0009_guildstage_rewards'),
    ]

    operations = [
        migrations.RenameField(
            model_name='guildstage',
            old_name='BackgroundRoomBias',
            new_name='BackgroundBias',
        ),
        migrations.RenameField(
            model_name='guildstage',
            old_name='Rewards',
            new_name='BaseRewards',
        ),
        migrations.RenameField(
            model_name='guildstage',
            old_name='CompleteRooms',
            new_name='StageRewards',
        ),
        migrations.AddField(
            model_name='guildstage',
            name='RoomRewards',
            field=models.JSONField(default={}),
            preserve_default=False,
        ),
    ]