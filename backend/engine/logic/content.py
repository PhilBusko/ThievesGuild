"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE CONTENT
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import pandas as PD
from django.db.models import Min
import app_proj.notebooks as NT

import emporium.models as EM 
import emporium.logic.guild as GD
import emporium.logic.stage as ST
import emporium.logic.character_names as CN

import engine.models as GM 
import engine.logic.resource as RS


def BackgroundBias():
    potential = [0, 0, 0, 1, 2, 3, 4]
    chosen = random.choice(potential)
    return chosen

def CreateStageLandings(guildMd, heistType, currDate, rawStages):

    lastType = ''
    lastTypeLs = []
    lastBackground = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.World = guildMd.CampaignWorld
        newStage.Heist = heistType
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate
        newStage.LandingTypes = []

        newStage.BaseRewards = {
            'gold': st['Gold'],
            'stone': st['Stone'],
            'gems': st['Gems'],
        }
        newStage.LandingRewards = [None, None, None, None, None]
        newStage.Assignments = [None, None, None, None, None]
        newStage.Burgles = [0, 0, 0, 0, 0]
        newStage.Actions = [None, None, None, None, None]

        background = ST.StageBackground(lastBackground)
        lastBackground = background
        newStage.Background = background
        newStage.BackgroundBias = []

        # landing 1 

        landingType = ST.LandingType(heistType, lastType, lastTypeLs, currDate)
        lastType = landingType
        obstacles = ST.AssembleRoom(landingType, st['LevelLnd1'], st['ObstaclesL1'])
        newStage.LandingTypes.append(landingType)
        newStage.BackgroundBias.append(BackgroundBias())
        newStage.ObstaclesL1 = obstacles

        # landing 2

        if st['LevelLnd2']:
            landingType = ST.LandingType(heistType, lastType, lastTypeLs, currDate)
            lastType = landingType
            obstacles = ST.AssembleRoom(landingType, st['LevelLnd2'], st['ObstaclesL2'])
            newStage.LandingTypes.append(landingType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesL2 = obstacles
        else:
            newStage.LandingTypes.append(None)
            newStage.BackgroundBias.append(None)

        # landing 3 

        if st['LevelLnd3']:
            landingType = ST.LandingType(heistType, lastType, lastTypeLs, currDate)
            lastType = landingType
            obstacles = ST.AssembleRoom(landingType, st['LevelLnd3'], st['ObstaclesL3'])
            newStage.LandingTypes.append(landingType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesL3 = obstacles
        else:
            newStage.LandingTypes.append(None)
            newStage.BackgroundBias.append(None)

        # landing 4

        if st['LevelLnd4']:
            landingType = ST.LandingType(heistType, lastType, lastTypeLs, currDate)
            lastType = landingType
            obstacles = ST.AssembleRoom(landingType, st['LevelLnd4'], st['ObstaclesL4'])
            newStage.LandingTypes.append(landingType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesL4 = obstacles
        else:
            newStage.LandingTypes.append(None)
            newStage.BackgroundBias.append(None)

        # landing 5

        if st['LevelLnd5']:
            landingType = ST.LandingType(heistType, lastType, lastTypeLs, currDate)
            lastType = landingType
            obstacles = ST.AssembleRoom(landingType, st['LevelLnd5'], st['ObstaclesL5'])
            newStage.LandingTypes.append(landingType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesL5 = obstacles
        else:
            newStage.LandingTypes.append(None)
            newStage.BackgroundBias.append(None)

        newStage.save()

def GetOrCreateTower(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='tower', World=guildMd.CampaignWorld, CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create during daily update

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='tower').delete()
    rawStages = list(EM.GothicTower.objects.filter(World=guildMd.CampaignWorld).values())
    CreateStageLandings(guildMd, 'tower', currDate, rawStages)

    # return the stages just created

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='tower').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs

def GetOrCreateTrial(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='trial', World=guildMd.CampaignWorld, CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create during daily update

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='trial').delete()
    rawStages = list(EM.LeagueTrial.objects.filter(World=guildMd.CampaignWorld).values())
    CreateStageLandings(guildMd, 'trial', currDate, rawStages)

    # return the stages just created

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='trial').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs

def GetOrCreateDungeon(guildMd, currDate):

    # check for existing daily stages

    if guildMd.DungeonCheck == currDate:

        # filter can return an empty list

        stage = GM.GuildStage.objects.filter(
            GuildFK=guildMd, Heist='dungeon', World=guildMd.CampaignWorld, CreateDate=currDate
            ).values()

        stageDf = PD.DataFrame(stage).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # since it's the next day, mark the dungeon as checked

    guildMd.DungeonCheck = currDate
    guildMd.save()

    # if it's the first world don't create dungeon

    if guildMd.CampaignWorld == 1:
        return []

    # create during the daily update

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='dungeon').delete()
    result = random.randint(1, 100)

    if result > 80:
        rawStages = list(EM.Dungeon.objects.filter(World=guildMd.CampaignWorld).values())
        CreateStageLandings(guildMd, 'dungeon', currDate, rawStages)

    # return the dungeon, if present today

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='dungeon').values()
    if len(newStages) > 0:
        stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    return []

