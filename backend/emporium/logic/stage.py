"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM STAGE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random, math
import pandas as PD

import app_proj.notebooks as NT
import emporium.models as EM


def RollDamage(aveDamage):
    variance = math.floor(aveDamage / 2)
    if variance > 10: variance = 10
    roll = random.randint(aveDamage - variance, aveDamage + variance)
    return roll

def RollReward(aveResource):
    factor = 5
    if aveResource > 100: factor = 6
    if aveResource > 500: factor = 7
    if aveResource > 1000: factor = 8
    variance = math.floor(aveResource / factor)
    if variance == 0: variance = 1
    roll = random.randint(aveResource - variance, aveResource + variance)
    return roll

def GetTreasureReward(obsLevel):
    trapObs = EM.Trap.objects.filter(Level=obsLevel, Trait='Agi').order_by('Damage')
    trapDx = list(trapObs)[0]
    randomType = random.randint(1, 4)
    treasureType = ''
    treasureAmount = 0

    if randomType != 4:
        treasureType = 'gold'
        treasureBase = trapDx.Damage
        treasureAmount = RollReward(treasureBase)

    else:
        treasureType = 'gems'
        treasureBase = math.floor(trapDx.Damage / 10)
        treasureAmount = treasureBase

    return f"{treasureType} {treasureAmount}"

def GetHealAmount(obsLevel):
    trapObs = EM.Trap.objects.filter(Level=obsLevel, Trait='Agi').order_by('Damage')
    trapDx = list(trapObs)[0]
    heal = math.floor(trapDx.Damage / 2)
    return heal

def GetStageRewards(rewards):

    gold = RollReward(rewards['Gold'])
    gems = RollReward(rewards['Gems'])

    potential = ['Wood']
    if rewards['Stone'] > 0: potential.append('Stone')
    if rewards['Iron'] > 0: potential.append('Iron')
    resType = random.choice(potential)
    resAmount = RollReward(rewards[resType])

    resourceDx = {
        'gold': gold,
        'gems': gems,
        resType.lower(): resAmount,
    }

    return resourceDx

def StageBackground(lastBackground):
    potential = [ 'warehouse', 'nobleman', 'temple', 'college', 'armory' ]
    try:    
        potential.remove(lastBackground)
    except:
        pass
    chosen = random.choice(potential)
    return chosen


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
OBSTACLES LAYOUT
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

def RandomRoomType(prevType):
    potential = [
        'balanced', 'balanced', 'balanced', 'balanced',
        'biased agi', 'biased cun', 'biased mig', 'biased cmb'
    ]
    chosen = random.choice(potential)
    if 'biased' in prevType and 'biased' in chosen:   
        chosen = 'balanced'

    return chosen

def AssembleRoom(stageType, stageLevel, maxObstacles):

    if stageType == 'balanced':
        potentialLs = ProductionTable(stageLevel,4,2,2,2)
        obstacleLs = ObstacleSequence(potentialLs, maxObstacles, 'balanced')

    else:
        if 'agi' in stageType: potentialLs = ProductionTable(stageLevel,2,3,1,1)
        if 'cun' in stageType: potentialLs = ProductionTable(stageLevel,2,1,3,1)
        if 'mig' in stageType: potentialLs = ProductionTable(stageLevel,2,1,1,3)
        if 'cmb' in stageType: potentialLs = ProductionTable(stageLevel,4,1,1,1)
        obstacleLs = ObstacleSequence(potentialLs, maxObstacles, 'biased')

    return obstacleLs

def ProductionTable(level, combat, agility, cunning, might):

    table = []

    enemyOb = EM.Enemy.objects.filter(Level=level)
    enemyLs = list(enemyOb.values())
    for ct in range(0, combat):
        table += enemyLs

    trapOb = EM.Trap.objects.filter(Level=level, Trait='Agi')
    trapLs = list(trapOb.values())
    for ct in range(0, agility):
        table += trapLs

    trapOb = EM.Trap.objects.filter(Level=level, Trait='Cun')
    trapLs = list(trapOb.values())
    for ct in range(0, cunning):
        table += trapLs

    trapOb = EM.Trap.objects.filter(Level=level, Trait='Mig')
    trapLs = list(trapOb.values())
    for ct in range(0, might):
        table += trapLs

    obsDf = PD.DataFrame(table).drop(['id'], axis=1, errors='ignore')
    obsLs = NT.DataframeToDicts(obsDf)
    return obsLs

def ObstacleSequence(potentialLs, maxObstacles, configType):
    # create the obstacle sequence back to front
    # configType = balanced | biased

    obstacleLs = []

    while len(obstacleLs) < maxObstacles:

        currentObs = random.choice(potentialLs)

        # don't let a pass next be the last obstacle
        if len(obstacleLs) == 0 and 'pass next' in currentObs['Success']:
            continue

        # don't let treasure be the first obstacle
        if (len(obstacleLs) == maxObstacles -1 and 
            any(c in currentObs['Success'] for c in ['treasure', 'healing']) ):
            continue

        if len(obstacleLs) > 0:
            forwardObs = obstacleLs[0]

            # balanced config: don't let adjacent objects have the same trait
            if configType == 'balanced' and forwardObs['Trait'] == currentObs['Trait']:
                continue

            # biased config: don't let any obstacle be adjacent to itself
            if configType == 'biased' and forwardObs['Name'] == currentObs['Name']:
                continue

            # don't let 2 pass next be adjacent
            if 'pass next' in forwardObs['Success'] and 'pass next' in currentObs['Success']:
                continue

            # don't let 2 treasures be adjacent
            if (any(c in forwardObs['Success'] for c in ['treasure', 'healing']) and 
                any(c in currentObs['Success'] for c in ['treasure', 'healing']) ):
                continue

            # don't let a pass next appear before a treasure
            if (any(c in forwardObs['Success'] for c in ['treasure', 'healing']) and 
                any(c in currentObs['Success'] for c in ['pass next']) ):
                continue

        obstacleLs.insert(0, currentObs)
    
    return obstacleLs


