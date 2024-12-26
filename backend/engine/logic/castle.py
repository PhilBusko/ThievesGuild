"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE CASTLE ROOMS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import pandas as PD
from django.utils import timezone

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
                'Max Thieves': f"+{abilityMd.Dorm_MaxThieves}",
                'Rest Bonus': abilityMd.Dorm_Recovery,
            }

        if roomName == 'Cartographer':
            infoDx = {
                'Expedition Slots': abilityMd.Cartog_Slots,
                'Rest Bonus': abilityMd.Cartog_Recovery,
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

        currMd = EM.AdvancedRoom.objects.GetOrNone(Level=roomLevel)
        nextMd = EM.AdvancedRoom.objects.GetOrNone(Level=(roomLevel +1))

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
            infoDx = {'Stone Storage': f"{basicMd.Warehouse_Stone} -> {nextMd.Warehouse_Stone}", }

        if roomName == 'Scholarium':
            infoDx = {'Max Thief Level': f"{basicMd.Scholarium_MaxLevel} -> {nextMd.Scholarium_MaxLevel}", }

        if roomName == 'Dormitory':
            infoDx = {
                'Max Thieves': f"+{basicMd.Dorm_MaxThieves} -> {nextMd.Dorm_MaxThieves}",
                'Rest Bonus': f"{basicMd.Dorm_Recovery} -> {nextMd.Dorm_Recovery}",
            }

        if roomName == 'Cartographer':
            infoDx = {
                'Expedition Slots': f"{basicMd.Cartog_Slots} -> {nextMd.Cartog_Slots}",
                'Rest Bonus': f"{basicMd.Cartog_Recovery} -> {nextMd.Cartog_Recovery}",
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
        rm.pop('CooldownExpire')

        rm['infoDx'] = GetInfo(rm['UpgradeType'], rm['Name'], rm['Level'])

        if rm['Name'] == 'Keep' and rm['Level'] <= 2:
            rm['infoDx'] = None
            rm['infoTx'] = 'Unlock at Throne 3'

        rm['buttonLs'] = ['upgrade']

        if rm['Name'] == 'Throne':
            throneLevel = rm['Level']


    # left rooms

    leftRooms = []

    for rg in range(1, 5):

        placement = f"L1 {rg}"
        roomTrial = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)

        if roomTrial:

            cooldown = None
            if roomTrial.CooldownExpire:
                trunkNow = timezone.now().replace(microsecond=0)
                cooldown = roomTrial.CooldownExpire - trunkNow

            status = roomTrial.Status
            if cooldown.total_seconds() <= 0 and status == 'Upgrading': status = 'Upgraded'
            if cooldown.total_seconds() <= 0 and status == 'Training': status = 'Trained'
            if cooldown.total_seconds() <= 0 and status == 'Crafting': status = 'Crafted'

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
                'infoDx': GetInfo(roomTrial.Name, roomTrial.Level),
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




    # create menu

    createMenu = []
    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=1)

    menuRoomLs = EM.CastleRoom.objects.filter(UnlockThrone__lte=throneLevel, UpgradeType='basic')
    for rm in menuRoomLs:
        createMenu.append({
            'name': rm.Name,
            'cost': upgradeMd.Stone_Basic,
            'duration': upgradeMd.Period_Basic,
        })

    menuRoomLs = EM.CastleRoom.objects.filter(UnlockThrone__lte=throneLevel, UpgradeType='advanced')
    for rm in menuRoomLs:
        createMenu.append({
            'name': rm.Name,
            'cost': upgradeMd.Stone_Advanced,
            'duration': upgradeMd.Period_Advanced,
        })

    # return

    details = {
        'leftCol': leftRooms,
        'middleCol': middleRooms,
        'rightOneCol': leftRooms,
        'rightTwoCol': leftRooms,
        'createOptions': createMenu,
        'thiefLevels': [],
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

    trunkNow = timezone.now().replace(microsecond=0)
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

    permission = None
    roomMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)
    throneMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Name='Throne')

    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=roomMd.Level)
    cost = upgradeMd.Stone_Basic
    duration = upgradeMd.Period_Basic
    if roomMd.UpgradeType == 'advanced': 
        cost = upgradeMd.Stone_Advanced
        duration = upgradeMd.Period_Advanced
    if roomMd.UpgradeType == 'unique': 
        cost = upgradeMd.Stone_Unique
        duration = upgradeMd.Period_Unique

    if guildMd.VaultStone < cost:
        permission = 'Stone reserves are insufficient'

    if roomMd.Name == 'Throne' and roomMd.Level == guildMd.CampaignWorld:
        permission = f"Progress to Campaign World {guildMd.CampaignWorld +1}"

    if roomMd.Name != 'Throne' and roomMd.Level == throneMd.Level:
        permission = f"Upgrade the Throne to {throneMd.Level +1}"

    resultDx = {
        'name': roomMd.Name,
        'cost': cost,
        'duration': duration,
        'infoDx': GetUpgradeInfo(roomMd.UpgradeType, roomMd.Name, roomMd.Level),
        'permission': permission,
    }
    return resultDx





def CastleFinalize(placement, guildMd):

    roomMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Placement=placement)

    if roomMd.Status == 'Upgrading':
        roomMd.Level += 1


    # update room status regardless of finalize type

    roomMd.Status = 'Ready'
    roomMd.save()


