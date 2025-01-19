"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE RESOURCE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random, datetime, pytz
import pandas as PD
from django.utils import timezone

import app_proj.notebooks as NT
import emporium.models as EM 
import emporium.logic.guild as GD
import emporium.logic.character_names as CN
import engine.models as GM 


def GetThiefList(guildMd):

    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    thiefLs = []

    for md in thiefMds:

        totalSkill = GetTotalSkill(md)
        totalCombat = GetTotalCombat(md)

        thiefDx = md.__dict__
        thiefLs.append(thiefDx)

        # thief stats

        thiefDx['DisplayDamage'] = f"<{thiefDx['Damage']}>"
        thiefDx['GuildIcon'] = f"class-{thiefDx['Class'].lower()}-s{thiefDx['Stars']}"
        thiefDx['StageIcon'] = f"thief-{thiefDx['Class'].lower()}"
        thiefDx['ExpNextLevel'] = GD.GetNextLevelXp(thiefDx['Level'])

        thiefDx['TotalSkill'] = totalSkill
        thiefDx['TotalCombat'] = totalCombat

        cooldown = None
        if thiefDx['CooldownExpire']:
            trunkNow = TimezoneToday(withTime=True)
            cooldown = thiefDx['CooldownExpire'] - trunkNow

        thiefDx['Cooldown'] = cooldown

        # equipment info

        thiefItems = GM.ItemInGuild.objects.filter(ThiefFK=md).values()
        thiefDx['ItemCount'] = len(thiefItems)
        slots = ['weapon', 'armor', 'head', 'hands', 'feet', 'back']

        for sl in slots:
            itemCheck = [x for x in thiefItems if x['Slot']==sl]

            if itemCheck:
                item = itemCheck[0]
                res = item.pop('GuildFK_id')
                res = item.pop('ThiefFK_id')
                code, bonusLs, magicLs = GetDisplayInfo(item)
                item['iconCode'] = code
                item['bonusLs'] = bonusLs 
                item['magicLs'] = magicLs 
            else:
                item = {}
                item['id'] = -1
                item['iconCode'] = f"{sl}-empty"
                item['bonusLs'] = [] 
                item['magicLs'] = [] 

            thiefDx[sl] = item

        # advances

        advances = []

        if thiefDx['TrainedAgi'] > 0: advances.append(f"Agi +{thiefDx['TrainedAgi']}")
        if thiefDx['TrainedCun'] > 0: advances.append(f"Cun +{thiefDx['TrainedCun']}")
        if thiefDx['TrainedMig'] > 0: advances.append(f"Mig +{thiefDx['TrainedMig']}")
        if thiefDx['TrainedEnd'] > 0: advances.append(f"End +{thiefDx['TrainedEnd']}")

        if 'att 2' in thiefDx['TrainedSkills']: advances.append('Att +2')
        if 'dmg 2' in thiefDx['TrainedSkills']: advances.append('Dmg +2')
        if 'def 2' in thiefDx['TrainedSkills']: advances.append('Def +2')
        if 'sab 4' in thiefDx['TrainedSkills']: advances.append('Sab +4')
        if 'per 4' in thiefDx['TrainedSkills']: advances.append('Per +4')
        if 'tra 4' in thiefDx['TrainedSkills']: advances.append('Tra +4')

        thiefDx['advances'] = advances

        # create sorting columns since datagrid can only sort by 1 column

        majorSort = 'C'
        if thiefDx['Class'] == 'Scoundrel': majorSort = 'B'
        if thiefDx['Class'] == 'Ruffian': majorSort = 'A'
        thiefDx['sorting'] = f"{majorSort}-{str(thiefDx['Power']).zfill(4)}"

    thiefDf = PD.DataFrame(thiefLs)
    thiefDf = thiefDf.drop(['_state', 'GuildFK_id', 'BasePower', 'CooldownExpire',
                            'BaseAgi', 'BaseCun', 'BaseMig', 'BaseEnd', 
                            'TrainedAgi', 'TrainedCun', 'TrainedMig', 'TrainedEnd', ], 
                            axis=1, errors='ignore')
    thiefDf = thiefDf.sort_values(by=['sorting'], ascending=[False])
    thiefLs = NT.DataframeToDicts(thiefDf)

    return thiefLs

