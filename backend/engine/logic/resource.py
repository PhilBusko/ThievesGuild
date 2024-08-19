"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE RESOURCE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random, datetime
import pandas as PD
from django.utils import timezone

import emporium.models as EM 
import emporium.logic.guild as GD
import emporium.logic.character_names as CN
import engine.models as GM 


def GetThiefList(guildMd):

    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    thiefLs = []

    for md in thiefMds:

        thiefDx = md.__dict__
        thiefLs.append(thiefDx)

        # thief stats

        thiefDx['DisplayDamage'] = f"<{thiefDx['Damage']}>"
        thiefDx['GuildIcon'] = f"class-{thiefDx['Class'].lower()}-s{thiefDx['Stars']}"
        thiefDx['StageIcon'] = f"thief-{thiefDx['Class'].lower()}"
        thiefDx['ExpNextLevel'] = GD.GetNextLevelXp(thiefDx['Level'])

        cooldown = None
        if thiefDx['CooldownExpire']:
            trunkNow = timezone.now().replace(microsecond=0)
            cooldown = thiefDx['CooldownExpire'] - trunkNow

        thiefDx['Cooldown'] = cooldown

        # equipment info

        thiefItems = GM.ItemInGuild.objects.filter(ThiefFK=md).values()
        thiefDx['ItemCount'] = len(thiefItems)
        slots = ['weapon', 'armor', 'head', 'hands', 'feet', ]

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

    thiefDf = PD.DataFrame(thiefLs)
    thiefDf = thiefDf.drop(['_state', 'GuildFK_id', 'BasePower', 'CooldownExpire',
                            'BaseAgi', 'BaseCun', 'BaseMig', 'BaseEnd', 
                            'TrainedAgi', 'TrainedCun', 'TrainedMig', 'TrainedEnd', ], 
                            axis=1, errors='ignore')
    thiefDf = thiefDf.sort_values('Power', ascending=False)

    return thiefDf

def GetAssetList(guildMd):

    assetMds = GM.ItemInGuild.objects.filter(GuildFK=guildMd)
    assetLs = list(assetMds.values())

    for st in assetLs:
        code, bonusLs, magicLs = GetDisplayInfo(st)
        st['iconCode'] = code
        st['bonusLs'] = bonusLs
        st['magicLs'] = magicLs

        claimant = None
        if st['ThiefFK_id']:
            thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=st['ThiefFK_id'])
            claimant = thiefMd.Name
        st['equippedThief'] = claimant

    assetDf = PD.DataFrame(assetLs)
    assetDf = assetDf.drop(['GuildFK_id', ], axis=1, errors='ignore')
    assetDf = assetDf.sort_values('Power', ascending=False)

    return assetDf

def GetDisplayInfo(itemDx):
   # subroutine for GetThiefList, GetAssetList

    if itemDx['Slot'] in ['weapon', 'armor']: stat = itemDx['Trait'][:3]
    else:     stat = 'skl' if itemDx['Skill'] else 'cmb'
    iconCode = f"{itemDx['Slot']}-{stat}-m{itemDx['TotalLv'] - itemDx['Level']}"

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

def GetBlueprints(guildMd):

    # get thieves

    unlockThief = EM.UnlockableThief.objects.filter(Stars__gt=1).values()
    for th in unlockThief:
        th['Name'] = th['Class']
        th['IconCode'] = f"class-{th['Class'].lower()}-s{th['Stars']}"
        th['Power'] = th['StoreCost'] / GD.POWER_FACTOR
        checkUnlock = GM.ThiefUnlocked.objects.GetOrNone(GuildFK=guildMd, ThiefFK__ResourceId=th['ResourceId'])
        th['Unlocked'] = True if checkUnlock else False

    # get items

    def GetItemBlueprints(level):
        unlockItem = EM.UnlockableItem.objects.filter(Level=level, MagicLv__gt=0).values()
        for rs in unlockItem:
            if rs['Slot'] in ['weapon', 'armor']: stat = rs['Trait'][:3]
            else:     stat = 'skl' if rs['Skill'] else 'cmb'
            rs['IconCode'] = f"{rs['Slot']}-{stat}-m{rs['TotalLv'] - rs['Level']}"
            rs['Power'] = rs['StoreCost'] / GD.POWER_FACTOR
            checkUnlock = GM.ItemUnlocked.objects.GetOrNone(GuildFK=guildMd, ItemFK__ResourceId=rs['ResourceId'])
            rs['Unlocked'] = True if checkUnlock else False
        return unlockItem

    # return

    return {
        'thieves': unlockThief,
        'itemsW2': GetItemBlueprints(2),
        'itemsW3': GetItemBlueprints(3),
        'itemsW4': [],
    }


