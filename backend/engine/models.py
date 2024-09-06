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
    LastPlayed = JM.DateField(default=now)
    CreateDate = JM.DateField(default=now)
    Selected = JM.BooleanField(default=False)

    ThroneLevel = JM.IntegerField(default=1)
    CampaignWorld = JM.IntegerField(default=1)

    VaultGold = JM.IntegerField(default=0)
    VaultStone = JM.IntegerField(default=0)
    VaultGems = JM.IntegerField(default=10)
    DungeonCheck = JM.DateField(null=True)

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

    Status = JM.TextField(default='Ready')      # Ready < 50% (Fatigued), Wounded < 99%, Knocked Out 100%, Training
    CooldownExpire = JM.DateTimeField(null=True)
    # Position = JM.TextField(default='Available')

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

class RoomInGuild(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    Name = JM.TextField()
    Description = JM.TextField(null=True)
    Level = JM.IntegerField()
    Placement = JM.TextField(unique=True)
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
    CreateDate = JM.DateField(default=now)
    Heist = JM.TextField()              # tower, trial, dungeon, campaign
    ThroneLevel = JM.IntegerField()     # the currently generated level
    StageNo = JM.IntegerField()

    RoomTypes = JM.JSONField()          # ['balanced', null, null]
    Background = JM.TextField()
    BackgroundBias = JM.JSONField()

    BaseRewards = JM.JSONField()
    RoomRewards = JM.JSONField()            # flag for room complete
    Assignments = JM.JSONField()
    StageRewards = JM.JSONField(null=True)  # flag for stage complete

    ObstaclesR1 = JM.JSONField()
    ObstaclesR2 = JM.JSONField(null=True)
    ObstaclesR3 = JM.JSONField(null=True)
    ObstaclesR4 = JM.JSONField(null=True)
    ObstaclesR5 = JM.JSONField(null=True)

    objects = DB.BaseManager()
    def __str__(self): 
        msg = f"GuildStage {str(self.StageNo).zfill(2)} {len(json.loads(self.ObstaclesR1))} "
        msg += f"{len(json.loads(self.ObstaclesR2)) if self.ObstaclesR2 else 0} "
        msg += f"{len(json.loads(self.ObstaclesR3)) if self.ObstaclesR3 else 0} "
        return msg

class GuildExpedition(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    CreateDate = JM.DateField(default=now)
    SlotNo = JM.IntegerField()
    Level = JM.IntegerField()
    BaseType = JM.TextField()
    FullType = JM.TextField()
    Duration = JM.TextField()

    StartDate = JM.DateTimeField(null=True)
    ThiefFK = JM.ForeignKey(ThiefInGuild, on_delete=JM.CASCADE, null=True)
    Results = JM.JSONField(null=True)
    Claimed = JM.BooleanField(default=False)
    objects = DB.BaseManager()

class MarketStore(JM.Model):

    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    CreateDate = JM.DateField(default=now)
    ThroneLevel = JM.IntegerField()             # currently generated level

    ResourceId = JM.TextField()
    StoreType = JM.TextField()                  # common, rare
    RareProperties = JM.JSONField(null=True)    # may have property if rare
    Bought = JM.BooleanField(default=False)

    objects = DB.BaseManager()

