"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE CONTENT
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import pandas as PD
from django.utils import timezone
import app_proj.notebooks as NT

import emporium.models as EM 
import emporium.logic.guild as GD
import emporium.logic.stage as ST
import emporium.logic.character_names as CN
import engine.models as GM 


def BackgroundBias():
    potential = [0, 0, 0, 1, 2, 3, 4]
    chosen = random.choice(potential)
    return chosen

def CreateStageRooms(guildMd, heistType, currDate, rawStages):

    lastType = ''
    lastBackground = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.ThroneLevel = guildMd.ThroneLevel
        newStage.Heist = heistType
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate
        newStage.RoomTypes = []

        newStage.BaseRewards = {
            'Gold': st['Gold'],
            'Gems': st['Gems'],
            'Wood': st['Wood'],
            'Stone': st['Stone'],
            'Iron': st['Iron'],
        }
        newStage.RoomRewards = [None, None, None, None, None]
        newStage.Assignments = [None, None, None, None, None]

        background = ST.StageBackground(lastBackground)
        lastBackground = background
        newStage.Background = background
        newStage.BackgroundBias = []

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])
        newStage.RoomTypes.append(roomType)
        newStage.BackgroundBias.append(BackgroundBias())
        newStage.ObstaclesR1 = obstacles

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR2 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR3 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 4

        if st['LevelR4']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR4'], st['ObstaclesR4'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR4 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 5

        if st['LevelR5']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR5'], st['ObstaclesR5'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR5 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        newStage.save()

def GetOrCreateTower(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='tower', ThroneLevel=guildMd.ThroneLevel, CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create during daily update

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='tower').delete()
    rawStages = list(EM.GothicTower.objects.filter(Throne=guildMd.ThroneLevel).values())
    CreateStageRooms(guildMd, 'tower', currDate, rawStages)

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='tower').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs

