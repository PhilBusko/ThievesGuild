"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM STAGE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random, math
import pandas as PD

import app_proj.notebooks as NT
import emporium.models as EM


def RollDamage(aveDamage):
    variance = math.floor(aveDamage / 2)
    if variance > 6: variance = 6
    roll = random.randint(aveDamage - variance, aveDamage + variance)
    return roll

def RollReward(aveResource):
    variance = math.floor(aveResource / 2)
    if variance > 10: variance = 10
    roll = random.randint(aveResource - variance, aveResource + variance)
    return roll

def GetTreasureReward(obsLevel):

    stageLs = EM.GothicTower.objects.filter(LevelLnd1=obsLevel).order_by('StageNo')
    stageMd = list(stageLs)[0]
    randomType = random.randint(1, 5)

    if randomType in [1, 2]:
        treasureType = 'gold'
        treasureBase = round(stageMd.Gold / 4)
        treasureAmount = RollReward(treasureBase)

    elif randomType in [3, 4]:
        treasureType = 'stone'
        treasureBase = round(stageMd.Stone / 4)
        treasureAmount = RollReward(treasureBase)

    else:
        treasureType = 'gems'
        treasureBase = round(stageMd.Gems / 4)
        if treasureBase == 0: treasureBase = 1
        treasureAmount = treasureBase

    return f"{treasureType} {treasureAmount}"

def GetHealAmount(obsLevel):
    trapObs = EM.Trap.objects.filter(Level=obsLevel, Trait='Agi').order_by('Damage')
    trapDx = list(trapObs)[0]
    heal = math.floor(trapDx.Damage / 2)
    return heal