def GrantExperience(thiefMd, amount):
    levelMd = EM.ThiefLevel.objects.GetOrNone(Level=thiefMd.Level+1)
    maxExp = levelMd.Experience
    newXp = thiefMd.Experience + amount
    if newXp > maxExp: newXp = maxExp
    thiefMd.Experience = newXp
    thiefMd.save()

def GrantGold(guildMd, amount):
    maxAmount = guildMd.StorageGold
    newAmount = guildMd.VaultGold + amount
    if newAmount > maxAmount: newAmount = maxAmount
    guildMd.VaultGold = newAmount
    guildMd.save()

def GrantGems(guildMd, amount):
    # maxAmount = guildMd.StorageGems
    newAmount = guildMd.VaultGems + amount
    # if newAmount > maxAmount: newAmount = maxAmount
    guildMd.VaultGems = newAmount
    guildMd.save()

def GrantWood(guildMd, amount):
    maxAmount = guildMd.StorageWood
    newAmount = guildMd.VaultWood + amount
    if newAmount > maxAmount: newAmount = maxAmount
    guildMd.VaultWood = newAmount
    guildMd.save()

def GrantStone(guildMd, amount):
    maxAmount = guildMd.StorageStone
    newAmount = guildMd.VaultStone + amount
    if newAmount > maxAmount: newAmount = maxAmount
    guildMd.VaultStone = newAmount
    guildMd.save()

def GrantIron(guildMd, amount):
    maxAmount = guildMd.StorageIron
    newAmount = guildMd.VaultIron + amount
    if newAmount > maxAmount: newAmount = maxAmount
    guildMd.VaultIron = newAmount
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

        trunkNow = timezone.now()
        trunkNow = trunkNow.replace(microsecond=0)
        expireTm = PD.Timedelta(cooldown).to_pytimedelta()

        thiefMd.Status = status
        thiefMd.CooldownExpire = trunkNow + expireTm
        thiefMd.save()

    return status, cooldown

def ResetInjuryCooldowns(guildMd):

    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    thiefLs = []

    for md in thiefMds:

        trunkNow = timezone.now().replace(microsecond=0)

        if md.CooldownExpire and md.Status in ['Wounded', 'Knocked Out']:
            if trunkNow >= md.CooldownExpire:
                md.Status = 'Ready'
                md.CooldownExpire = None
                md.save()


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