def GetOrCreateTrial(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='trial', ThroneLevel=guildMd.ThroneLevel, CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # get room type based on day of week

    trunkNow = timezone.now().replace(microsecond=0)
    dayOfWeek = 'monday'
    if trunkNow.weekday() == 1:   dayOfWeek = 'tuesday'
    if trunkNow.weekday() == 2:   dayOfWeek = 'wednesday'
    if trunkNow.weekday() == 3:   dayOfWeek = 'thursday'
    if trunkNow.weekday() == 4:   dayOfWeek = 'friday'
    if trunkNow.weekday() == 5:   dayOfWeek = 'saturday'
    if trunkNow.weekday() == 6:   dayOfWeek = 'sunday'

    trialDay = EM.TrialDay.objects.GetOrNone(WeekDay=dayOfWeek)
    dailyType = f"biased {trialDay.StageType}"

    # create stages for daily update

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='trial').delete()
    rawStages = list(EM.LeagueTrial.objects.filter(Throne=guildMd.ThroneLevel).values())
    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.ThroneLevel = guildMd.ThroneLevel
        newStage.Heist = 'trial'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate
        newStage.RoomTypes = []

        newStage.BaseRewards = {
            'Gold': st['Gold'],
            'Gems': st['Gems'],
            'Wood': st['Wood'],
            'Stone': st['Stone'],
            'Iron': st['Iron'],
        }
        newStage.RoomRewards = [None, None, None, None, None]
        newStage.Assignments = [None, None, None, None, None]

        background = ST.StageBackground('')
        newStage.Background = background
        newStage.BackgroundBias = []

        # room 1 

        roomType = dailyType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])
        newStage.RoomTypes.append(roomType)
        newStage.BackgroundBias.append(BackgroundBias())
        newStage.ObstaclesR1 = obstacles

        # room 2

        if st['LevelR2']:
            roomType = dailyType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR2 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 3 

        if st['LevelR3']:
            roomType = dailyType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR3 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 4

        if st['LevelR4']:
            roomType = dailyType
            obstacles = ST.AssembleRoom(roomType, st['LevelR4'], st['ObstaclesR4'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR4 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 5

        if st['LevelR5']:
            roomType = dailyType
            obstacles = ST.AssembleRoom(roomType, st['LevelR5'], st['ObstaclesR5'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR5 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        newStage.save()

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='trial').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs

def GetOrCreateDungeon(guildMd, currDate):

    # check for existing daily stages

    if str(guildMd.DungeonCheck) == currDate:
        stage = GM.GuildStage.objects.filter(
            GuildFK=guildMd, Heist='dungeon', ThroneLevel=guildMd.ThroneLevel, CreateDate=currDate
            ).values()

        stageDf = PD.DataFrame(stage).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create during the daily update

    guildMd.DungeonCheck = currDate
    guildMd.save()

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='dungeon').delete()
    result = random.randint(1, 20)

    if result > 10:
        rawStage = EM.Dungeon.objects.filter(Throne=guildMd.ThroneLevel).values()[0]

        previousTypes = []

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.ThroneLevel = guildMd.ThroneLevel
        newStage.Heist = 'dungeon'
        newStage.StageNo = 1
        newStage.CreateDate = currDate
        newStage.RoomTypes = []

        newStage.BaseRewards = {
            'Gold': rawStage['Gold'],
            'Gems': rawStage['Gems'],
            'Wood': rawStage['Wood'],
            'Stone': rawStage['Stone'],
            'Iron': rawStage['Iron'],
        }
        newStage.RoomRewards = [None, None, None, None, None]
        newStage.Assignments = [None, None, None, None, None]

        background = ST.StageBackground(None)
        newStage.Background = background
        newStage.BackgroundBias = []

        # room 1 

        roomType = ST.RandomBiasedType(previousTypes)
        previousTypes.append(roomType)
        obstacles = ST.AssembleRoom(roomType, rawStage['LevelR1'], rawStage['ObstaclesR1'])
        newStage.RoomTypes.append(roomType)
        newStage.BackgroundBias.append(BackgroundBias())
        newStage.ObstaclesR1 = obstacles

        # room 2

        if rawStage['LevelR2']:
            roomType = ST.RandomBiasedType(previousTypes)
            previousTypes.append(roomType)
            obstacles = ST.AssembleRoom(roomType, rawStage['LevelR2'], rawStage['ObstaclesR2'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR2 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 3 

        if rawStage['LevelR3']:
            roomType = ST.RandomBiasedType(previousTypes)
            previousTypes.append(roomType)
            obstacles = ST.AssembleRoom(roomType, rawStage['LevelR3'], rawStage['ObstaclesR3'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR3 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 4

        if rawStage['LevelR4']:
            roomType = ST.RandomBiasedType(previousTypes)
            previousTypes.append(roomType)
            obstacles = ST.AssembleRoom(roomType, rawStage['LevelR4'], rawStage['ObstaclesR4'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR4 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 5

        if rawStage['LevelR5']:
            roomType = ST.RandomBiasedType(previousTypes)
            previousTypes.append(roomType)
            obstacles = ST.AssembleRoom(roomType, rawStage['LevelR5'], rawStage['ObstaclesR5'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR5 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        newStage.save()

    # return the dungeon, if present today

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='dungeon').values()
    if len(newStages) > 0:
        stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    return []

def GetOrCreateCampaign(guildMd, currDate):

    # check for existing campaign level stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='campaign', ThroneLevel=guildMd.CampaignWorld
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create during daily update

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='campaign').delete()
    rawStages = list(EM.Campaign.objects.filter(World=guildMd.CampaignWorld).values())
    CreateStageRooms(guildMd, 'campaign', currDate, rawStages)

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='campaign').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs

def AttachObstacleDisplay(obstacleLs):

    for ob in obstacleLs:

        obstType = 'Trap' 
        if ob['Failure'] == 'knockout': obstType = 'Enemy'
        if 'next' in ob['Success']: obstType = 'Passage'
        if ob['Failure'] == 'pass': obstType = 'Favor'
        ob['Type'] = obstType

        dmgMin = ob['Damage'] - int(ob['Damage'] /2)
        dmgMax = ob['Damage'] + int(ob['Damage'] /2)
        ob['DisplayDamage'] = f"{dmgMin}-{dmgMax}"

        ob['IconCode'] = None

    return obstacleLs

def AttachDisplayData(stageLs):

    foundOpen = False       # status: complete, open, blocked

    for st in stageLs:

        trapLevels = []
        numberObstacles = []
        roomCount = 0

        obstLs = st['ObstaclesR1']
        st['ObstaclesR1'] = AttachObstacleDisplay(obstLs)
        trapLevels.append(obstLs[0]['Level'])
        numberObstacles.append(len(obstLs))
        roomCount += 1

        try:
            obstLs = st['ObstaclesR2']
            st['ObstaclesR2'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR3']
            st['ObstaclesR3'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR4']
            st['ObstaclesR4'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR5']
            st['ObstaclesR5'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        # get the status

        status = 'blocked'
        if not st['StageRewards'] and not foundOpen:
            status = 'open'
            foundOpen = True
        if st['StageRewards']: status = 'complete'

        st['ObstLevels'] = trapLevels
        st['ObstCount'] = numberObstacles
        st['Status'] = status
        st['NumberRooms'] = roomCount

    return stageLs


def CreateExpedition(guildMd, currDate, slotNo):

    # get all the combinations

    levelLs = EM.ExpeditionLevel.objects.filter(Throne=guildMd.ThroneLevel)
    typeLs = EM.ExpeditionType.objects.all()

    allTypes = []
    for lv in levelLs:
        for tp in typeLs:
            allTypes.append(f"{lv.Level}-{tp.Type}")

    # remove the existing ones

    existMd = GM.GuildExpedition.objects.filter(GuildFK=guildMd)

    if existMd:
        for ep in existMd:
            allTypes.remove(ep.FullType)

    # create a random expedition from the remaining

    fullType = random.choice(allTypes)

    newExp = GM.GuildExpedition()
    newExp.GuildFK = guildMd
    newExp.CreateDate = currDate
    newExp.SlotNo = slotNo
    newExp.Level = fullType.split('-')[0]
    newExp.BaseType = fullType.split('-')[1]
    newExp.FullType = fullType
    newExp.Duration = '1 min'
    newExp.save()

def GetExpeditions(guildMd, trunkNow):

    expeditionLs = GM.GuildExpedition.objects.filter(GuildFK=guildMd).values()

    for ep in expeditionLs:

        # set the thief display data

        if not ep['ThiefFK_id']:
            ep['ThiefDx'] = None
            ep['Cooldown'] = None

        else:
            thiefDx = GM.ThiefInGuild.objects.GetOrNone(id=ep['ThiefFK_id']).__dict__
            entriesRemove = ['_state', 'GuildFK_id', 'BasePower', 'BaseAgi', 'BaseCun', 'BaseMig', 'BaseEnd',
                'TrainedAgi', 'TrainedCun', 'TrainedMig', 'TrainedEnd', ]
            for k in entriesRemove:
                thiefDx.pop(k)

            dmgMin = thiefDx['Damage'] - int(thiefDx['Damage'] /2)
            dmgMax = thiefDx['Damage'] + int(thiefDx['Damage'] /2)
            thiefDx['DisplayDamage'] = f"{dmgMin}-{dmgMax}"
            thiefDx['IconCode'] = f"class-{thiefDx['Class'].lower()}-s{thiefDx['Stars']}"
            thiefDx['ExpNextLevel'] = GD.GetNextLevelXp(thiefDx['Level'])

            cooldown = None
            if thiefDx['CooldownExpire']:
                cooldown = thiefDx['CooldownExpire'] - trunkNow

            ep['ThiefDx'] = thiefDx
            ep['Cooldown'] = cooldown

        ep.pop('ThiefFK_id')

        # mark any replacements if the expedition is finished

        if ep['Results']:
            replace = GetReplacement(guildMd, ep['Results']['reward'])
            ep['Results']['reward']['replace'] = replace

            if 'reward2' in ep['Results']:
                replace = GetReplacement(guildMd, ep['Results']['reward2'])
                ep['Results']['reward2']['replace'] = replace

    expeditionLs = sorted(expeditionLs, key=lambda d: d['SlotNo'])
    return expeditionLs

def GetReplacement(guildMd, rewardDx):

    replace = None
    FACTOR = 2

    stageMd = EM.GothicTower.objects.GetOrNone(Throne=guildMd.ThroneLevel, StageNo=1)
    gemsLevel = stageMd.Gems

    # check blueprints

    if rewardDx['category'] == 'blueprint' and 'thief' in rewardDx['resourceId']:
        blueprintTrial = GM.ThiefUnlocked.objects.GetOrNone(GuildFK=guildMd, ThiefFK__ResourceId=rewardDx['resourceId'])
        if blueprintTrial:
            replace = f"already unlocked, convert to {gemsLevel * FACTOR} gems"

    if rewardDx['category'] == 'blueprint' and 'thief' not in rewardDx['resourceId']:
        blueprintTrial = GM.ItemUnlocked.objects.GetOrNone(GuildFK=guildMd, ItemFK__ResourceId=rewardDx['resourceId'])
        if blueprintTrial:
            replace = f"already unlocked, convert to {gemsLevel * FACTOR} gems"

    # check materials

    if rewardDx['category'] == 'material':
        amount = int(rewardDx['value'].split(' ')[0])

        if rewardDx['resourceId'] == 'gold' and guildMd.VaultGold + amount > guildMd.StorageGold:
            replace = f"max reached, convert to {gemsLevel * FACTOR} gems"

        if rewardDx['resourceId'] == 'wood' and guildMd.VaultWood + amount > guildMd.StorageWood:
            replace = f"max reached, convert to {gemsLevel * FACTOR} gems"

        if rewardDx['resourceId'] == 'stone' and guildMd.VaultStone + amount > guildMd.StorageStone:
            replace = f"max reached, convert to {gemsLevel * FACTOR} gems"

        if rewardDx['resourceId'] == 'iron' and guildMd.VaultIron + amount > guildMd.StorageIron:
            replace = f"max reached, convert to {gemsLevel * FACTOR} gems"

    return replace


def GetOrCreateMarket(guildMd, rareCount):

    trunkNow = timezone.now().replace(microsecond=0)
    currDate = f"{trunkNow.year}-{str(trunkNow.month).zfill(2)}-{str(trunkNow.day).zfill(2)}"

    # check for existing daily market

    checkInventory = GM.MarketStore.objects.filter(
        GuildFK=guildMd, CreateDate=currDate, ThroneLevel=guildMd.ThroneLevel
        ).values()

    if len(checkInventory) > 0:
        checkInventory = AttachMarketDisplay(checkInventory)
        resourceDf = PD.DataFrame(checkInventory).drop(
            ['_state', 'GuildFK_id', 'ThroneLevel'], axis=1, errors='ignore')
        commonDf = resourceDf[resourceDf['StoreType'] == 'common']
        rareDf = resourceDf[resourceDf['StoreType'] == 'rare']
        return  NT.DataframeToDicts(commonDf), NT.DataframeToDicts(rareDf)

    # create common item inventory
    # has thief 1S and class wargear

    GM.MarketStore.objects.filter(GuildFK=guildMd).delete()

    commonThief = EM.UnlockableThief.objects.filter(Stars=1).values()
    commonItem = EM.UnlockableItem.objects.filter(
        Level=guildMd.ThroneLevel, MagicLv=0, Requirement__isnull=False).values()

    for cm in commonThief:
        newReso = GM.MarketStore()
        newReso.GuildFK = guildMd
        newReso.CreateDate = currDate
        newReso.ThroneLevel = guildMd.ThroneLevel
        newReso.ResourceId = cm['ResourceId']
        newReso.StoreType = 'common'
        newReso.RareProperties = {
            'name': GetThiefName(guildMd),
            'agi': 3 if 'agi' in cm['ResourceId'] else 0,
            'cun': 3 if 'cun' in cm['ResourceId'] else 0,
            'mig': 3 if 'mig' in cm['ResourceId'] else 0,
            'end': 0,
        }
        newReso.save()

    for cm in commonItem:
        newReso = GM.MarketStore()
        newReso.GuildFK = guildMd
        newReso.CreateDate = currDate
        newReso.ThroneLevel = guildMd.ThroneLevel
        newReso.ResourceId = cm['ResourceId']
        newReso.StoreType = 'common'
        newReso.save()

    # create rare items from random table
    # has accessories, materials, unlocked resources

    rareAccessory = EM.UnlockableItem.objects.filter(
        Level=guildMd.ThroneLevel, MagicLv=0, Requirement__isnull=True)

    rareThief = GM.ThiefUnlocked.objects.filter(
        GuildFK=guildMd)

    rareMagic = GM.ItemUnlocked.objects.filter(
        GuildFK=guildMd, ItemFK__Level__in=[guildMd.ThroneLevel, guildMd.ThroneLevel -1])

    potentialLs = []

    for rr in rareAccessory:
        potentialLs.append(rr.ResourceId)

    for rr in rareThief:
        potentialLs.append(rr.ThiefFK.ResourceId)

    for rr in rareMagic:
        potentialLs.append(rr.ItemFK.ResourceId)

    # potentialLs += ['material-wood']
    # if guildMd.ThroneLevel >= 4: potentialLs.append('material-stone')
    # if guildMd.ThroneLevel >= 7: potentialLs.append('material-iron')

    for rg in range(0, rareCount):

        randomType = random.choice(potentialLs)
        potentialLs.remove(randomType)

        newReso = GM.MarketStore()
        newReso.GuildFK = guildMd
        newReso.CreateDate = currDate
        newReso.ThroneLevel = guildMd.ThroneLevel
        newReso.ResourceId = randomType
        newReso.StoreType = 'rare'

        if 'm0' in randomType:
            newReso.RareProperties = None

        if 'thief' in randomType:
            newName = GetThiefName(guildMd)
            newReso.RareProperties = ST.GetStarThief(randomType, newName)

        if 'm1' in randomType:
            newReso.RareProperties = ST.GetMagicItem(randomType)

        # if 'material' in randomType:
        #     newReso.RareProperties = ST.GetRareMaterial(randomType, guildMd.ThroneLevel)

        newReso.save()

    # get the newly created data

    inventory = GM.MarketStore.objects.filter(
        GuildFK=guildMd, CreateDate=currDate, ThroneLevel=guildMd.ThroneLevel
        ).values()

    inventory = AttachMarketDisplay(inventory)

    resourceDf = PD.DataFrame(inventory).drop(['_state', 'GuildFK_id', 'ThroneLevel'], axis=1, errors='ignore')
    commonDf = resourceDf[resourceDf['StoreType'] == 'common']
    rareDf = resourceDf[resourceDf['StoreType'] == 'rare']

    return  NT.DataframeToDicts(commonDf), NT.DataframeToDicts(rareDf)

def GetThiefName(guildMd):
    # random name that doesn't yet appear in guild
    allNames = CN.CharacterNames()
    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    existingNameLs = [x.Name for x in thiefMds]
    availableNames = [x for x in allNames if x not in existingNameLs]
    thiefName = random.choice(availableNames)
    return thiefName

def AttachMarketDisplay(resourceLs):
    # resource: MarketStore dict

    for rs in resourceLs:

        name = power = iconCode = resourceDx = None

        if 'thief' in rs['ResourceId']:
            resourceMd = EM.UnlockableThief.objects.GetOrNone(ResourceId=rs['ResourceId'])
            name = resourceMd.Class
            power = int(resourceMd.StoreCost / GD.POWER_FACTOR)
            resourceDx = resourceMd.__dict__
            removeKeys = ['id', '_state', 'StartTrait', 'UnlockThrone', 'ResourceId']
            for k in removeKeys:
                resourceDx.pop(k)
            iconCode = f"class-{resourceMd.Class.lower()}-s{resourceMd.Stars}"

        elif 'material' in rs['ResourceId']:
            name = rs['ResourceId'].split('-')[1].title()
            power = None
            resourceDx = {'StoreCost': rs['RareProperties']['cost']}
            iconCode = rs['ResourceId'].split('-')[1]

        else:
            resourceMd = EM.UnlockableItem.objects.GetOrNone(ResourceId=rs['ResourceId'])
            name  = resourceMd.Name
            power = int(resourceMd.StoreCost / GD.POWER_FACTOR)
            resourceDx = resourceMd.__dict__
            removeKeys = ['id', '_state', 'ResourceId']
            for k in removeKeys:
                resourceDx.pop(k)

            if resourceDx['Slot'] in ['weapon', 'armor']: stat = resourceDx['Trait'][:3]
            else:     stat = 'skl' if resourceDx['Skill'] else 'cmb'
            iconCode = f"{resourceDx['Slot']}-{stat}-m{resourceDx['MagicLv']}"

            resourceDx['Requirement'] = resourceDx['Requirement'].title() if resourceDx['Requirement'] else 'Any class'
            resourceDx['Slot'] = resourceDx['Slot'].title()

            if resourceDx['Trait']:
                traitLs = resourceDx['Trait'].split(' ')
                resourceDx['Trait'] = f"{traitLs[0].title()} +{traitLs[1]}"

            if resourceDx['Combat']:
                traitLs = resourceDx['Combat'].split(' ')
                resourceDx['Combat'] = f"{traitLs[0].title()} +{traitLs[1]}"

            if resourceDx['Skill']:
                traitLs = resourceDx['Skill'].split(' ')
                resourceDx['Skill'] = f"{traitLs[0].title()} +{traitLs[1]}"

            if rs['RareProperties'] and 'magic' in rs['RareProperties']:
                traitLs = rs['RareProperties']['magic'].split(' ')
                rs['RareProperties']['magic'] = f"{traitLs[0].title()} +{traitLs[1]}"

        rs['Name'] = name
        rs['Power'] = power
        rs['IconCode'] = iconCode  
        rs['ResourceDx'] = resourceDx  

    return resourceLs

def BuyPermission(storeId, guildMd):

    storeMd = GM.MarketStore.objects.GetOrNone(id=storeId)

    # check for thief blockage

    if 'thief' in storeMd.ResourceId:
        thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
        maxThieves = guildMd.MaxThieves
        if len(thiefMds) == maxThieves:
            return 'guild occupancy is full'

    # generic blockage

    if 'thief' in storeMd.ResourceId:
        resourceMd = EM.UnlockableThief.objects.GetOrNone(ResourceId=storeMd.ResourceId)
    else:
        resourceMd = EM.UnlockableItem.objects.GetOrNone(ResourceId=storeMd.ResourceId)

    if resourceMd.StoreCost > guildMd.VaultGold:
        return 'gold coffers are deficient'

    return None