def GetOrCreateCampaign(guildMd, currDate):

    # check for existing campaign stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='campaign', World=guildMd.CampaignWorld
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create during world update

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='campaign').delete()
    rawStages = list(EM.Campaign.objects.filter(World=guildMd.CampaignWorld).values())
    CreateStageLandings(guildMd, 'campaign', currDate, rawStages)

    # return campaign

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

def GetStageDisplay(pStage):

    minPower = []
    trapLevels = []
    numberObstacles = []
    roomCount = 0

    obstLs = pStage['ObstaclesL1']
    pStage['ObstaclesL1'] = AttachObstacleDisplay(obstLs)
    minPower.append(EM.RequiredPower.objects
        .GetOrNone(Level=obstLs[0]['Level'], Obstacles=len(obstLs)).RequiredPower)
    trapLevels.append(obstLs[0]['Level'])
    numberObstacles.append(len(obstLs))
    roomCount += 1

    try:
        obstLs = pStage['ObstaclesL2']
        pStage['ObstaclesL2'] = AttachObstacleDisplay(obstLs)
        minPower.append(EM.RequiredPower.objects
            .GetOrNone(Level=obstLs[0]['Level'], Obstacles=len(obstLs)).RequiredPower)
        trapLevels.append(obstLs[0]['Level'])
        numberObstacles.append(len(obstLs))
        roomCount += 1
    except:
        trapLevels.append(None)
        numberObstacles.append(None)

    try:
        obstLs = pStage['ObstaclesL3']
        pStage['ObstaclesL3'] = AttachObstacleDisplay(obstLs)
        minPower.append(EM.RequiredPower.objects
            .GetOrNone(Level=obstLs[0]['Level'], Obstacles=len(obstLs)).RequiredPower)
        trapLevels.append(obstLs[0]['Level'])
        numberObstacles.append(len(obstLs))
        roomCount += 1
    except:
        trapLevels.append(None)
        numberObstacles.append(None)

    try:
        obstLs = pStage['ObstaclesL4']
        pStage['ObstaclesL4'] = AttachObstacleDisplay(obstLs)
        minPower.append(EM.RequiredPower.objects
            .GetOrNone(Level=obstLs[0]['Level'], Obstacles=len(obstLs)).RequiredPower)
        trapLevels.append(obstLs[0]['Level'])
        numberObstacles.append(len(obstLs))
        roomCount += 1
    except:
        trapLevels.append(None)
        numberObstacles.append(None)

    try:
        obstLs = pStage['ObstaclesL5']
        pStage['ObstaclesL5'] = AttachObstacleDisplay(obstLs)
        minPower.append(EM.RequiredPower.objects
            .GetOrNone(Level=obstLs[0]['Level'], Obstacles=len(obstLs)).RequiredPower)
        trapLevels.append(obstLs[0]['Level'])
        numberObstacles.append(len(obstLs))
        roomCount += 1
    except:
        trapLevels.append(None)
        numberObstacles.append(None)

    return minPower, trapLevels, numberObstacles, roomCount