DIFFICULTY = 13
DAMAGE = 11

def GetDevelopmentTable(level, combat, agility, cunning, might):

    table = []

    for ct in range(0, combat):
        table += GetDevCombat()

    for ct in range(0, agility):
        table += GetDevAgility()

    for ct in range(0, cunning):
        table += GetDevCunning()

    for ct in range(0, might):
        table += GetDevMight()

    return table

def GetDevCombat():
    obstacleLs = [
        {'Name': 'class1', 'Trait': 'all1', 'Skill': 'Fight', 
        'Success': 'experience, pass', 'Failure': 'knockout', 'Experience': 13, 
        'Attack': 2, 'Damage': 8, 'Defense': 13, 'Health': 11, },

        {'Name': 'class2', 'Trait': 'all2', 'Skill': 'Fight', 
        'Success': 'experience, pass', 'Failure': 'knockout', 'Experience': 13, 
        'Attack': 3, 'Damage': 10, 'Defense': 12, 'Health': 9, },

        {'Name': 'class3', 'Trait': 'all3', 'Skill': 'Fight', 
        'Success': 'experience, pass', 'Failure': 'knockout', 'Experience': 13, 
        'Attack': 2, 'Damage': 6, 'Defense': 15, 'Health': 12, },
    ]

    for o in obstacleLs:
        o['Defense'] += 1

    # obstacleLs = [
    #     {'Name': 'class1', 'Trait': 'all1', 'Skill': 'Fight', 
    #     'Success': 'experience, pass', 'Failure': 'knockout', 'Experience': 13, 
    #     'Attack': 2, 'Damage': 9, 'Defense': 14, 'Health': 14, },

    #     {'Name': 'class2', 'Trait': 'all2', 'Skill': 'Fight', 
    #     'Success': 'experience, pass', 'Failure': 'knockout', 'Experience': 13, 
    #     'Attack': 2, 'Damage': 9, 'Defense': 14, 'Health': 14, },
    # ]
    return obstacleLs

def GetDevAgility():
    obstacleLs = [
        {'Name': 'Door', 'Trait': 'Agi', 'Skill': 'Sab', 
        'Success': 'experience, pass', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY, 'Damage': DAMAGE, },

        {'Name': 'Spike Trap', 'Trait': 'Agi', 'Skill': 'Tra', 
        'Success': 'experience, pass', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY, 'Damage': DAMAGE, },

        {'Name': 'Chandelier', 'Trait': 'Agi', 'Skill': 'Per', 
        'Success': 'experience, pass next', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY+2, 'Damage': DAMAGE, },

        {'Name': 'Chest', 'Trait': 'Agi', 'Skill': 'Sab', 
        'Success': 'treasure, pass', 'Failure': 'pass',
        'Experience': 8, 'Difficulty': DIFFICULTY+4, 'Damage': DAMAGE, },
    ]
    return obstacleLs

def GetDevCunning():
    obstacleLs = [
        {'Name': 'Crossbow Trap', 'Trait': 'Cun', 'Skill': 'Per', 
        'Success': 'experience, pass', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY, 'Damage': DAMAGE, },

        {'Name': 'Arcane Seal', 'Trait': 'Cun', 'Skill': 'Sab', 
        'Success': 'experience, pass', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY, 'Damage': DAMAGE, },

        {'Name': 'Secret Passage', 'Trait': 'Cun', 'Skill': 'Per', 
        'Success': 'experience, pass next', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY+2, 'Damage': DAMAGE, },

        {'Name': 'Armoire', 'Trait': 'Cun', 'Skill': 'Tra', 
        'Success': 'healing, pass', 'Failure': 'pass',
        'Experience': 8, 'Difficulty': DIFFICULTY+4, 'Damage': DAMAGE, },
    ]
    return obstacleLs

def GetDevMight():
    obstacleLs = [
        {'Name': 'Barrel', 'Trait': 'Mig', 'Skill': 'Tra', 
        'Success': 'experience, pass', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY, 'Damage': DAMAGE, },

        {'Name': 'Gargoyle', 'Trait': 'Mig', 'Skill': 'Sab', 
        'Success': 'experience, pass', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY, 'Damage': DAMAGE, },

        {'Name': 'Window', 'Trait': 'Mig', 'Skill': 'Tra', 
        'Success': 'experience, pass next', 'Failure': 'wound, pass',
        'Experience': 8, 'Difficulty': DIFFICULTY+2, 'Damage': DAMAGE, },

        {'Name': 'Idol', 'Trait': 'Mig', 'Skill': 'Per', 
        'Success': 'treasure, pass', 'Failure': 'pass',
        'Experience': 8, 'Difficulty': DIFFICULTY+4, 'Damage': DAMAGE, },
    ]
    return obstacleLs

