"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE CASTLE ROOMS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import pandas as PD
from django.utils import timezone

import emporium.models as EM 
import emporium.logic.guild as GD

import engine.models as GM 
import engine.logic.resource as RS



def GetInfo(roomName, roomLevel):

    basicMd = EM.BasicRoom.objects.GetOrNone(Level=roomLevel)
    advancedMd = EM.AdvancedRoom.objects.GetOrNone(Level=roomLevel)

    if roomName == 'Bank':
        infoDx = {'Gold Storage': basicMd.Bank_Gold, }

    if roomName == 'Warehouse':
        infoDx = {'Stone Storage': basicMd.Warehouse_Stone, }

    if roomName == 'Scholarium':
        infoDx = {'Max Thief Level': basicMd.Scholarium_MaxLevel, }

    if roomName == 'Dormitory':
        infoDx = {
            'Max Thieves': f"+{basicMd.Dorm_MaxThieves}",
            'Rest Bonus': basicMd.Dorm_Recovery,
        }

    if roomName == 'Cartographer':
        infoDx = {
            'Expedition Slots': basicMd.Cartog_Slots,
            'Rest Bonus': basicMd.Cartog_Recovery,
        }

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

        if rm['Name'] == 'Throne':
            throneMd = EM.ThroneRoom.objects.GetOrNone(Level=guildMd.ThroneLevel)
            rm['infoDx'] = {
                'Max Thieves': throneMd.MaxThieves,
                'Max Rooms': throneMd.MaxRoomCount,
                'Max Room Level': throneMd.MaxRoomLevel,
                'Gold Storage': throneMd.Throne_Gold,
                'Stone Storage': throneMd.Throne_Stone,
                'Magic Store Slots': throneMd.MagicSlots,
            }
            rm['buttonLs'] = ['upgrade']

        if rm['Name'] == 'Great Hall':
            rm['infoTx'] = 'No special rules'

        if rm['Name'] == 'Keep' and rm['Level'] <= 2:
            rm['infoTx'] = 'Unlock at Throne 3'




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

            basicMd = EM.BasicRoom.objects.GetOrNone(Level=1)
            advancedMd = EM.AdvancedRoom.objects.GetOrNone(Level=1)

            leftRooms.append({
                'Name': roomTrial.Name,
                'Level': roomTrial.Level,
                'Placement': placement,
                'Status': roomTrial.Status,
                'cooldown': cooldown,
                'infoDx': GetInfo(roomTrial.Name, roomTrial.Level),
                'buttonLs': ['upgrade', 'move', 'delete'],
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

    menuRoomLs = EM.CastleRoom.objects.filter(UnlockThrone__lte=guildMd.ThroneLevel, UpgradeType='basic')
    for rm in menuRoomLs:
        cost = EM.RoomUpgrade.objects.GetOrNone(Level=1).Stone_Basic
        createMenu.append({
            'name': rm.Name,
            'cost': cost,
        })

    menuRoomLs = EM.CastleRoom.objects.filter(UnlockThrone__lte=guildMd.ThroneLevel, UpgradeType='advanced')
    for rm in menuRoomLs:
        cost = EM.RoomUpgrade.objects.GetOrNone(Level=1).Stone_Advanced
        createMenu.append({
            'name': rm.Name,
            'cost': cost,
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

    permission = None

    buildRoom = EM.CastleRoom.objects.GetOrNone(Name=roomName)
    upgradeMd = EM.RoomUpgrade.objects.GetOrNone(Level=1)
    cost = upgradeMd.Stone_Basic
    if buildRoom.UpgradeType == 'advanced':
        cost = upgradeMd.Stone_Advanced
    if guildMd.VaultStone < cost:
        permission = 'Stone reserves are insufficient'

    if RS.GetRoomCount(guildMd) == RS.GetRoomMax(guildMd):
        permission = 'Max rooms built'

    resultDx = {
        'name': roomName,
        'cost': cost,
        'infoDx': GetInfo(roomName, 1),
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