def GetAssetList(guildMd):

    assetMds = GM.ItemInGuild.objects.filter(GuildFK=guildMd)
    assetLs = list(assetMds.values())

    for st in assetLs:
        code, bonusLs, magicLs = GetDisplayInfo(st)
        st['iconCode'] = code
        st['bonusLs'] = bonusLs
        st['magicLs'] = magicLs
        st['StoreCost'] = st['Power'] * GD.POWER_FACTOR

        claimant = None
        if st['ThiefFK_id']:
            thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=st['ThiefFK_id'])
            claimant = thiefMd.Name
        st['equippedThief'] = claimant

    assetDf = PD.DataFrame(assetLs)
    assetDf = assetDf.drop(['GuildFK_id', ], axis=1, errors='ignore')
    assetDf = assetDf.sort_values('Power', ascending=False)
    assetLs = NT.DataframeToDicts(assetDf)

    return assetLs

def GetDisplayInfo(itemDx):
    # subroutine for GetThiefList, GetAssetList

    if itemDx['Slot'] in ['weapon', 'armor', 'back']: stat = itemDx['Trait'][:3]
    else:     stat = 'skl' if itemDx['Skill'] else 'cmb'
    iconCode = f"{itemDx['Slot']}-{stat}-m{itemDx['MagicLv']}"

    bonusLs = []
    if itemDx['Trait']:
        statLs = itemDx['Trait'].split(' ')
        bonusLs.append(f"{statLs[0].title()} +{statLs[1]}")
    if itemDx['Skill']:
        statLs = itemDx['Skill'].split(' ')
        bonusLs.append(f"{statLs[0].title()} +{statLs[1]}")
    if itemDx['Combat']:
        statLs = itemDx['Combat'].split(' ')
        bonusLs.append(f"{statLs[0].title()} +{statLs[1]}")

    magicLs = []
    if itemDx['Magic']:
        statLs = itemDx['Magic'].split(' ')
        magicLs.append(f"{statLs[0].title()} +{statLs[1]}")

    return iconCode, bonusLs, magicLs

def GetTotalSkill(thiefMd):

    itemLs = [
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='weapon'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='armor'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='head'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='hands'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='feet'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='back'),
    ]

    total = 0

    for tm in itemLs:
        if tm:
            if tm.Skill:
                total += int(tm.Skill.split(' ')[1])
            if tm.Magic:
                for mg in tm.Magic:
                    if 'sab' in mg or 'per' in mg or 'tra' in mg:
                        total += int(mg.split(' ')[1])

    for tr in thiefMd.TrainedSkills:
        if 'sab' in tr or 'per' in tr or 'tra' in tr:
            total += int(tr.split(' ')[1])

    return total

def GetTotalCombat(thiefMd):

    itemLs = [
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='weapon'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='armor'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='head'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='hands'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='feet'),
        GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='back'),
    ]

    total = 0

    for tm in itemLs:
        if tm:
            if tm.Combat:
                total += int(tm.Combat.split(' ')[1])
            if tm.Magic:
                for mg in tm.Magic:
                    if 'att' in mg or 'dmg' in mg or 'def' in mg:
                        total += int(mg.split(' ')[1])

    for tr in thiefMd.TrainedSkills:
        if 'att' in tr or 'dmg' in tr or 'def' in tr:
            total += int(tr.split(' ')[1])

    return total

