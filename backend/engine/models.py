"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE GUILD
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import json
from django.utils.timezone import now
import django.db.models as JM

import app_proj.database as DB
import members.models as MM 
import emporium.models as EM 


class Guild(JM.Model):
    UserFK = JM.ForeignKey(MM.User, on_delete=JM.CASCADE)
    Name = JM.TextField()

    KeepLevel = JM.IntegerField(default=1)
    TotalPower = JM.IntegerField(default=0)
    VaultGold = JM.IntegerField(default=0)
    VaultGems = JM.IntegerField(default=0)

    Selected = JM.BooleanField(default=False)
    LastPlayed = JM.DateField(default=now)
    CreateDate = JM.DateField(default=now)
    objects = DB.BaseManager()
    class Meta: unique_together = ('UserFK', 'Name')

class ThiefInGuild(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    Name = JM.TextField()
    Class = JM.TextField()
    Stars = JM.TextField()
    BasePower = JM.IntegerField()
    Level = JM.IntegerField(default=1)
    Experience = JM.IntegerField(default=0)

    BaseAgi = JM.IntegerField(default=0)
    BaseCun = JM.IntegerField(default=0)
    BaseMig = JM.IntegerField(default=0)
    BaseEnd = JM.IntegerField(default=0)
    TrainedAgi = JM.IntegerField(default=0)
    TrainedCun = JM.IntegerField(default=0)
    TrainedMig = JM.IntegerField(default=0)
    TrainedEnd = JM.IntegerField(default=0)

    Power = JM.IntegerField(null=True)
    Agility = JM.IntegerField(null=True)
    Cunning = JM.IntegerField(null=True)
    Might = JM.IntegerField(null=True)
    Endurance = JM.IntegerField(null=True)
    Health = JM.IntegerField(null=True)
    Attack = JM.IntegerField(null=True)
    Damage = JM.IntegerField(null=True)
    Defense = JM.IntegerField(null=True)
    Sabotage = JM.IntegerField(null=True)
    Perceive = JM.IntegerField(null=True)
    Traverse = JM.IntegerField(null=True)

    Position = JM.TextField(default='Available')
    Wounds = JM.IntegerField(null=True)
    Cooldown = JM.TextField(default='Ready')   # ready/on deck, training, wounded/recovering

    objects = DB.BaseManager()
    def __str__(self): return f"{self.Class} {self.Power} {self.Level}"

class ItemInGuild(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    ThiefFK = JM.ForeignKey(ThiefInGuild, on_delete=JM.CASCADE, null=True)
    Slot = JM.TextField()
    Name = JM.TextField()
    Level = JM.IntegerField()
    TotalLv = JM.IntegerField()
    Power = JM.IntegerField()

    Requirement = JM.TextField(null=True)
    Trait = JM.TextField(null=True)
    Skill = JM.TextField(null=True)
    Combat = JM.TextField(null=True)
    Magic = JM.TextField(null=True)
    objects = DB.BaseManager()


class ThiefUnlocked(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    ThiefFK = JM.ForeignKey(EM.UnlockableThief, on_delete=JM.CASCADE)
    objects = DB.BaseManager()

class ItemUnlocked(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    ItemFK = JM.ForeignKey(EM.UnlockableItem, on_delete=JM.CASCADE)
    objects = DB.BaseManager()


class GuildStage(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    Heist = JM.TextField()              # tower, trial, raid, dungeon, campaign
    StageNo = JM.IntegerField()
    CreateDate = JM.DateField(default=now)

    RoomTypes = JM.JSONField()          # ['balanced', null, null]
    CompleteRooms = JM.JSONField()
    Background = JM.TextField()
    BackgroundRoomBias = JM.JSONField()

    ObstaclesR1 = JM.JSONField()
    ObstaclesR2 = JM.JSONField(null=True)
    ObstaclesR3 = JM.JSONField(null=True)
    ObstaclesR4 = JM.JSONField(null=True)
    ObstaclesR5 = JM.JSONField(null=True)

    objects = DB.BaseManager()
    def __str__(self): 
        msg = f"GuildTower {str(self.StageNo).zfill(2)} {len(json.loads(self.ObstaclesR1))} "
        msg += f"{len(json.loads(self.ObstaclesR2)) if self.ObstaclesR2 else 0} "
        msg += f"{len(json.loads(self.ObstaclesR3)) if self.ObstaclesR3 else 0} "
        return msg