def GetStageRewards(rewards):

    gold = RollReward(rewards['gold'])
    stone = RollReward(rewards['stone'])
    gems = RollReward(rewards['gems'])

    resourceDx = {
        'gold': gold,
        'stone': stone,
        'gems': gems,
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

def LandingType(heist, prevType, prevTypeLs, currDt):

    if heist == 'tower' or heist == 'campaign':
        potential = [
            'balanced', 'balanced', 'balanced',
            'biased agi', 'biased cun', 'biased mig', 'biased cmb',
        ]
        chosen = random.choice(potential)
        if 'biased' in prevType and 'biased' in chosen:   
            chosen = 'balanced'

    if heist == 'trial':
        dayOfWeek = 'monday'
        if currDt.weekday() == 1:   dayOfWeek = 'tuesday'
        if currDt.weekday() == 2:   dayOfWeek = 'wednesday'
        if currDt.weekday() == 3:   dayOfWeek = 'thursday'
        if currDt.weekday() == 4:   dayOfWeek = 'friday'
        if currDt.weekday() == 5:   dayOfWeek = 'saturday'
        if currDt.weekday() == 6:   dayOfWeek = 'sunday'
        trialDay = EM.TrialDay.objects.GetOrNone(WeekDay=dayOfWeek)
        chosen = f"biased {trialDay.StageType}"

    if heist == 'dungeon':
        potential = ['biased agi', 'biased cun', 'biased mig', 'biased cmb']
        prevFix = prevTypeLs if len(prevTypeLs) < len(potential) else []
        chosen = random.choice(potential)
        while chosen in prevFix:
            chosen = random.choice(potential)
        prevTypeLs.append(chosen)

    return chosen

def AssembleRoom(landingType, stageLevel, maxObstacles):

    # generate the room randomly
    # then check if it passes certain requirements

    if landingType == 'balanced':
        potentialLs = ProductionTable(stageLevel,4,1,1,1)
    if landingType == 'biased agi':
        potentialLs = ProductionTable(stageLevel,3,3,1,1)
    if landingType == 'biased cun':
        potentialLs = ProductionTable(stageLevel,3,1,3,1)
    if landingType == 'biased mig':
        potentialLs = ProductionTable(stageLevel,3,1,1,3)
    if landingType == 'biased cmb':
        potentialLs = ProductionTable(stageLevel,5,1,1,1)

    obstacleLs = ObstacleSequence(potentialLs, maxObstacles)
    permitted = CheckPermitted(obstacleLs, landingType, maxObstacles)

    while not permitted:
        obstacleLs = ObstacleSequence(potentialLs, maxObstacles)
        permitted = CheckPermitted(obstacleLs, landingType, maxObstacles)

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

def ObstacleSequence(potentialLs, maxObstacles):
    # create the obstacle sequence back to front

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

            # don't let an obstacle be adjacent to another obstacle of the same type
            if forwardObs['Trait'] == currentObs['Trait']:
                continue

            # don't let 2 pass next be adjacent
            if 'pass next' in forwardObs['Success'] and 'pass next' in currentObs['Success']:
                continue

            # don't let a pass next appear before a treasure
            if (any(c in forwardObs['Success'] for c in ['treasure', 'healing']) and 
                any(c in currentObs['Success'] for c in ['pass next']) ):
                continue

        obstacleLs.insert(0, currentObs)
    
    return obstacleLs

def CheckPermitted(obstacleLs, stageType, maxObstacles):

    # get the minimum obstacle types required based on parameters

    if stageType == 'balanced' and maxObstacles <= 15:
        minDx = {'Agi': 2, 'Cun': 2, 'Mig': 2, 'All': 4}
    elif stageType == 'balanced':
        minDx = {'Agi': 3, 'Cun': 3, 'Mig': 3, 'All': 5}
        
    if stageType == 'biased agi' and maxObstacles <= 15:
        minDx = {'Agi': 5, 'Cun': 1, 'Mig': 1, 'All': 3}
    elif stageType == 'biased agi':
        minDx = {'Agi': 6, 'Cun': 2, 'Mig': 2, 'All': 4}
        
    if stageType == 'biased cun' and maxObstacles <= 15:
        minDx = {'Agi': 1, 'Cun': 5, 'Mig': 1, 'All': 3}
    elif stageType == 'biased cun':
        minDx = {'Agi': 2, 'Cun': 6, 'Mig': 2, 'All': 4}
        
    if stageType == 'biased mig' and maxObstacles <= 15:
        minDx = {'Agi': 1, 'Cun': 1, 'Mig': 5, 'All': 3}
    elif stageType == 'biased mig':
        minDx = {'Agi': 2, 'Cun': 2, 'Mig': 6, 'All': 4}

    if stageType == 'biased cmb' and maxObstacles <= 15:
        minDx = {'Agi': 2, 'Cun': 2, 'Mig': 2, 'All': 5}
    elif stageType == 'biased cmb':
        minDx = {'Agi': 3, 'Cun': 3, 'Mig': 3, 'All': 6}

    # compare the current run with the min and max

    countDx = {'Agi': 0, 'Cun': 0, 'Mig': 0, 'All': 0}
    for ob in obstacleLs:
        countDx[ob['Trait']] += 1

    permited = True

    if countDx['Agi'] < minDx['Agi'] or countDx['Agi'] > minDx['Agi'] +2:
        permited = False

    if countDx['Cun'] < minDx['Cun'] or countDx['Cun'] > minDx['Cun'] +2:
        permited = False

    if countDx['Mig'] < minDx['Mig'] or countDx['Mig'] > minDx['Mig'] +2:
        permited = False

    if countDx['All'] != minDx['All']:
        permited = False

    return permited


def GetExpedition(level, expType):

    expedi = EM.ExpeditionType.objects.filter(Type=expType)

    expediDx = expedi[0].__dict__
    expediDx.pop('id')
    expediDx.pop('_state')

    expediDx['level'] = level
    return expediDx


def GetStarThief(resourceId, name):
    trait = resourceId.split('-')[1]
    stars = int(resourceId[-1])
    thiefTemplate = EM.UnlockableThief.objects.GetOrNone(ResourceId=resourceId)

    rareDx = {
        'class': thiefTemplate.Class,
        'stars': stars,
        'name': name,
        'agi': 0,
        'cun': 0,
        'mig': 0,
        'end': 0,
    }

    rareDx[trait] = stars +2        # StartTrait column is unused

    advanceTraits = ['agi', 'cun', 'mig', 'end']
    advanceTraits.remove(trait)

    potential = []
    copies = stars +1
    for rg in range(0, copies):
        potential += advanceTraits

    for rg in range(0, thiefTemplate.RandomTraits):
        advance = random.choice(potential)
        potential.remove(advance)
        rareDx[advance] += 1

    return rareDx

def GetMagicItem(resourceId):
    itemTemplate = EM.UnlockableItem.objects.GetOrNone(ResourceId=resourceId)
    enchants = itemTemplate.EnchantmentList.split(', ')

    rareDx = {
        'magic': random.choice(enchants),
    }
    return rareDx

def GetRareMaterial(resourceId, throneLevel):

    tower = EM.GothicTower.objects.GetOrNone(Throne=throneLevel, StageNo=1)
    FACTOR = 2

    amount = tower.Wood * FACTOR
    if 'stone' in resourceId: amount = tower.Stone * FACTOR
    if 'iron' in resourceId: amount = tower.Iron * FACTOR

    rareDx = {
        'amount': amount,
        'cost': int(tower.Gold * 0.75),
    }
    return rareDx


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
RESEARCH STAGE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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