def AttachDisplayData(stageLs):

    foundOpen = False       # status: complete, open, blocked

    for st in stageLs:

        minPower, trapLevels, numberObstacles, roomCount = GetStageDisplay(st)

        status = 'blocked'
        if not st['StageRewards'] and not foundOpen:
            status = 'open'
            foundOpen = True
        if st['StageRewards']: status = 'complete'

        st['MinPower'] = minPower
        st['ObstLevels'] = trapLevels
        st['ObstCount'] = numberObstacles
        st['NumberRooms'] = roomCount
        st['Status'] = status

    return stageLs

def GetHeistInfo(stageLs):

    if len(stageLs) == 0: 
        return {}

    completeLanding = 0
    totalLanding = 0
    burgles = 0

    for st in stageLs:
        for nt, tp in enumerate(st['LandingTypes']):
            if not tp: continue
            totalLanding += 1
            if st['LandingRewards'][nt]:
                completeLanding += 1
            burgles += st['Burgles'][nt]

    stage = stageLs[0]
    infoDx = {
        'Campaign': stage['World'],
        'Refresh': stage['CreateDate'],
        'Progress': f"{completeLanding} / {totalLanding}",
        'Burgles': burgles,
    }

    return infoDx

def GetCampaignForward(guildMd):

    nextW = guildMd.CampaignWorld +1
    powerLs = list(EM.RequiredPower.objects.filter(World=nextW).values_list('RequiredPower'))
    powerLs = [x[0] for x in powerLs]

    infoTx = f"Clearing this stage forwards the guild to World {GD.GetRoman(guildMd.CampaignWorld +1)} "
    infoTx += f"including Heists, Expeditions, and the Market. "
    infoTx += f"The recommended thief power is {min(powerLs)} to {max(powerLs)}."

    return infoTx