def GetBlueprints(userMd):

    # get thieves

    unlockThief = EM.UnlockableThief.objects.filter(Stars__gt=1).values()
    for th in unlockThief:
        th['Name'] = th['Class']
        th['IconCode'] = f"class-{th['Class'].lower()}-s{th['Stars']}"
        th['Power'] = th['StoreCost'] / GD.POWER_FACTOR
        checkUnlock = GM.ThiefUnlocked.objects.GetOrNone(UserFK=userMd, ThiefFK__ResourceId=th['ResourceId'])
        th['Unlocked'] = True if checkUnlock else False

    # get items

    def GetItemBlueprints(level):
        unlockItem = EM.UnlockableItem.objects.filter(UnlockLevel=level, MagicLv__gt=0).values()
        for rs in unlockItem:
            if rs['Slot'] in ['weapon', 'armor', 'back']: stat = rs['Trait'][:3]
            else:     stat = 'skl' if rs['Skill'] else 'cmb'
            rs['IconCode'] = f"{rs['Slot']}-{stat}-m{rs['MagicLv']}"
            rs['Power'] = rs['StoreCost'] / GD.POWER_FACTOR
            checkUnlock = GM.ItemUnlocked.objects.GetOrNone(UserFK=userMd, ItemFK__ResourceId=rs['ResourceId'])
            rs['Unlocked'] = True if checkUnlock else False
            rs['Magic'] = rs['Magic'].title().replace(' ', ' +')
        return unlockItem

    # return

    return {
        'thieves': unlockThief,
        'itemsW2': GetItemBlueprints(2),
        'itemsW3': GetItemBlueprints(3),
        'itemsW4': [],
        'itemsW5': [],
    }

def TimezoneToday(withTime=False):
    currDt = timezone.now().replace(microsecond=0)
    userTz = pytz.timezone('America/New_York')
    currDt = currDt.astimezone(userTz)
    if not withTime:
        currDt = currDt.date()
    return currDt


def GetTotalPower(guildMd):
    thiefOb = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    power = 0
    for th in thiefOb:
        power += th.Power
    return power

def GetThiefCount(guildMd):
    thiefLs = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    return len(thiefLs)

def GetThiefMax(guildMd):

    hallMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Name='Great Hall')
    abilityMd = EM.UniqueRoom.objects.GetOrNone(Level=hallMd.Level)
    count = abilityMd.Hall_MaxThieves

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Dormitory', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.BasicRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Dorm_MaxThieves

    return count

def GetItemCount(guildMd):
    itemLs = GM.ItemInGuild.objects.filter(GuildFK=guildMd)
    return len(itemLs)

def GetThroneLevel(guildMd):
    throneMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Name='Throne')
    return throneMd.Level

def GetGoldMax(guildMd):

    throneMd = EM.UniqueRoom.objects.GetOrNone(Level=GetThroneLevel(guildMd))
    count = throneMd.Throne_Gold

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Bank', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.BasicRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Bank_Gold

    return count

def GetStoneMax(guildMd):

    throneMd = EM.UniqueRoom.objects.GetOrNone(Level=GetThroneLevel(guildMd))
    count = throneMd.Throne_Stone

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Warehouse', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.BasicRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Warehouse_Stone

    return count

def GetRoomCount(guildMd):
    room1 = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Placement__contains='R')
    room2 = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Placement__contains='L')
    return len(room1) + len(room2)

def GetRoomMax(guildMd):
    throneMd = EM.UniqueRoom.objects.GetOrNone(Level=GetThroneLevel(guildMd))
    return throneMd.MaxRoomCount

def GetExpeditionCount(guildMd):

    hallMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Name='Great Hall')
    abilityMd = EM.UniqueRoom.objects.GetOrNone(Level=hallMd.Level)
    count = 3 #abilityMd.Hall_Expedition

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Cartographer', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.BasicRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Cartog_Slots

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Jeweler', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.AdvancedRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Jeweler_ExpedSlots

    return count

