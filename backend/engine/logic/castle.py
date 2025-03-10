"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE CASTLE ROOMS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import pandas as PD

import app_proj.notebooks as NT
import emporium.models as EM 
import emporium.logic.guild as GD

import engine.models as GM 
import engine.logic.resource as RS


def GetInfo(upgradeType, roomName, roomLevel):

    if roomLevel == 0:
        return {}

    if upgradeType == 'unique':

        abilityMd = EM.UniqueRoom.objects.GetOrNone(Level=roomLevel)

        if roomName == 'Throne':
            infoDx = {
                'Max Rooms':            abilityMd.MaxRoomCount,
                'Max Room Level':       abilityMd.MaxRoomLevel,
                'Gold Storage':         abilityMd.Throne_Gold, 
                'Stone Storage':        abilityMd.Throne_Stone,
            }

        if roomName == 'Great Hall':
            infoDx = {
                'Max Thieves':          abilityMd.Hall_MaxThieves,
                'Expedition Slots':     abilityMd.Hall_Expedition,
                'Magic Store Slots':    abilityMd.Hall_MagicStore,
            }

        if roomName == 'Keep':
            infoDx = {
                'Defenders':    abilityMd.Keep_Defenders,
                'Traps':        abilityMd.Keep_Traps,
            }

    if upgradeType == 'basic':

        abilityMd = EM.BasicRoom.objects.GetOrNone(Level=roomLevel)

        if roomName == 'Bank':
            infoDx = {'Gold Storage': abilityMd.Bank_Gold, }

        if roomName == 'Warehouse':
            infoDx = {'Stone Storage': abilityMd.Warehouse_Stone, }

        if roomName == 'Scholarium':
            infoDx = {'Max Thief Level': abilityMd.Scholarium_MaxLevel, }

        if roomName == 'Dormitory':
            infoDx = {
                'Max Thieves': f"{abilityMd.Dorm_MaxThieves}",
                'Rest Bonus': abilityMd.Dorm_Recovery,
            }

        if roomName == 'Cartographer':
            infoDx = {
                'Expedition Slots': abilityMd.Cartog_Slots,
                'Duration Bonus': f"{abilityMd.Cartog_Bonus}",
            }

    if upgradeType == 'advanced':

        abilityMd = EM.AdvancedRoom.objects.GetOrNone(Level=roomLevel)

        if roomName == 'Fence':
            infoDx = {
                'Heist Gold Bonus': abilityMd.Fence_GoldBonus,
                'Magic Store Slots': abilityMd.Fence_MagicSlots,
            }

        if roomName == 'Workshop':
            infoDx = {
                'Heist Stone Bonus': abilityMd.Workshop_StoneBonus,
                'Extra Defense': abilityMd.Workshop_Defense,
            }

        if roomName == 'Jeweler':
            infoDx = {
                'Heist Gem Bonus': abilityMd.Jeweler_GemBonus,
                'Expedition Slots': abilityMd.Jeweler_ExpedSlots,
            }

        if roomName == 'Blacksmith':
            infoDx = {'Creation Time': abilityMd.Blacksmith_Period,}

        if roomName == 'Artisan':
            infoDx = {
                'Upgrade Cost': abilityMd.Artisan_Cost,
                'Upgrade Time': abilityMd.Artisan_Period,
            }

    return infoDx