def CreateExpedition(guildMd, currDate, slotNo):

    # bias the combinations towards lower level expeditions

    levelLs = EM.ExpeditionLevel.objects.filter(World=guildMd.CampaignWorld)
    typeLs = EM.ExpeditionType.objects.all()
    levelMin = levelLs.values('Level').aggregate(Min('Level'))['Level__min']

    allTypes = []
    for lv in levelLs:
        for tp in typeLs:
            allTypes.append(f"{lv.Level}-{tp.Type}")
            if lv.Level == levelMin: allTypes.append(f"{lv.Level}-{tp.Type}")

    # remove the existing ones along with their duplicates

    existMd = GM.GuildExpedition.objects.filter(GuildFK=guildMd)

    if existMd:
        for ep in existMd:
            allTypes.remove(ep.FullType)
            if ep.Level == levelMin: allTypes.remove(ep.FullType)

    # create a random expedition from the remaining

    fullType = random.choice(allTypes)
    fullLevel = int(fullType.split('-')[0])
    levelMd = EM.ExpeditionLevel.objects.GetOrNone(World=guildMd.CampaignWorld, Level=fullLevel)

    newExp = GM.GuildExpedition()
    newExp.GuildFK = guildMd
    newExp.CreateDate = currDate
    newExp.SlotNo = slotNo
    newExp.Level = fullType.split('-')[0]
    newExp.BaseType = fullType.split('-')[1]
    newExp.FullType = fullType
    newExp.Duration = levelMd.Duration
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
            entriesRemove = ['_state', 'GuildFK_id', 'PowerBase', 'BaseAgi', 'BaseCun', 'BaseMig', 'BaseEnd',
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

        # attach display data

        ep['Power'] = EM.RequiredPower.objects.GetOrNone(Level=ep['Level'], Obstacles=15).RequiredPower

        durationInfo = []

        expeditionMd = EM.ExpeditionLevel.objects.GetOrNone(Level=ep['Level'])
        durationInfo.append(f"Expedition {ep['Level']}: {expeditionMd.Duration}")
        levelTm = PD.Timedelta(expeditionMd.Duration).to_pytimedelta()
        durationFinal = levelTm

        durationReduceTm, reduceInfo = RS.GetExpeditionReduction(guildMd)
        durationFinal -= durationReduceTm
        durationInfo += reduceInfo

        minDt = PD.Timedelta(expeditionMd.DurationMin).to_pytimedelta()
        if durationFinal >= minDt:
            durationInfo.append(f"Final: {durationFinal.seconds//3600} hr")
        else:
            durationFinal = minDt
            durationInfo.append(f"Final: {durationFinal.seconds//3600} hr (minimum)")

        ep['Duration'] = f"{durationFinal.seconds//3600} hr"
        ep['DurationInfo'] = durationInfo

    expeditionLs = sorted(expeditionLs, key=lambda d: d['SlotNo'])
    return expeditionLs

def GetReplacement(guildMd, rewardDx):

    replace = None
    FACTOR = 3

    stageMd = EM.GothicTower.objects.GetOrNone(World=guildMd.CampaignWorld, StageNo=1)
    gemsLevel = stageMd.Gems

    # check blueprints

    if rewardDx['category'] == 'blueprint' and 'thief' in rewardDx['resourceId']:
        blueprintTrial = GM.ThiefUnlocked.objects.GetOrNone(
            UserFK=guildMd.UserFK, ThiefFK__ResourceId=rewardDx['resourceId'])
        if blueprintTrial:
            replace = f"already unlocked, convert to {gemsLevel * FACTOR} gems"

    if rewardDx['category'] == 'blueprint' and 'thief' not in rewardDx['resourceId']:
        blueprintTrial = GM.ItemUnlocked.objects.GetOrNone(
            UserFK=guildMd.UserFK, ItemFK__ResourceId=rewardDx['resourceId'])
        if blueprintTrial:
            replace = f"already unlocked, convert to {gemsLevel * FACTOR} gems"

    # check materials

    if rewardDx['category'] == 'material':
        amount = int(rewardDx['value'].split(' ')[0])

        if rewardDx['resourceId'] == 'gold' and guildMd.VaultGold + amount > RS.GetGoldMax(guildMd):
            replace = f"max reached, convert to {gemsLevel * FACTOR} gems"

        if rewardDx['resourceId'] == 'stone' and guildMd.VaultStone + amount > RS.GetStoneMax(guildMd):
            replace = f"max reached, convert to {gemsLevel * FACTOR} gems"

    return replace


def GetOrCreateMarket(userMd, guildMd):

    currentDt = RS.TimezoneToday()

    # check for existing daily market

    checkInventory = GM.MarketStore.objects.filter(
        GuildFK=guildMd, CreateDate=currentDt, World=guildMd.CampaignWorld
        ).values()

    if len(checkInventory) > 0:
        checkInventory = AttachMarketDisplay(checkInventory)
        resourceDf = PD.DataFrame(checkInventory).drop(
            ['_state', 'GuildFK_id',], axis=1, errors='ignore')
        commonDf = resourceDf[resourceDf['StoreType'] == 'common']
        rareDf = resourceDf[resourceDf['StoreType'] == 'rare']
        return  NT.DataframeToDicts(commonDf), NT.DataframeToDicts(rareDf)

    # create common item inventory
    # has thief 1S and world's wargear

    GM.MarketStore.objects.filter(GuildFK=guildMd).delete()

    commonThief = EM.UnlockableThief.objects.filter(Stars=1).values()
    commonItem = EM.UnlockableItem.objects.filter(
        UnlockLevel=guildMd.CampaignWorld, MagicLv=0, Requirement__isnull=False).values()

    for cm in commonThief:
        newReso = GM.MarketStore()
        newReso.GuildFK = guildMd
        newReso.CreateDate = currentDt
        newReso.World = guildMd.CampaignWorld
        newReso.ResourceId = cm['ResourceId']
        newReso.StoreType = 'common'
        newReso.RareProperties = {
            'name': RS.GetThiefName(guildMd),
            'agi': 3 if 'agi' in cm['ResourceId'] else 0,
            'cun': 3 if 'cun' in cm['ResourceId'] else 0,
            'mig': 3 if 'mig' in cm['ResourceId'] else 0,
            'end': 0,
        }
        newReso.save()

    for cm in commonItem:
        newReso = GM.MarketStore()
        newReso.GuildFK = guildMd
        newReso.CreateDate = currentDt
        newReso.World = guildMd.CampaignWorld
        newReso.ResourceId = cm['ResourceId']
        newReso.StoreType = 'common'
        newReso.save()

    # create rare items from random table
    # has accessories, unlocked resources

    rareAccessory = EM.UnlockableItem.objects.filter(
        UnlockLevel=guildMd.CampaignWorld, MagicLv=0, Requirement__isnull=True)

    rareThief = GM.ThiefUnlocked.objects.filter(
        UserFK=userMd)

    rareMagic = GM.ItemUnlocked.objects.filter(
        UserFK=userMd, ItemFK__UnlockLevel__in=[guildMd.CampaignWorld, guildMd.CampaignWorld -1])

    potentialLs = []

    for rr in rareAccessory:
        potentialLs.append(rr.ResourceId)

    for rr in rareThief:
        potentialLs.append(rr.ThiefFK.ResourceId)

    for rr in rareMagic:
        potentialLs.append(rr.ItemFK.ResourceId)

    rareSlots = RS.GetMagicStoreCount(guildMd)

    for rg in range(0, rareSlots):

        if len(potentialLs) == 0: break

        randomType = random.choice(potentialLs)
        potentialLs.remove(randomType)

        newReso = GM.MarketStore()
        newReso.GuildFK = guildMd
        newReso.CreateDate = currentDt
        newReso.World = guildMd.CampaignWorld
        newReso.ResourceId = randomType
        newReso.StoreType = 'rare'
        newReso.RareProperties = None

        if 'thief' in randomType:
            newName = RS.GetThiefName(guildMd)
            newReso.RareProperties = ST.GetStarThief(randomType, newName)

        newReso.save()

    # on first day add 4 cloaks to rare store

    if guildMd.CreateDate == currentDt and guildMd.CampaignWorld == 1:
        for rg in range(0, 4):
            cloakMd = EM.UnlockableItem.objects.GetOrNone(UnlockLevel=1, MagicLv=0, Slot='back')
            newReso = GM.MarketStore()
            newReso.GuildFK = guildMd
            newReso.CreateDate = currentDt
            newReso.World = guildMd.CampaignWorld
            newReso.ResourceId = cloakMd.ResourceId
            newReso.StoreType = 'rare'
            newReso.RareProperties = None
            newReso.save()


    # get the newly created data

    inventory = GM.MarketStore.objects.filter(GuildFK=guildMd, CreateDate=currentDt).values()
    inventory = AttachMarketDisplay(inventory)

    resourceDf = PD.DataFrame(inventory).drop(['_state', 'GuildFK_id',], axis=1, errors='ignore')
    commonDf = resourceDf[resourceDf['StoreType'] == 'common']
    rareDf = resourceDf[resourceDf['StoreType'] == 'rare']

    return  NT.DataframeToDicts(commonDf), NT.DataframeToDicts(rareDf)

def AttachMarketDisplay(resourceLs):
    # resource: MarketStore dict

    for rs in resourceLs:

        name = power = iconCode = resourceDx = None

        if 'thief' in rs['ResourceId']:
            resourceMd = EM.UnlockableThief.objects.GetOrNone(ResourceId=rs['ResourceId'])
            name = resourceMd.Class
            power = int(resourceMd.StoreCost / GD.POWER_FACTOR)
            resourceDx = resourceMd.__dict__
            removeKeys = ['id', '_state', 'StartTrait', 'UnlockLevel', 'ResourceId']
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

            if resourceDx['Slot'] in ['weapon', 'armor', 'back']: stat = resourceDx['Trait'][:3]
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

            if resourceDx['Magic']:
                resourceDx['Magic'] = resourceDx['Magic'].title().replace(' ', ' +')

        rs['Name'] = name
        rs['Power'] = power
        rs['IconCode'] = iconCode  
        rs['ResourceDx'] = resourceDx  

    return resourceLs

def BuyPermission(storeId, guildMd):

    storeMd = GM.MarketStore.objects.GetOrNone(id=storeId)

    # thief blockage

    if 'thief' in storeMd.ResourceId:
        currThieves = RS.GetThiefCount(guildMd)
        maxThieves = RS.GetThiefMax(guildMd)
        if currThieves == maxThieves:
            return 'guild occupancy is full'

    # cost blockage

    if 'thief' in storeMd.ResourceId:
        resourceMd = EM.UnlockableThief.objects.GetOrNone(ResourceId=storeMd.ResourceId)
    else:
        resourceMd = EM.UnlockableItem.objects.GetOrNone(ResourceId=storeMd.ResourceId)

    if resourceMd.StoreCost > guildMd.VaultGold:
        return 'gold coffers are deficient'

    return None

def BuyMarket(storeId, guildMd):

    storeMd = GM.MarketStore.objects.GetOrNone(id=storeId)

    # add thief to the guild

    if 'thief' in storeMd.ResourceId:
        resourceMd = EM.UnlockableThief.objects.GetOrNone(ResourceId=storeMd.ResourceId)

        newThief ={
            'GuildFK': guildMd,
            'Name': storeMd.RareProperties['name'],
            'Class': resourceMd.Class,
            'Stars': resourceMd.Stars,
            'BasePower': resourceMd.StoreCost / GD.POWER_FACTOR,
            'BaseAgi': storeMd.RareProperties['agi'],
            'BaseCun': storeMd.RareProperties['cun'],
            'BaseMig': storeMd.RareProperties['mig'],
            'BaseEnd': storeMd.RareProperties['end'],
        }
        newModel = GM.ThiefInGuild(**newThief)
        newModel.save()

        RS.SetThiefTotals(newModel)
        RS.SetGuildTotals(guildMd)
        storeMd.Bought = True
        storeMd.save()

    # add item to the vault

    else:
        resourceMd = EM.UnlockableItem.objects.GetOrNone(ResourceId=storeMd.ResourceId)

        newItem = {
            'GuildFK': guildMd,
            'ThiefFK': None,
            'Throne': resourceMd.UnlockLevel,
            'Name': resourceMd.Name,
            'Slot': resourceMd.Slot,
            'MagicLv': resourceMd.MagicLv,
            'TotalLv': resourceMd.TotalLv,
            'Power': resourceMd.StoreCost / GD.POWER_FACTOR,
            'Requirement': resourceMd.Requirement,
            'Trait': resourceMd.Trait,
            'Combat': resourceMd.Combat,
            'Skill': resourceMd.Skill,
            'Magic': storeMd.RareProperties['magic'] if storeMd.RareProperties else None,
        }
        newModel = GM.ItemInGuild(**newItem).save()

        storeMd.Bought = True
        storeMd.save()

    # deduct the gold cost

    guildMd.VaultGold -= resourceMd.StoreCost
    guildMd.save()

    return storeMd
