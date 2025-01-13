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
    LastPlayed = JM.DateField()
    CreateDate = JM.DateField()
    Selected = JM.BooleanField(default=False)

    VaultGold = JM.IntegerField(default=0)
    VaultStone = JM.IntegerField(default=0)
    VaultGems = JM.IntegerField(default=10)
    LastHeist = JM.TextField(default='tower')              # tower, trial, dungeon, campaign
    CampaignWorld = JM.IntegerField(default=1)
    DungeonCheck = JM.DateField(null=True)

    objects = DB.BaseManager()
    class Meta: unique_together = ('UserFK', 'Name')

class ThiefInGuild(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    Name = JM.TextField()
    Class = JM.TextField()
    Stars = JM.TextField()
    Level = JM.IntegerField(default=1)
    Experience = JM.IntegerField(default=0)
    PowerBase = JM.IntegerField()

    BaseAgi = JM.IntegerField(default=0)
    BaseCun = JM.IntegerField(default=0)
    BaseMig = JM.IntegerField(default=0)
    BaseEnd = JM.IntegerField(default=0)
    TrainedAgi = JM.IntegerField(default=0)
    TrainedCun = JM.IntegerField(default=0)
    TrainedMig = JM.IntegerField(default=0)
    TrainedEnd = JM.IntegerField(default=0)
    TrainedSkills = JM.JSONField(default=list)      # ['att 2', 'sab 4']

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

    Status = JM.TextField(default='Ready')      # Ready, Looting, Wounded, Knocked Out, Exploring, Training
    CooldownExpire = JM.DateTimeField(null=True)
    # Position = JM.TextField(default='Available')

    objects = DB.BaseManager()
    def __str__(self): return f"{self.Class} {self.Power} {self.Level}"

class ItemInGuild(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    ThiefFK = JM.ForeignKey(ThiefInGuild, on_delete=JM.SET_NULL, null=True)
    Throne = JM.IntegerField()
    Name = JM.TextField()
    Slot = JM.TextField()
    MagicLv = JM.IntegerField()
    TotalLv = JM.IntegerField()
    Power = JM.IntegerField()

    Requirement = JM.TextField(null=True)
    Trait = JM.TextField(null=True)
    Skill = JM.TextField(null=True)
    Combat = JM.TextField(null=True)
    Magic = JM.TextField(null=True)
    objects = DB.BaseManager()

class RoomInGuild(JM.Model):
    GuildFK =               JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    Name =                  JM.TextField()
    UpgradeType =           JM.TextField()
    Placement =             JM.TextField()
    Description =           JM.TextField(null=True)
    Level =                 JM.IntegerField(default=0)
    Status =                JM.TextField(default='Ready')      # Ready, Upgrading, Training, Crafting
    CooldownExpire =        JM.DateTimeField(null=True)
    StaffingData =          JM.JSONField(default=list)      # [{'thiefId': id, 'data': value}]
    objects = DB.BaseManager()


class ThiefUnlocked(JM.Model):
    UserFK = JM.ForeignKey(MM.User, on_delete=JM.CASCADE)
    ThiefFK = JM.ForeignKey(EM.UnlockableThief, on_delete=JM.CASCADE)
    objects = DB.BaseManager()

class ItemUnlocked(JM.Model):
    UserFK = JM.ForeignKey(MM.User, on_delete=JM.CASCADE)
    ItemFK = JM.ForeignKey(EM.UnlockableItem, on_delete=JM.CASCADE)
    # ResourceId = JM.TextField()
    objects = DB.BaseManager()


class GuildStage(JM.Model):
    GuildFK = JM.ForeignKey(Guild, on_delete=JM.CASCADE)
    Heist = JM.TextField()                          # tower, trial, dungeon, campaign
    CreateDate = JM.DateField(default=now)
    World = JM.IntegerField()
    StageNo = JM.IntegerField()

    LandingTypes = JM.JSONField()                   # ['balanced', null, null]
    Background = JM.TextField()
    BackgroundBias = JM.JSONField()
    BaseRewards = JM.JSONField()                    # target values copied from raw stage

    ObstaclesL1 = JM.JSONField()
    ObstaclesL2 = JM.JSONField(null=True)
    ObstaclesL3 = JM.JSONField(null=True)
    ObstaclesL4 = JM.JSONField(null=True)
    ObstaclesL5 = JM.JSONField(null=True)

    LandingRewards = JM.JSONField(null=True)        # flag for landing won
    StageRewards = JM.JSONField(null=True)          # flag for stage won
    Burgles = JM.JSONField(null=True)               # number of attempts per landing
    StageQueue = JM.BooleanField(default=False)
    Assignments = JM.JSONField(null=True)           # ids of thieves assigned to each landing
    Actions = JM.JSONField(null=True)               # persist the same actions regardless of reloads

    objects = DB.BaseManager()
    def __str__(self): 
        msg = f"GuildStage {str(self.StageNo).zfill(2)} {len(json.loads(self.ObstaclesL1))} "
        msg += f"{len(json.loads(self.ObstaclesL2)) if self.ObstaclesL2 else 0} "
        msg += f"{len(json.loads(self.ObstaclesL3)) if self.ObstaclesL3 else 0} "
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
    World = JM.IntegerField()                   # currently generated world

    ResourceId = JM.TextField()
    StoreType = JM.TextField()                  # common, rare
    RareProperties = JM.JSONField(null=True)    # may have property if rare
    Bought = JM.BooleanField(default=False)

    objects = DB.BaseManager()
