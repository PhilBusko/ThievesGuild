"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM STAGE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import pandas as PD

import app_proj.notebooks as NT
import emporium.models as EM


def RandomStageType():
    potential = ['balanced', 'balanced', 'balanced', 'balanced',
        'biased agi', 'biased cun', 'biased mig', 'biased cmb']
    chosen = random.choice(potential)
    return chosen

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

def GetProductionTable(level, combat, agility, cunning, might):

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