def GetUpgradeInfo(upgradeType, roomName, roomLevel):

    if upgradeType == 'unique':

        currMd = EM.UniqueRoom.objects.GetOrNone(Level=roomLevel)
        nextMd = EM.UniqueRoom.objects.GetOrNone(Level=(roomLevel +1))

        if roomName == 'Throne':
            infoDx = {
                'Max Rooms':            f"{currMd.MaxRoomCount} -> {nextMd.MaxRoomCount}",
                'Max Room Level':       f"{currMd.MaxRoomLevel} -> {nextMd.MaxRoomLevel}",
                'Gold Storage':         f"{currMd.Throne_Gold} -> {nextMd.Throne_Gold}", 
                'Stone Storage':        f"{currMd.Throne_Stone} -> {nextMd.Throne_Stone}",
            }

        if roomName == 'Great Hall':
            infoDx = {
                'Max Thieves':          f"{currMd.Hall_MaxThieves} -> {nextMd.Hall_MaxThieves}",
                'Expedition Slots':     f"{currMd.Hall_Expedition} -> {nextMd.Hall_Expedition}",
                'Magic Store Slots':    f"{currMd.Hall_MagicStore} -> {nextMd.Hall_MagicStore}",
            }

        if roomName == 'Keep':
            infoDx = {
                'Defenders':    f"{currMd.Keep_Defenders} -> {nextMd.Keep_Defenders}",
                'Traps':        f"{currMd.Keep_Traps} -> {nextMd.Keep_Traps}",
            }

    if upgradeType == 'basic':

        currMd = EM.BasicRoom.objects.GetOrNone(Level=roomLevel)
        nextMd = EM.BasicRoom.objects.GetOrNone(Level=(roomLevel +1))

        if roomName == 'Bank':
            infoDx = {'Gold Storage': f"{currMd.Bank_Gold} -> {nextMd.Bank_Gold}", }

        if roomName == 'Warehouse':
            infoDx = {'Stone Storage': f"{currMd.Warehouse_Stone} -> {nextMd.Warehouse_Stone}", }

        if roomName == 'Scholarium':
            infoDx = {'Max Thief Level': f"{currMd.Scholarium_MaxLevel} -> {nextMd.Scholarium_MaxLevel}", }

        if roomName == 'Dormitory':
            infoDx = {
                'Max Thieves': f"{currMd.Dorm_MaxThieves} -> {nextMd.Dorm_MaxThieves}",
                'Rest Bonus': f"{currMd.Dorm_Recovery} -> {nextMd.Dorm_Recovery}",
            }

        if roomName == 'Cartographer':
            infoDx = {
                'Expedition Slots': f"{currMd.Cartog_Slots} -> {nextMd.Cartog_Slots}",
                'Duration Bonus': f"{currMd.Cartog_Bonus} -> {nextMd.Cartog_Bonus}",
            }

    if upgradeType == 'advanced':

        advancedMd = EM.AdvancedRoom.objects.GetOrNone(Level=roomLevel)
        advancedNextMd = EM.AdvancedRoom.objects.GetOrNone(Level=(roomLevel +1))

        if roomName == 'Fence':
            infoDx = {
                'Heist Gold Bonus': advancedMd.Fence_GoldBonus,
                'Magic Store Slots': advancedMd.Fence_MagicSlots,
            }

        if roomName == 'Workshop':
            infoDx = {
                'Heist Stone Bonus': advancedMd.Workshop_StoneBonus,
                'Extra Defense': advancedMd.Workshop_Defense,
            }

        if roomName == 'Jeweler':
            infoDx = {
                'Heist Gem Bonus': advancedMd.Jeweler_GemBonus,
                'Expedition Slots': advancedMd.Jeweler_ExpedSlots,
            }

        if roomName == 'Blacksmith':
            infoDx = {'Creation Time': advancedMd.Blacksmith_Period,}

        if roomName == 'Artisan':
            infoDx = {
                'Upgrade Cost': advancedMd.Artisan_Cost,
                'Upgrade Time': advancedMd.Artisan_Period,
            }

    return infoDx

