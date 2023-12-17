"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE RESOURCE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import pandas as PD
import emporium.models as EM 
import engine.models as GM 

POWER_FACTOR = 50

def CreateNewGuild(user, guildName):

    newGuild = GM.Guild(**{'UserFK': user, 'Name': guildName, 'Selected': True})
    newGuild.save()

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

    StartingAccessories(newGuild)

    thiefOb = GM.ThiefInGuild.objects.filter(GuildFK=newGuild)
    for th in thiefOb:
        SetThiefTotals(th)
    SetGuildPower(newGuild)

    return newGuild

def AppendStartingThief(guildMd, thiefClass, stars):

    thiefMd = EM.UnlockableThief.objects.filter(Class=thiefClass, Stars=stars)
    thiefDx = list(thiefMd.values())[0]

    startAgi = 3 if 'agi' in thiefDx['StartTrait'] else 0
    startCun = 3 if 'cun' in thiefDx['StartTrait'] else 0
    startMig = 3 if 'mig' in thiefDx['StartTrait'] else 0
    # startRand = thiefDx['RandomTraits'] if thiefDx['RandomTraits'] else 0
    # baseTraits = RS.BaseTraits(startMig, startAgi, startCun, startRand)

    newThief ={
        'GuildFK': guildMd,
        'Name': 'aletta',
        'Class': thiefDx['Class'],
        'Stars': thiefDx['Stars'],
        'BasePower': thiefDx['StoreCost'] / POWER_FACTOR,
        'BaseMig': startMig,
        'BaseAgi': startAgi,
        'BaseCun': startCun,
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
        'Slot': armorDx['Slot'],
        'Power': armorDx['StoreCost'],
        'Requirement': armorDx['Requirement'],
        'Trait': weaponDx['Trait'],
        'Combat': weaponDx['Combat'],
        'Skill': weaponDx['Skill'],
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
            'Slot': accessoryDx['Slot'],
            'Power': accessoryDx['StoreCost'],
            'Skill': accessoryDx['Skill'],
        }
        newModel = GM.ItemInGuild(**newAccessory).save()

        accessoryDx = EM.UnlockableItem.objects.filter(Level=1, Slot=sl).values()[1]
        newAccessory = {
            'GuildFK': guildMd,
            'ThiefFK': None,
            'Name': accessoryDx['Name'],
            'Level': accessoryDx['Level'],
            'Slot': accessoryDx['Slot'],
            'Power': accessoryDx['StoreCost'],
            'Skill': accessoryDx['Skill'],
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
    thiefMd.Damage = (thiefMd.Cunning + GetItemCombat(weapon, 'dmg') + GetItemCombat(armor, 'dmg') +
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