def GetMagicStoreCount(guildMd):

    hallMd = GM.RoomInGuild.objects.GetOrNone(GuildFK=guildMd, Name='Great Hall')
    abilityMd = EM.UniqueRoom.objects.GetOrNone(Level=hallMd.Level)
    count = abilityMd.Hall_MagicStore

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Fence', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.BasicRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Fence_MagicSlots
    return count

def GetRecoveryTime(guildMd):
    count = PD.Timedelta(0).to_pytimedelta()

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Dormitory', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.BasicRoom.objects.GetOrNone(Level=rm.Level)
        count += PD.Timedelta(roomLookup.Dorm_Recovery).to_pytimedelta() 

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Cartographer', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.BasicRoom.objects.GetOrNone(Level=rm.Level)
        count += PD.Timedelta(roomLookup.Cartog_Recovery).to_pytimedelta() 

    return count

def GetGoldBonus(guildMd):
    count = 0
    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Fence', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.AdvancedRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Fence_GoldBonus
    return count

def GetStoneBonus(guildMd):
    count = 0
    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Workshop', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.AdvancedRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Workshop_StoneBonus
    return count

def GetGemsBonus(guildMd):
    count = 0
    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Jeweler', Level__gte=1)
    for rm in roomLs:
        roomLookup = EM.AdvancedRoom.objects.GetOrNone(Level=rm.Level)
        count += roomLookup.Jeweler_GemBonus
    return count


def GrantExperience(thiefMd, amount):
    levelMd = EM.ThiefLevel.objects.GetOrNone(Level=thiefMd.Level+1)
    maxExp = levelMd.Experience
    newXp = thiefMd.Experience + amount
    if newXp > maxExp: newXp = maxExp
    thiefMd.Experience = newXp
    thiefMd.save()

def GrantGold(guildMd, amount):
    maxAmount = GetGoldMax(guildMd)
    newAmount = guildMd.VaultGold + amount
    if newAmount > maxAmount: newAmount = maxAmount
    guildMd.VaultGold = newAmount
    guildMd.save()

def GrantStone(guildMd, amount):
    maxAmount = GetStoneMax(guildMd)
    newAmount = guildMd.VaultStone + amount
    if newAmount > maxAmount: newAmount = maxAmount
    guildMd.VaultStone = newAmount
    guildMd.save()

def GrantGems(guildMd, amount):
    # maxAmount = guildMd.StorageGems
    newAmount = guildMd.VaultGems + amount
    # if newAmount > maxAmount: newAmount = maxAmount
    guildMd.VaultGems = newAmount
    guildMd.save()

def ApplyWounds(thiefMd, wounds):

    ratio = round(wounds / thiefMd.Health, 3)
    status = 'Ready'
    cooldown = None

    if ratio >= .500 and ratio <= .999:
        status = 'Wounded'
        cooldown = EM.ThiefLevel.objects.GetOrNone(Level=thiefMd.Level).WoundPeriod

    elif ratio >= 1.000:
        status = 'Knocked Out'
        cooldown = EM.ThiefLevel.objects.GetOrNone(Level=thiefMd.Level).KnockedOutPeriod

    if cooldown:
        trunkNow = TimezoneToday(withTime=True)
        expireTm = PD.Timedelta(cooldown).to_pytimedelta()
        thiefMd.CooldownExpire = trunkNow + expireTm

    thiefMd.Status = status
    thiefMd.save()

    return status, cooldown

def ResetInjuryCooldowns(guildMd):

    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    thiefLs = []

    for md in thiefMds:

        trunkNow = TimezoneToday(withTime=True)

        if md.CooldownExpire and md.Status in ['Wounded', 'Knocked Out']:
            if trunkNow >= md.CooldownExpire:
                md.Status = 'Ready'
                md.CooldownExpire = None
                md.save()


def PrepGuild(userMd):

    currDt = TimezoneToday()
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if guildMd and guildMd.LastPlayed != currDt:
        guildMd.LastPlayed = currDt
        guildMd.save()

    return guildMd