def CastleDetails(guildMd):

    # middle rooms

    middleRooms = GM.RoomInGuild.objects.filter(GuildFK=guildMd, UpgradeType='unique')
    middleRooms = middleRooms.values()

    for rm in middleRooms:
        rm.pop('id')
        rm.pop('GuildFK_id')

        # update buttons and level info

        rm['infoDx'] = GetInfo(rm['UpgradeType'], rm['Name'], rm['Level'])

        if rm['Name'] == 'Keep' and rm['Level'] <= 2:
            rm['infoDx'] = None
            rm['infoTx'] = 'Unlock at Throne 3'

        rm['buttonLs'] = ['upgrade']

        # update status

        status = rm['Status']
        cooldown = None
        if rm['CooldownExpire']:
            trunkNow = RS.TimezoneToday(withTime=True)
            cooldown = rm['CooldownExpire'] - trunkNow
            if cooldown.total_seconds() <= 0 and status == 'Upgrading': status = 'Upgraded'

        rm['Status'] = status
        rm['cooldown'] = cooldown

    # left rooms

    leftRooms = []

    for rg in range(1, 5):

        placement = f"L1 {rg}"
        roomTrial = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)

        if roomTrial:

            cooldown = None
            if roomTrial.CooldownExpire:
                trunkNow = RS.TimezoneToday(withTime=True)
                cooldown = roomTrial.CooldownExpire - trunkNow

            cooldownFix = cooldown.total_seconds() if cooldown else 0

            status = roomTrial.Status
            if cooldownFix <= 1 and status == 'Upgrading': status = 'Upgraded'
            if cooldownFix <= 1 and status == 'Training': status = 'Trained'
            if cooldownFix <= 1 and status == 'Crafting': status = 'Crafted'

            basicMd = EM.BasicRoom.objects.GetOrNone(Level=1)
            advancedMd = EM.AdvancedRoom.objects.GetOrNone(Level=1)

            buttonLs = ['upgrade', 'move', 'delete']

            if roomTrial.Name == 'Scholarium':
                buttonLs.insert(0, 'train')

            leftRooms.append({
                'Name': roomTrial.Name,
                'Level': roomTrial.Level,
                'Placement': placement,
                'Status': status,
                'cooldown': cooldown,
                'infoDx': GetInfo(roomTrial.UpgradeType, roomTrial.Name, roomTrial.Level),
                'buttonLs': buttonLs,
            })

        else:
            leftRooms.append({
                'Name': 'Empty',
                'Placement': placement,
                'Status': 'Ready',
                'infoTx': 'Available to build',
                'buttonLs': ['create'],
            })

    # right one rooms

    rightOneRooms = []

    for rg in range(1, 5):

        placement = f"R1 {rg}"
        roomTrial = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)

        if roomTrial:

            cooldown = None
            if roomTrial.CooldownExpire:
                trunkNow = RS.TimezoneToday(withTime=True)
                cooldown = roomTrial.CooldownExpire - trunkNow

            cooldownFix = cooldown.total_seconds() if cooldown else 0

            status = roomTrial.Status
            if cooldownFix <= 1 and status == 'Upgrading': status = 'Upgraded'
            if cooldownFix <= 1 and status == 'Training': status = 'Trained'
            if cooldownFix <= 1 and status == 'Crafting': status = 'Crafted'

            basicMd = EM.BasicRoom.objects.GetOrNone(Level=1)
            advancedMd = EM.AdvancedRoom.objects.GetOrNone(Level=1)

            buttonLs = ['upgrade', 'move', 'delete']

            if roomTrial.Name == 'Scholarium':
                buttonLs.insert(0, 'train')

            rightOneRooms.append({
                'Name': roomTrial.Name,
                'Level': roomTrial.Level,
                'Placement': placement,
                'Status': status,
                'cooldown': cooldown,
                'infoDx': GetInfo(roomTrial.UpgradeType, roomTrial.Name, roomTrial.Level),
                'buttonLs': buttonLs,
            })

        else:
            rightOneRooms.append({
                'Name': 'Empty',
                'Placement': placement,
                'Status': 'Ready',
                'infoTx': 'Available to build',
                'buttonLs': ['create'],
            })

    # right two rooms

    rightTwoRooms = []

    for rg in range(1, 5):

        placement = f"R2 {rg}"
        roomTrial = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)

        if roomTrial:

            cooldown = None
            if roomTrial.CooldownExpire:
                trunkNow = RS.TimezoneToday(withTime=True)
                cooldown = roomTrial.CooldownExpire - trunkNow

            cooldownFix = cooldown.total_seconds() if cooldown else 0

            status = roomTrial.Status
            if cooldownFix <= 1 and status == 'Upgrading': status = 'Upgraded'
            if cooldownFix <= 1 and status == 'Training': status = 'Trained'
            if cooldownFix <= 1 and status == 'Crafting': status = 'Crafted'

            basicMd = EM.BasicRoom.objects.GetOrNone(Level=1)
            advancedMd = EM.AdvancedRoom.objects.GetOrNone(Level=1)

            buttonLs = ['upgrade', 'move', 'delete']

            if roomTrial.Name == 'Scholarium':
                buttonLs.insert(0, 'train')

            rightTwoRooms.append({
                'Name': roomTrial.Name,
                'Level': roomTrial.Level,
                'Placement': placement,
                'Status': status,
                'cooldown': cooldown,
                'infoDx': GetInfo(roomTrial.UpgradeType, roomTrial.Name, roomTrial.Level),
                'buttonLs': buttonLs,
            })

        else:
            rightTwoRooms.append({
                'Name': 'Empty',
                'Placement': placement,
                'Status': 'Ready',
                'infoTx': 'Available to build',
                'buttonLs': ['create'],
            })

    # create menu

    createMenu = []
    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=1)

    menuRoomLs = EM.CastleRoom.objects.filter(UnlockLevel__lte=guildMd.CampaignWorld, UpgradeType='basic')
    for rm in menuRoomLs:
        createMenu.append({
            'name': rm.Name,
            'cost': upgradeMd.Stone_Basic,
            'duration': upgradeMd.Period_Basic,
        })

    menuRoomLs = EM.CastleRoom.objects.filter(UnlockLevel__lte=guildMd.CampaignWorld, UpgradeType='advanced')
    for rm in menuRoomLs:
        createMenu.append({
            'name': rm.Name,
            'cost': upgradeMd.Stone_Advanced,
            'duration': upgradeMd.Period_Advanced,
        })

    placeOptions = ['L1 1', 'L1 2', 'L1 3', 'L1 4', 
        'R1 1', 'R1 2', 'R1 3', 'R1 4', 
        'R2 1', 'R2 2', 'R2 3', 'R2 4',
    ]

    # return

    details = {
        'leftCol': leftRooms,
        'middleCol': middleRooms,
        'rightOneCol': rightOneRooms,
        'rightTwoCol': rightTwoRooms,
        'createOptions': createMenu,
        'placeOptions': placeOptions,
    }
    return details