def SetThiefTotals(thiefMd):

    weapon = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='weapon')
    armor = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='armor')
    head = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='head')
    hands = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='hands')
    feet = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot='feet')

    # traits are foundation of combat stats

    thiefMd.Agility = (thiefMd.BaseAgi + thiefMd.TrainedAgi + 
                    GetItemTrait(weapon, 'agi') + GetItemTrait(armor, 'agi') +
                    GetItemTrait(head, 'agi') + GetItemTrait(hands, 'agi') + GetItemTrait(feet, 'agi'))
    thiefMd.Cunning = (thiefMd.BaseCun + thiefMd.TrainedCun + 
                    GetItemTrait(weapon, 'cun') + GetItemTrait(armor, 'cun') +
                    GetItemTrait(head, 'cun') + GetItemTrait(hands, 'cun') + GetItemTrait(feet, 'cun'))
    thiefMd.Might = (thiefMd.BaseMig + thiefMd.TrainedMig +
                    GetItemTrait(weapon, 'mig') + GetItemTrait(armor, 'mig') +
                    GetItemTrait(head, 'mig') + GetItemTrait(hands, 'mig') + GetItemTrait(feet, 'mig'))
    thiefMd.Endurance = (thiefMd.BaseEnd + thiefMd.TrainedEnd +
                    GetItemTrait(weapon, 'end') + GetItemTrait(armor, 'end') +
                    GetItemTrait(head, 'end') + GetItemTrait(hands, 'end') + GetItemTrait(feet, 'end'))

    thiefMd.Power = thiefMd.BasePower
    # thiefMd.Power += levelsPower
    thiefMd.Power += weapon.Power if weapon else 0
    thiefMd.Power += armor.Power if armor else 0 
    thiefMd.Power += head.Power if head else 0
    thiefMd.Power += hands.Power if hands else 0
    thiefMd.Power += feet.Power if feet else 0

    # set combat 

    thiefMd.Health = 58 + thiefMd.Endurance * 4

    thiefMd.Attack = (thiefMd.Agility + GetItemCombat(weapon, 'att') + GetItemCombat(armor, 'att') +
                    GetItemCombat(head, 'att') + GetItemCombat(hands, 'att') + GetItemCombat(feet, 'att'))
    thiefMd.Damage = (6 + thiefMd.Cunning + GetItemCombat(weapon, 'dmg') + GetItemCombat(armor, 'dmg') +
                    GetItemCombat(head, 'dmg') + GetItemCombat(hands, 'dmg') + GetItemCombat(feet, 'dmg'))
    thiefMd.Defense = (11 + thiefMd.Might + GetItemCombat(weapon, 'def') + GetItemCombat(armor, 'def') +
                    GetItemCombat(head, 'def') + GetItemCombat(hands, 'def') + GetItemCombat(feet, 'def'))

    # set skills 

    thiefMd.Sabotage = (GetItemSkill(weapon, 'sab') + GetItemSkill(armor, 'sab') +
                    GetItemSkill(head, 'sab') + GetItemSkill(hands, 'sab') + GetItemSkill(feet, 'sab'))
    thiefMd.Perceive = (GetItemSkill(weapon, 'per') + GetItemSkill(armor, 'per') +
                    GetItemSkill(head, 'per') + GetItemSkill(hands, 'per') + GetItemSkill(feet, 'per'))
    thiefMd.Traverse = (GetItemSkill(weapon, 'tra') + GetItemSkill(armor, 'tra') +
                    GetItemSkill(head, 'tra') + GetItemSkill(hands, 'tra') + GetItemSkill(feet, 'tra'))

    thiefMd.save()

def SetGuildTotals(guildMd):

    thiefOb = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    power = 0
    for th in thiefOb:
        power += th.Power

    throneMd = EM.ThroneUpgrades.objects.GetOrNone(Level=guildMd.ThroneLevel)
    
    maxGold = throneMd.GoldStorage +2000
    maxWood = throneMd.WoodStorage
    maxStone = throneMd.StoneStorage
    maxIron = throneMd.IronStorage

    guildMd.StorageGold = maxGold
    guildMd.StorageWood = maxWood
    guildMd.StorageStone = maxStone
    guildMd.StorageIron = maxIron
    guildMd.TotalPower = power
    guildMd.save()

def GetExpeditionCount(guildMd):
    return 3

def GetDailyStoreCount(guildMd):
    return 4


def CreateNewGuild(user, guildName):

    newGuild = GM.Guild(**{'UserFK': user, 'Name': guildName, 'Selected': True})
    newGuild.save()

    thiefNames = CN.CharacterNames()
    newThief = AppendStartingThief(newGuild, 'Burglar', 1, thiefNames)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Scoundrel', 1, thiefNames)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Ruffian', 1, thiefNames)
    AttachStartingWargear(newThief)
    # newThief = AppendStartingThief(newGuild, 'Burglar', 1, thiefNames)
    # AttachStartingWargear(newThief)
    # newThief = AppendStartingThief(newGuild, 'Scoundrel', 1, thiefNames)
    # AttachStartingWargear(newThief)
    # newThief = AppendStartingThief(newGuild, 'Ruffian', 1, thiefNames)
    # AttachStartingWargear(newThief)

    StartingAccessories(newGuild)

    thiefOb = GM.ThiefInGuild.objects.filter(GuildFK=newGuild)
    for th in thiefOb:
        SetThiefTotals(th)
    SetGuildTotals(newGuild)

    return newGuild