def GetItemTrait(itemMd, trait):
    if not itemMd: return 0

    if itemMd.Trait and trait in itemMd.Trait:
        total = int(itemMd.Trait.split(' ')[1])
    else:
        total = 0

    if itemMd.Magic and trait in itemMd.Magic:
        total += int(itemMd.Magic.split(' ')[1])
    return total

def GetItemCombat(itemMd, stat):
    if not itemMd: return 0

    if itemMd.Combat and stat in itemMd.Combat:
        total = int(itemMd.Combat.split(' ')[1])
    else:
        total = 0

    if itemMd.Magic and stat in itemMd.Magic:
        total += int(itemMd.Magic.split(' ')[1])
    return total

def GetItemSkill(itemMd, skill):
    if not itemMd: return 0

    if itemMd.Skill and skill in itemMd.Skill:
        total = int(itemMd.Skill.split(' ')[1])
    else:
        total = 0

    if itemMd.Magic and skill in itemMd.Magic:
        total += int(itemMd.Magic.split(' ')[1])
    return total

def GetTrainedSkill(thiefMd, skill):
    for sk in thiefMd.TrainedSkills:
        if skill in sk:
            return int(sk.split(' ')[1])
    return 0

def SetThiefTotals(thiefMd):

    weapon = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='weapon')
    armor = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='armor')
    head = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='head')
    hands = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='hands')
    feet = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='feet')
    back = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='back')

    # traits are foundation of combat stats

    thiefMd.Agility = (thiefMd.BaseAgi + thiefMd.TrainedAgi + 
                    GetItemTrait(weapon, 'agi') + GetItemTrait(armor, 'agi') +
                    GetItemTrait(head, 'agi') + GetItemTrait(hands, 'agi') + 
                    GetItemTrait(feet, 'agi') + GetItemTrait(back, 'agi') )
    thiefMd.Cunning = (thiefMd.BaseCun + thiefMd.TrainedCun + 
                    GetItemTrait(weapon, 'cun') + GetItemTrait(armor, 'cun') +
                    GetItemTrait(head, 'cun') + GetItemTrait(hands, 'cun') + 
                    GetItemTrait(feet, 'cun') + GetItemTrait(back, 'cun') )
    thiefMd.Might = (thiefMd.BaseMig + thiefMd.TrainedMig +
                    GetItemTrait(weapon, 'mig') + GetItemTrait(armor, 'mig') +
                    GetItemTrait(head, 'mig') + GetItemTrait(hands, 'mig') + 
                    GetItemTrait(feet, 'mig') + GetItemTrait(back, 'mig') )
    thiefMd.Endurance = (thiefMd.BaseEnd + thiefMd.TrainedEnd +
                    GetItemTrait(weapon, 'end') + GetItemTrait(armor, 'end') +
                    GetItemTrait(head, 'end') + GetItemTrait(hands, 'end') + 
                    GetItemTrait(feet, 'end') + GetItemTrait(back, 'end') )

    # set combat

    thiefMd.Health = 75 + thiefMd.Endurance * 5

    thiefMd.Attack = (thiefMd.Agility + GetTrainedSkill(thiefMd, 'att') + 
                    GetItemCombat(weapon, 'att') + GetItemCombat(armor, 'att') +
                    GetItemCombat(head, 'att') + GetItemCombat(hands, 'att') + 
                    GetItemCombat(feet, 'att') + GetItemCombat(back, 'att') )
    thiefMd.Damage = (6 + thiefMd.Cunning + GetTrainedSkill(thiefMd, 'dmg') + 
                    GetItemCombat(weapon, 'dmg') + GetItemCombat(armor, 'dmg') +
                    GetItemCombat(head, 'dmg') + GetItemCombat(hands, 'dmg') + 
                    GetItemCombat(feet, 'dmg') + GetItemCombat(back, 'dmg') )
    thiefMd.Defense = (11 + thiefMd.Might + GetTrainedSkill(thiefMd, 'def') + 
                    GetItemCombat(weapon, 'def') + GetItemCombat(armor, 'def') +
                    GetItemCombat(head, 'def') + GetItemCombat(hands, 'def') + 
                    GetItemCombat(feet, 'def') + GetItemCombat(back, 'def') )

    # set skills

    thiefMd.Sabotage = (GetTrainedSkill(thiefMd, 'sab') +
                    GetItemSkill(weapon, 'sab') + GetItemSkill(armor, 'sab') +
                    GetItemSkill(head, 'sab') + GetItemSkill(hands, 'sab') + 
                    GetItemSkill(feet, 'sab') + GetItemSkill(back, 'sab') )
    thiefMd.Perceive = (GetTrainedSkill(thiefMd, 'per') +
                    GetItemSkill(weapon, 'per') + GetItemSkill(armor, 'per') +
                    GetItemSkill(head, 'per') + GetItemSkill(hands, 'per') + 
                    GetItemSkill(feet, 'per') + GetItemSkill(back, 'per') )
    thiefMd.Traverse = (GetTrainedSkill(thiefMd, 'tra') +
                    GetItemSkill(weapon, 'tra') + GetItemSkill(armor, 'tra') +
                    GetItemSkill(head, 'tra') + GetItemSkill(hands, 'tra') + 
                    GetItemSkill(feet, 'tra') + GetItemSkill(back, 'tra') )

    # set power

    levelMd = EM.ThiefLevel.objects.GetOrNone(Level=thiefMd.Level)

    thiefMd.Power = thiefMd.PowerBase
    thiefMd.Power += levelMd.Power
    thiefMd.Power += weapon.Power if weapon else 0
    thiefMd.Power += armor.Power if armor else 0 
    thiefMd.Power += head.Power if head else 0
    thiefMd.Power += hands.Power if hands else 0
    thiefMd.Power += feet.Power if feet else 0
    thiefMd.Power += back.Power if back else 0

    thiefMd.save()