def CreatePermission(roomName, guildMd):

    # gather data

    buildRoom = EM.CastleRoom.objects.GetOrNone(Name=roomName)
    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=1)
    cost = upgradeMd.Stone_Basic
    duration = upgradeMd.Period_Basic
    if buildRoom.UpgradeType == 'advanced':
        cost = upgradeMd.Stone_Advanced
        duration = upgradeMd.Period_Advanced
    
    # discover permission

    permission = None

    if guildMd.VaultStone < cost:
        permission = 'Stone reserves are insufficient'

    if RS.GetRoomCount(guildMd) == RS.GetRoomMax(guildMd):
        permission = 'Max rooms built'

    resultDx = {
        'name': roomName,
        'cost': cost,
        'duration': duration,
        'infoDx': GetInfo(buildRoom.UpgradeType, roomName, 1),
        'permission': permission,
    }
    return resultDx

def CreateRoom(roomName, placement, guildMd):

    # permissions have passed, so deduct room cost

    roomTemplate = EM.CastleRoom.objects.GetOrNone(Name=roomName)
    upgradeTemplate = EM.RoomUpgrade.objects.GetOrNone(Level=1)

    if roomTemplate.UpgradeType == 'basic':
        cost = upgradeTemplate.Stone_Basic
        period = upgradeTemplate.Period_Basic
    else:
        cost = upgradeTemplate.Stone_Advanced
        period = upgradeTemplate.Period_Advanced

    guildMd.VaultStone -= cost
    guildMd.save()

    trunkNow = RS.TimezoneToday(withTime=True)
    expireTm = PD.Timedelta(period).to_pytimedelta()

    # create the room

    roomDx = {
        'GuildFK': guildMd,
        'Name': roomName,
        'UpgradeType': roomTemplate.UpgradeType,
        'Placement': placement,
        'Description': roomTemplate.Description,
        'Status': 'Upgrading',
        'CooldownExpire': trunkNow + expireTm,
    }

    newRoom = GM.RoomInGuild(**roomDx)
    newRoom.save()

