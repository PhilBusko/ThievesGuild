"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE RESOURCE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import pandas as PD
import emporium.models as EM 
import engine.models as GM 
import engine.logic.character_names as CN

POWER_FACTOR = 50


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
    newThief = AppendStartingThief(newGuild, 'Burglar', 1, thiefNames)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Scoundrel', 1, thiefNames)
    AttachStartingWargear(newThief)
    newThief = AppendStartingThief(newGuild, 'Ruffian', 1, thiefNames)
    AttachStartingWargear(newThief)

    StartingAccessories(newGuild)

    thiefOb = GM.ThiefInGuild.objects.filter(GuildFK=newGuild)
    for th in thiefOb:
        SetThiefTotals(th)
    SetGuildPower(newGuild)

    return newGuild

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
        'BasePower': thiefDx['StoreCost'] / POWER_FACTOR,
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
        'Power': weaponDx['StoreCost'] / POWER_FACTOR,
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
        'Power': armorDx['StoreCost'] / POWER_FACTOR,
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
            'Power': accessoryDx['StoreCost'] / POWER_FACTOR,
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
            'Power': accessoryDx['StoreCost'] / POWER_FACTOR,
            'Skill': accessoryDx['Skill'],
            'Combat': accessoryDx['Combat'],
        }
        newModel = GM.ItemInGuild(**newAccessory).save()


def GetItemTrait(itemMd, trait):
    if not itemMd: return 0
    if not itemMd.Trait: return 0

    if trait in itemMd.Trait:
        total = int(itemMd.Trait.split(' ')[1])
    else:
        total = 0

    if itemMd.Magic and trait in itemMd.Magic:
        total += itemMd.Magic[trait]
    return total

def GetItemCombat(itemMd, stat):
    if not itemMd: return 0
    if not itemMd.Combat: return 0

    if stat in itemMd.Combat:
        total = int(itemMd.Combat.split(' ')[1])
    else:
        total = 0

    if itemMd.Magic and stat in itemMd.Magic:
        total += itemMd.Magic[stat]
    return total

def GetItemSkill(itemMd, skill):
    if not itemMd: return 0
    if not itemMd.Skill: return 0

    if itemMd.Skill and skill in itemMd.Skill:
        total = int(itemMd.Skill.split(' ')[1])
    else:
        total = 0

    if itemMd.Magic and skill in itemMd.Magic:
        total += itemMd.Magic[skill]
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

    thiefMd.Power = thiefMd.BasePower    # levels power
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
    thiefMd.Defense = (10 + thiefMd.Might + GetItemCombat(weapon, 'def') + GetItemCombat(armor, 'def') +
                    GetItemCombat(head, 'def') + GetItemCombat(hands, 'def') + GetItemCombat(feet, 'def'))

    # set skills 

    thiefMd.Sabotage = (GetItemSkill(weapon, 'sab') + GetItemSkill(armor, 'sab') +
                    GetItemSkill(head, 'sab') + GetItemSkill(hands, 'sab') + GetItemSkill(feet, 'sab'))
    thiefMd.Perceive = (GetItemSkill(weapon, 'per') + GetItemSkill(armor, 'per') +
                    GetItemSkill(head, 'per') + GetItemSkill(hands, 'per') + GetItemSkill(feet, 'per'))
    thiefMd.Traverse = (GetItemSkill(weapon, 'tra') + GetItemSkill(armor, 'tra') +
                    GetItemSkill(head, 'tra') + GetItemSkill(hands, 'tra') + GetItemSkill(feet, 'tra'))

    thiefMd.save()

def SetGuildPower(guildMd):

    thiefOb = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    power = 0
    for th in thiefOb:
        power += th.Power

    guildMd.TotalPower = power
    guildMd.save()


def GetThiefList(guildMd):

    thiefMds = GM.ThiefInGuild.objects.filter(GuildFK=guildMd)
    thiefLs = []

    for md in thiefMds:

        thiefDx = md.__dict__
        thiefLs.append(thiefDx)
        
        thiefItems = GM.ItemInGuild.objects.filter(ThiefFK=md).values()
        thiefDx['ItemCount'] = len(thiefItems)
        dmgMin = thiefDx['Damage'] - int(thiefDx['Damage'] /2)
        dmgMax = thiefDx['Damage'] + int(thiefDx['Damage'] /2)
        thiefDx['DisplayDamage'] = f"{dmgMin}-{dmgMax}"
        
        slots = ['weapon', 'armor', 'head', 'hands', 'feet', ]

        for sl in slots:
            itemCheck = [x for x in thiefItems if x['Slot']==sl]

            if itemCheck:
                item = itemCheck[0]
                res = item.pop('GuildFK_id')
                res = item.pop('ThiefFK_id')
                code, bonuses = GetDisplayInfo(item)
                item['iconCode'] = code
                item['bonusLs'] = bonuses 
            else:
                item = {}
                item['id'] = -1
                item['iconCode'] = f"{sl}-empty"
                item['bonusLs'] = [] 

            thiefDx[sl] = item

    thiefDf = PD.DataFrame(thiefLs)
    thiefDf = thiefDf.drop(['_state', 'GuildFK_id', 'BasePower', 'BaseAgi', 'BaseCun', 'BaseMig', 'BaseEnd', 
                            'TrainedAgi', 'TrainedCun', 'TrainedMig', 'TrainedEnd',
                            'Wounds',], 
                        axis=1, errors='ignore')
    thiefDf = thiefDf.sort_values('Power', ascending=False)

    return thiefDf

def GetAssetList(guildMd):

    assetMds = GM.ItemInGuild.objects.filter(GuildFK=guildMd)
    assetLs = list(assetMds.values())

    for st in assetLs:
        code, bonuses = GetDisplayInfo(st)
        st['iconCode'] = code
        st['bonusLs'] = bonuses

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

    if itemDx['Slot'] in ['weapon', 'armor']: stat = itemDx['Trait'][:3]
    else:     stat = 'skl' if itemDx['Skill'] else 'cmb'
    iconCode = f"{itemDx['Slot']}-{stat}"

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
    if itemDx['Magic']:
        bonusLs.append(itemDx['Magic'])

    print(bonusLs, itemDx['Combat'])

    return iconCode, bonusLs

