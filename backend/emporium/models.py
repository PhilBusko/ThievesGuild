"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM GUILD
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import django.db.models as JM
import app_proj.database as DB


class UnlockableThief(JM.Model):
    ResourceId = JM.TextField()
    Class = JM.TextField()
    Stars = JM.IntegerField()
    UnlockLevel = JM.IntegerField()
    StoreCost = JM.IntegerField(null=True)
    StartTrait = JM.TextField()
    RandomTraits = JM.IntegerField()

    objects = DB.BaseManager()
    class Meta: unique_together = ('Class', 'Stars')

class UnlockableItem(JM.Model):
    ResourceId = JM.TextField(unique=True)
    Name = JM.TextField()
    UnlockLevel = JM.IntegerField()
    Level = JM.IntegerField()
    MagicLv = JM.IntegerField()
    TotalLv = JM.IntegerField()
    Slot = JM.TextField()
    StoreCost = JM.IntegerField(null=True)
    Requirement = JM.TextField(null=True)
    Trait = JM.TextField(null=True)
    Combat = JM.TextField(null=True)
    Skill = JM.TextField(null=True)
    Magic = JM.TextField(null=True)     # 1 blueprint per enchantment
    objects = DB.BaseManager()

class ThiefLevel(JM.Model):
    Level = JM.IntegerField(unique=True)
    Experience = JM.IntegerField()
    Power = JM.IntegerField()
    TrainPeriod = JM.TextField()
    WoundPeriod = JM.TextField()
    WoundPeriodMin = JM.TextField()
    BeatenPeriod = JM.TextField()
    BeatenPeriodMin = JM.TextField()
    objects = DB.BaseManager()

class CastleRoom(JM.Model):
    Name = JM.TextField(unique=True)
    UpgradeType = JM.TextField()            # unique, basic, advanced
    UnlockLevel = JM.IntegerField()
    AllowedPlacement = JM.TextField()
    Description = JM.TextField(null=True)
    objects = DB.BaseManager()

class RoomUpgrade(JM.Model):
    Level = JM.IntegerField(unique=True)
    Stone_Basic = JM.IntegerField()
    Stone_Advanced = JM.IntegerField()
    Stone_Unique = JM.IntegerField()
    Period_Basic = JM.TextField()
    Period_Advanced = JM.TextField()
    Period_Unique = JM.TextField()
    objects = DB.BaseManager()

class UniqueRoom(JM.Model):
    Level = JM.IntegerField(unique=True)
    MaxRoomCount = JM.IntegerField()
    MaxRoomLevel = JM.IntegerField()
    Throne_Gold = JM.IntegerField()
    Throne_Stone = JM.IntegerField()
    Hall_MaxThieves = JM.IntegerField()
    Hall_MagicStore = JM.IntegerField()
    Hall_Expedition = JM.IntegerField()
    Keep_Defenders = JM.IntegerField()
    Keep_Traps = JM.IntegerField()
    objects = DB.BaseManager()

class BasicRoom(JM.Model):
    Level = JM.IntegerField(unique=True)
    Bank_Gold = JM.IntegerField()
    Warehouse_Stone = JM.IntegerField()
    Scholarium_MaxLevel = JM.IntegerField()
    Dorm_MaxThieves = JM.IntegerField()
    Dorm_Recovery = JM.TextField()
    Cartog_Slots = JM.IntegerField()
    Cartog_Bonus = JM.TextField()
    objects = DB.BaseManager()

class AdvancedRoom(JM.Model):
    Level = JM.IntegerField(unique=True)
    Fence_GoldBonus = JM.IntegerField()
    Fence_MagicSlots = JM.IntegerField()
    Workshop_StoneBonus = JM.IntegerField()
    Workshop_Defense= JM.TextField(null=True)
    Jeweler_GemBonus = JM.IntegerField()
    Jeweler_ExpedSlots = JM.IntegerField()
    Blacksmith_Period= JM.TextField()
    Artisan_Cost = JM.IntegerField()
    Artisan_Period = JM.TextField()
    objects = DB.BaseManager()


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM STAGE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class Trap(JM.Model):
    World = JM.IntegerField()
    Level = JM.IntegerField()
    Name = JM.TextField()
    Trait = JM.TextField()
    Skill = JM.TextField()
    Success = JM.TextField()
    Failure = JM.TextField()
    Experience = JM.IntegerField()
    Difficulty = JM.IntegerField()
    Damage = JM.IntegerField(null=True)
    objects = DB.BaseManager()
    class Meta: unique_together = ('Level', 'Name')