def UpgradePermission(placement, guildMd):

    roomMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)
    throneMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Name='Throne')

    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=roomMd.Level +1)
    cost = upgradeMd.Stone_Basic
    duration = upgradeMd.Period_Basic
    if roomMd.UpgradeType == 'advanced': 
        cost = upgradeMd.Stone_Advanced
        duration = upgradeMd.Period_Advanced
    if roomMd.UpgradeType == 'unique': 
        cost = upgradeMd.Stone_Unique
        duration = upgradeMd.Period_Unique

    permission = None

    if guildMd.VaultStone < cost:
        permission = 'Stone reserves are insufficient'

    if roomMd.Name == 'Throne' and roomMd.Level == guildMd.CampaignWorld:
        permission = f"Progress to Campaign World {guildMd.CampaignWorld +1}"

    if roomMd.Name != 'Throne' and roomMd.Level == throneMd.Level:
        permission = f"Upgrade the Throne to {throneMd.Level +1}"

    resultDx = {
        'name': f"{roomMd.Name} {roomMd.Level} -> {roomMd.Level +1}",
        'cost': cost,
        'duration': duration,
        'infoDx': GetUpgradeInfo(roomMd.UpgradeType, roomMd.Name, roomMd.Level),
        'permission': permission,
    }
    return resultDx

def UpgradeRoom(placement, guildMd):

    roomMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)
    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=roomMd.Level +1)

    cost = upgradeMd.Stone_Basic
    period = upgradeMd.Period_Basic
    if roomMd.UpgradeType == 'advanced':
        cost = upgradeMd.Stone_Advanced
        period = upgradeMd.Period_Advanced
    if roomMd.UpgradeType == 'unique':
        cost = upgradeMd.Stone_Unique
        period = upgradeMd.Period_Unique

    guildMd.VaultStone -= cost
    guildMd.save()

    trunkNow = RS.TimezoneToday(withTime=True)
    expireTm = PD.Timedelta(period).to_pytimedelta()

    roomMd.Status = 'Upgrading'
    roomMd.CooldownExpire = trunkNow + expireTm
    roomMd.save()

def MoveRoom(guildMd, currentPlace, targetPlace):

    currentRoom = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=currentPlace)
    targetRoom = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=targetPlace)

    currentRoom.Placement = targetPlace
    currentRoom.save()

    if targetRoom:
        targetRoom.Placement = currentPlace
        targetRoom.save()