def CreateNewGuild(user, guildName):

    # create and select guild object

    newGuild = GM.Guild(**{
        'UserFK': user,
        'Name': guildName,
        'LastPlayed': TimezoneToday(),
        'CreateDate': TimezoneToday(),
        'Selected': True,
    })
    newGuild.save()

    # starting thieves

    newThief = AppendStartingThief(newGuild, 'Burglar', 1)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Scoundrel', 1)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Ruffian', 1)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Burglar', 1)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Scoundrel', 1)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Ruffian', 1)
    AttachStartingWargear(newThief)

    thiefOb = GM.ThiefInGuild.objects.filter(GuildFK=newGuild)
    for th in thiefOb:
        SetThiefTotals(th)

    # starting accessories

    StartingAccessories(newGuild)

    # starting rooms

    roomMds = EM.CastleRoom.objects.filter(UpgradeType='unique')

    for rm in roomMds:
        roomDx = {
            'GuildFK': newGuild,
            'Name': rm.Name,
            'UpgradeType': rm.UpgradeType,
            'Placement': rm.AllowedPlacement,
            'Description': rm.Description,
            'Level': 1, # if rm.Name != 'Keep' else 0
            'Status': 'Ready' if rm.Name != 'Keep' else 'Locked',
        }
        newRoom = GM.RoomInGuild(**roomDx)
        newRoom.save()

def GetThiefName(guildMd):
    # random name that doesn't yet appear in guild
    allNames = CN.CharacterNames()
    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    existingNameLs = [x.Name for x in thiefMds]
    availableNames = [x for x in allNames if x not in existingNameLs]
    thiefName = random.choice(availableNames)
    return thiefName