class Enemy(JM.Model):
    World = JM.IntegerField()
    Level = JM.IntegerField()
    Name = JM.TextField()
    Trait = JM.TextField()
    Skill = JM.TextField()
    Success = JM.TextField()
    Failure = JM.TextField()
    Experience = JM.IntegerField()
    Attack = JM.IntegerField()
    Damage = JM.IntegerField()
    Defense = JM.IntegerField()
    Health = JM.IntegerField()
    objects = DB.BaseManager()
    class Meta: unique_together = ('Level', 'Name')

class GothicTower(JM.Model):
    World = JM.IntegerField()
    StageNo = JM.IntegerField()
    ObstaclesL1 = JM.IntegerField(null=True)
    LevelLnd1 = JM.IntegerField(null=True)
    ObstaclesL2 = JM.IntegerField(null=True)
    LevelLnd2 = JM.IntegerField(null=True)
    ObstaclesL3 = JM.IntegerField(null=True)
    LevelLnd3 = JM.IntegerField(null=True)
    ObstaclesL4 = JM.IntegerField(null=True)
    LevelLnd4 = JM.IntegerField(null=True)
    ObstaclesL5 = JM.IntegerField(null=True)
    LevelLnd5 = JM.IntegerField(null=True)
    Gold = JM.IntegerField(null=True)
    Stone = JM.IntegerField(null=True)
    Gems = JM.IntegerField(null=True)
    objects = DB.BaseManager()
    class Meta: unique_together = ('World', 'StageNo')

class LeagueTrial(JM.Model):
    World = JM.IntegerField()
    StageNo = JM.IntegerField()
    ObstaclesL1 = JM.IntegerField(null=True)
    LevelLnd1 = JM.IntegerField(null=True)
    ObstaclesL2 = JM.IntegerField(null=True)
    LevelLnd2 = JM.IntegerField(null=True)
    ObstaclesL3 = JM.IntegerField(null=True)
    LevelLnd3 = JM.IntegerField(null=True)
    ObstaclesL4 = JM.IntegerField(null=True)
    LevelLnd4 = JM.IntegerField(null=True)
    ObstaclesL5 = JM.IntegerField(null=True)
    LevelLnd5 = JM.IntegerField(null=True)
    Gold = JM.IntegerField(null=True)
    Stone = JM.IntegerField(null=True)
    Gems = JM.IntegerField(null=True)
    objects = DB.BaseManager()
    class Meta: unique_together = ('World', 'StageNo')

class Dungeon(JM.Model):
    World = JM.IntegerField()
    StageNo = JM.IntegerField()
    DifficultyL1 = JM.TextField(null=True)
    DifficultyL2 = JM.TextField(null=True)
    DifficultyL3 = JM.TextField(null=True)
    DifficultyL4 = JM.TextField(null=True)
    DifficultyL5 = JM.TextField(null=True)
    Gold = JM.IntegerField(null=True)
    Stone = JM.IntegerField(null=True)
    Gems = JM.IntegerField(null=True)
    objects = DB.BaseManager()
    class Meta: unique_together = ('World', 'StageNo')

class Campaign(JM.Model):
    World = JM.IntegerField()
    StageNo = JM.IntegerField()
    DifficultyL1 = JM.TextField(null=True)
    DifficultyL2 = JM.TextField(null=True)
    DifficultyL3 = JM.TextField(null=True)
    DifficultyL4 = JM.TextField(null=True)
    DifficultyL5 = JM.TextField(null=True)
    Gold = JM.IntegerField(null=True)
    Stone = JM.IntegerField(null=True)
    Gems = JM.IntegerField(null=True)
    objects = DB.BaseManager()
    class Meta: unique_together = ('World', 'StageNo')

class TrialDay(JM.Model):
    WeekDay = JM.TextField()
    StageType = JM.TextField()
    objects = DB.BaseManager()

class ExpeditionLevel(JM.Model):
    World = JM.IntegerField()
    Level = JM.IntegerField()
    Duration = JM.TextField()
    DurationMin = JM.TextField()
    objects = DB.BaseManager()

class ExpeditionType(JM.Model):
    Type = JM.TextField()
    MainTrait = JM.TextField()
    SecondaryOne = JM.TextField()
    SecondaryTwo = JM.TextField()
    SecondaryThree = JM.TextField()
    SkillOne = JM.TextField()
    SkillTwo = JM.TextField()
    SkillThree = JM.TextField()
    objects = DB.BaseManager()

class RequiredPower(JM.Model):
    World = JM.IntegerField()
    Level = JM.IntegerField()
    Obstacles = JM.IntegerField()
    RequiredPower = JM.IntegerField()
    objects = DB.BaseManager()