def DeletePermission(guildMd, placement):

    roomMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)

    # check permission

    permission = None

    if roomMd.Status != 'Ready':
        permission = 'Room must be unoccupied'

    if roomMd.Name == 'Dormitory':
        abilityMd = EM.BasicRoom.objects.GetOrNone(Level=roomMd.Level)
        deleteSlots = abilityMd.Dorm_MaxThieves
        thievesGuild = RS.GetThiefCount(guildMd)
        thievesMax = RS.GetThiefMax(guildMd)
        surplusThieves = thievesGuild - (thievesMax - deleteSlots)
        if surplusThieves >= 1:
            permission = f"Retire {surplusThieves} thieves from the guild"

    if any(roomMd.Name for x in ['Cartographer', 'Jeweler']):

        # cooldown = null, thief = null
        # cooldown > 0, thief = thief
        # cooldown = "0.0", thief = thief
        # cooldown = ?, thief = thief, claimed = true

        if roomMd.Name == 'Cartographer':
            abilityMd = EM.BasicRoom.objects.GetOrNone(Level=roomMd.Level)
            roomSlots = abilityMd.Cartog_Slots
        else:
            abilityMd = EM.AdvancedRoom.objects.GetOrNone(Level=roomMd.Level)
            roomSlots = abilityMd.Jeweler_ExpedSlots

        expedSlots = RS.GetExpeditionCount(guildMd)
        slotsToCheck = [(expedSlots - x) for x in range(0, roomSlots)]

        for sc in slotsToCheck:

            expeditionMd = GM.GuildExpedition.objects.GetOrNone(GuildFK=guildMd, SlotNo=sc)
            if not expeditionMd: continue

            if expeditionMd.ThiefFK == None or expeditionMd.Claimed == True:
                expeditionMd.delete()

            else:
                permission = f"Expedition slot {sc} is outstanding"
                break

    # append refund amount

    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=roomMd.Level)
    refund = upgradeMd.Stone_Basic
    if roomMd.UpgradeType == 'advanced': refund = upgradeMd.Stone_Advanced
    refund = round(refund / 2)

    resultDx = {
        'name': roomMd.Name,
        'level': roomMd.Level,
        'refund': refund,
        'infoDx': GetInfo(roomMd.UpgradeType, roomMd.Name, roomMd.Level),
        'permission': permission,
    }
    return resultDx

def DeleteRoom(guildMd, placement):

    roomMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)

    # get the refund 

    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=roomMd.Level)
    refund = upgradeMd.Stone_Basic
    if roomMd.UpgradeType == 'advanced': refund = upgradeMd.Stone_Advanced
    refund = round(refund / 2)

    # delete the room

    roomMd.delete()

    # reduce currencies

    RS.GrantGold(guildMd, 0)
    RS.GrantStone(guildMd, refund)