def AppendStartingThief(guildMd, thiefClass, stars):

    thiefMd = EM.UnlockableThief.objects.filter(Class=thiefClass, Stars=stars)
    thiefDx = list(thiefMd.values())[0]

    newThief ={
        'GuildFK': guildMd,
        'Name': GetThiefName(guildMd),
        'Class': thiefDx['Class'],
        'Stars': thiefDx['Stars'],
        'PowerBase': thiefDx['StoreCost'] / GD.POWER_FACTOR,
        'BaseAgi': 3 if 'agi' in thiefDx['StartTrait'] else 0,
        'BaseCun': 3 if 'cun' in thiefDx['StartTrait'] else 0,
        'BaseMig': 3 if 'mig' in thiefDx['StartTrait'] else 0,
        'BaseEnd': 0,
    }
    newModel = GM.ThiefInGuild(**newThief)
    newModel.save()
    return newModel

def AttachStartingWargear(thiefMd):

    # equip weapon

    weaponMd = EM.UnlockableItem.objects.GetOrNone(
                UnlockLevel=1, MagicLv=0, Slot='weapon', Requirement=thiefMd.Class)
    newWeapon = {
        'GuildFK': thiefMd.GuildFK,
        'ThiefFK': thiefMd,
        'Throne': weaponMd.UnlockLevel,
        'Name': weaponMd.Name,
        'MagicLv': weaponMd.MagicLv,
        'TotalLv': weaponMd.TotalLv,
        'Slot': weaponMd.Slot,
        'Power': weaponMd.StoreCost / GD.POWER_FACTOR,
        'Requirement': weaponMd.Requirement,
        'Trait': weaponMd.Trait,
        'Combat': weaponMd.Combat,
        'Skill': weaponMd.Skill,
    }
    newModel = GM.ItemInGuild(**newWeapon).save()

    # equip armor

    armorMd = EM.UnlockableItem.objects.GetOrNone(
                UnlockLevel=1, MagicLv=0, Slot='armor', Requirement=thiefMd.Class)
    newArmor = {
        'GuildFK': thiefMd.GuildFK,
        'ThiefFK': thiefMd,
        'Throne': armorMd.UnlockLevel,
        'Name': armorMd.Name,
        'MagicLv': armorMd.MagicLv,
        'TotalLv': armorMd.TotalLv,
        'Slot': armorMd.Slot,
        'Power': armorMd.StoreCost / GD.POWER_FACTOR,
        'Requirement': armorMd.Requirement,
        'Trait': armorMd.Trait,
        'Combat': armorMd.Combat,
        'Skill': armorMd.Skill,
    }
    newModel = GM.ItemInGuild(**newArmor).save()

def StartingAccessories(guildMd):

    slots = ['head', 'hands', 'feet']
    for sl in slots:

        accessoryDx = EM.UnlockableItem.objects.filter(UnlockLevel=1, MagicLv=0, Slot=sl).values()[0]
        newAccessory = {
            'GuildFK': guildMd,
            'ThiefFK': None,
            'Throne': accessoryDx['UnlockLevel'],
            'Name': accessoryDx['Name'],
            'MagicLv': accessoryDx['MagicLv'],
            'TotalLv': accessoryDx['TotalLv'],
            'Slot': accessoryDx['Slot'],
            'Power': accessoryDx['StoreCost'] / GD.POWER_FACTOR,
            'Skill': accessoryDx['Skill'],
            'Combat': accessoryDx['Combat'],
        }
        newModel = GM.ItemInGuild(**newAccessory).save()

        accessoryDx = EM.UnlockableItem.objects.filter(UnlockLevel=1, MagicLv=0, Slot=sl).values()[1]
        newAccessory = {
            'GuildFK': guildMd,
            'ThiefFK': None,
            'Throne': accessoryDx['UnlockLevel'],
            'Name': accessoryDx['Name'],
            'MagicLv': accessoryDx['MagicLv'],
            'TotalLv': accessoryDx['TotalLv'],
            'Slot': accessoryDx['Slot'],
            'Power': accessoryDx['StoreCost'] / GD.POWER_FACTOR,
            'Skill': accessoryDx['Skill'],
            'Combat': accessoryDx['Combat'],
        }
        newModel = GM.ItemInGuild(**newAccessory).save()