def GetThiefName(guildMd):
    # random name that doesn't yet appear in guild
    allNames = CN.CharacterNames()
    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    existingNameLs = [x.Name for x in thiefMds]
    availableNames = [x for x in allNames if x not in existingNameLs]
    thiefName = random.choice(availableNames)
    return thiefName
    
def AppendStartingThief(guildMd, thiefClass, stars, allNames):

    thiefMd = EM.UnlockableThief.objects.filter(Class=thiefClass, Stars=stars)
    thiefDx = list(thiefMd.values())[0]

    # random name that doesn't yet appear in guild
    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    existingNameLs = [x.Name for x in thiefMds]
    availableNames = [x for x in allNames if x not in existingNameLs]
    thiefName = random.choice(availableNames)

    newThief ={
        'GuildFK': guildMd,
        'Name': thiefName,
        'Class': thiefDx['Class'],
        'Stars': thiefDx['Stars'],
        'BasePower': thiefDx['StoreCost'] / GD.POWER_FACTOR,
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

    weaponDx = EM.UnlockableItem.objects.filter(
                Level=1, Slot='weapon', Requirement=thiefMd.Class).values()[0]
    newWeapon = {
        'GuildFK': thiefMd.GuildFK,
        'ThiefFK': thiefMd,
        'Name': weaponDx['Name'],
        'Level': weaponDx['Level'],
        'TotalLv': weaponDx['TotalLv'],
        'Slot': weaponDx['Slot'],
        'Power': weaponDx['StoreCost'] / GD.POWER_FACTOR,
        'Requirement': weaponDx['Requirement'],
        'Trait': weaponDx['Trait'],
        'Combat': weaponDx['Combat'],
        'Skill': weaponDx['Skill'],
    }
    newModel = GM.ItemInGuild(**newWeapon).save()

    # equip armor

    armorDx = EM.UnlockableItem.objects.filter(
                Level=1, Slot='armor', Requirement=thiefMd.Class).values()[0]
    newArmor = {
        'GuildFK': thiefMd.GuildFK,
        'ThiefFK': thiefMd,
        'Name': armorDx['Name'],
        'Level': armorDx['Level'],
        'TotalLv': armorDx['TotalLv'],
        'Slot': armorDx['Slot'],
        'Power': armorDx['StoreCost'] / GD.POWER_FACTOR,
        'Requirement': armorDx['Requirement'],
        'Trait': armorDx['Trait'],
        'Combat': armorDx['Combat'],
        'Skill': armorDx['Skill'],
    }
    newModel = GM.ItemInGuild(**newArmor).save()

def StartingAccessories(guildMd):

    slots = ['head', 'hands', 'feet']
    for sl in slots:

        accessoryDx = EM.UnlockableItem.objects.filter(Level=1, Slot=sl).values()[0]
        newAccessory = {
            'GuildFK': guildMd,
            'ThiefFK': None,
            'Name': accessoryDx['Name'],
            'Level': accessoryDx['Level'],
            'TotalLv': accessoryDx['TotalLv'],
            'Slot': accessoryDx['Slot'],
            'Power': accessoryDx['StoreCost'] / GD.POWER_FACTOR,
            'Skill': accessoryDx['Skill'],
            'Combat': accessoryDx['Combat'],
        }
        newModel = GM.ItemInGuild(**newAccessory).save()

        accessoryDx = EM.UnlockableItem.objects.filter(Level=1, Slot=sl).values()[1]
        newAccessory = {
            'GuildFK': guildMd,
            'ThiefFK': None,
            'Name': accessoryDx['Name'],
            'Level': accessoryDx['Level'],
            'TotalLv': accessoryDx['TotalLv'],
            'Slot': accessoryDx['Slot'],
            'Power': accessoryDx['StoreCost'] / GD.POWER_FACTOR,
            'Skill': accessoryDx['Skill'],
            'Combat': accessoryDx['Combat'],
        }
        newModel = GM.ItemInGuild(**newAccessory).save()