def TrainingDetails(guildMd):

    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    thiefLs = []

    for md in thiefMds:

        totalSkill = RS.GetTotalSkill(md)
        totalCombat = RS.GetTotalCombat(md)

        thiefDx = md.__dict__
        thiefLs.append(thiefDx)

        # display formatting

        thiefDx['DisplayDamage'] = f"<{thiefDx['Damage']}>"
        thiefDx['GuildIcon'] = f"class-{thiefDx['Class'].lower()}-s{thiefDx['Stars']}"
        thiefDx['StageIcon'] = f"thief-{thiefDx['Class'].lower()}"

        levelMd = EM.ThiefLevel.objects.GetOrNone(Level=thiefDx['Level'])
        levelNextMd = EM.ThiefLevel.objects.GetOrNone(Level=thiefDx['Level']+1)

        thiefDx['ExpNextLevel'] = levelNextMd.Experience
        thiefDx['PowerNext'] = thiefDx['Power'] + levelNextMd.Power - levelMd.Power
        thiefDx['Duration'] = levelMd.TrainPeriod

        thiefDx['TotalSkill'] = totalSkill
        thiefDx['TotalCombat'] = totalCombat

        # advancement data structure

        traitAdv = [
            {'stat': 'Agi +1', 'base': thiefDx['BaseAgi'], 'trained': thiefDx['TrainedAgi']},
            {'stat': 'Cun +1', 'base': thiefDx['BaseCun'], 'trained': thiefDx['TrainedCun']},
            {'stat': 'Mig +1', 'base': thiefDx['BaseMig'], 'trained': thiefDx['TrainedMig']},
            {'stat': 'End +1', 'base': thiefDx['BaseEnd'], 'trained': thiefDx['TrainedEnd']},
        ]
        for idx, tr in enumerate(traitAdv): 
            tr['available'] = 6 - tr['trained']
            tr['id'] = idx      # frontend datagrid
            tr['selected'] = 0

        checkTx = ' '.join(thiefDx['TrainedSkills'])
        skillAdv = [
            {'stat': 'Att +2', 'base': None, 'trained': 1 if 'att' in checkTx else 0 },
            {'stat': 'Dmg +2', 'base': None, 'trained': 1 if 'dmg' in checkTx else 0 },
            {'stat': 'Def +2', 'base': None, 'trained': 1 if 'def' in checkTx else 0 },
            {'stat': 'Sab +4', 'base': None, 'trained': 1 if 'sab' in checkTx else 0 },
            {'stat': 'Per +4', 'base': None, 'trained': 1 if 'per' in checkTx else 0 },
            {'stat': 'Tra +4', 'base': None, 'trained': 1 if 'tra' in checkTx else 0 },
        ]
        for idx, tr in enumerate(skillAdv): 
            tr['available'] = 1 - tr['trained']
            tr['id'] = 10 + idx 
            tr['selected'] = 0
        thiefDx['Advances'] = traitAdv + skillAdv

        # sorting

        majorSort = 'C'
        if thiefDx['Class'] == 'Scoundrel': majorSort = 'B'
        if thiefDx['Class'] == 'Ruffian': majorSort = 'A'
        thiefDx['sorting'] = f"{majorSort}-{str(thiefDx['Power']).zfill(4)}"

    thiefDf = PD.DataFrame(thiefLs)
    thiefDf = thiefDf.drop(['_state', 'GuildFK_id', 'CooldownExpire',
                            'BaseAgi', 'BaseCun', 'BaseMig', 'BaseEnd', 
                            'TrainedAgi', 'TrainedCun', 'TrainedMig', 'TrainedEnd'], 
                            axis=1, errors='ignore')
    thiefDf = thiefDf.sort_values(by=['sorting'], ascending=[False])

    return NT.DataframeToDicts(thiefDf)

def TrainingStart(guildMd, thiefId, advance, placement):

    roomMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)
    thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thiefId)
    upgradeMd = EM.ThiefLevel.objects.GetOrNone(Level=thiefMd.Level)

    trunkNow = RS.TimezoneToday(withTime=True)
    expireTm = PD.Timedelta(upgradeMd.TrainPeriod).to_pytimedelta()
    advance = advance.lower().replace('+', '')

    roomMd.Status = 'Training'
    roomMd.CooldownExpire = trunkNow + expireTm
    roomMd.StaffingData = [{'thiefId': thiefId, 'data': advance}]
    roomMd.save()

    thiefMd.Status = 'Training'
    thiefMd.CooldownExpire = trunkNow + expireTm
    thiefMd.save()

def CastleFinalize(placement, guildMd):

    roomMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)

    if roomMd.Status == 'Upgrading':
        roomMd.Level += 1

    if roomMd.Status == 'Training':
        staffing = roomMd.StaffingData[0]
        thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=staffing['thiefId'])
        
        if 'agi' in staffing['data']:       thiefMd.TrainedAgi += 1
        elif 'cun' in staffing['data']:     thiefMd.TrainedCun += 1
        elif 'mig' in staffing['data']:     thiefMd.TrainedMig += 1
        elif 'end' in staffing['data']:     thiefMd.TrainedEnd += 1
        else:                               thiefMd.TrainedSkills.append(staffing['data'])

        thiefMd.Level += 1
        thiefMd.Experience = 0
        thiefMd.Status = 'Ready'
        thiefMd.CooldownExpire = None
        thiefMd.save()
        RS.SetThiefTotals(thiefMd)

    # update room status regardless of finalize type

    roomMd.Status = 'Ready'
    roomMd.CooldownExpire = None
    roomMd.StaffingData = []
    roomMd.save()
