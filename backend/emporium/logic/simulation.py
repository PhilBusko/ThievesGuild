"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
SIMULATION HELPER
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random, math
import emporium.models as EM
import emporium.logic.stage as SG


def AttachWargear(baseThief):

    if baseThief['Agi'] > baseThief['Cun'] and baseThief['Agi'] > baseThief['Mig']:
        # weaponDx = EM.UnlockableItem.objects.filter(
        #         Level=1, Slot='weapon', Requirement='Burglar').values()[0]
        baseThief['Agi'] = baseThief.get('Agi', 0) +2
        attack = 0
        damage = 1
        defense = 3

    if baseThief['Cun'] > baseThief['Agi'] and baseThief['Cun'] > baseThief['Mig']:
        baseThief['Cun'] = baseThief.get('Cun', 0) +2
        attack = 2
        damage = 0
        defense = 2

    if baseThief['Mig'] > baseThief['Agi'] and baseThief['Mig'] > baseThief['Cun']:
        baseThief['Mig'] = baseThief.get('Mig', 0) +2
        attack = 3
        damage = 0
        defense = 1

    baseThief['Att'] = baseThief.get('Agi', 0) + attack
    baseThief['Dmg'] = 6 + baseThief.get('Cun', 0) + damage
    baseThief['Def'] = 11 + baseThief.get('Mig', 0) + defense

    return baseThief

def ApplyRandomLevels(baseThief, numberLevels):

    upgradeLs = [   'agi', 'cun', 'mig', 'end',     # level
                    'att', 'dmg', 'def',            # weapon
                    'sab', 'per', 'tra', 
                    'att', 'dmg', 'def',            # armor
                    'sab', 'per', 'tra', 
                    'agi', 'cun', 'mig', 'end',     # accessory
                    'agi', 'cun', 'mig', 'end',                   
                ]

    newThief = baseThief.copy()

    for lv in range(0, numberLevels):
        rando = random.randint(1, len(upgradeLs))
        stat = upgradeLs.pop(rando-1)

        if stat == 'agi':
            newThief['Agi'] += 1
            newThief['Att'] += 1
        if stat == 'cun':   
            newThief['Cun'] += 1
            newThief['Dmg'] += 1
        if stat == 'mig':   
            newThief['Mig'] += 1
            newThief['Def'] += 1
        if stat == 'end':   
            newThief['End'] += 1
            newThief['Hlt'] += 5

        if stat == 'att':   newThief['Att'] += 1
        if stat == 'dmg':   newThief['Dmg'] += 1
        if stat == 'def':   newThief['Def'] += 1
        if stat == 'tra':   newThief['Tra'] += 3
        if stat == 'sab':   newThief['Sab'] += 3
        if stat == 'per':   newThief['Per'] += 3

    return newThief


def RunBeatCount(thiefConfig, obstacleLs):
    obsPos = 0
    wounds = 0
    xpEarned = 0
    goldEarned = 0
    debugLs = []

    while wounds < thiefConfig['Hlt']:

        currentObs = obstacleLs[obsPos]
        currPos = obsPos

        if currentObs['Skill'] != 'Fight':

            currentBonus = thiefConfig[currentObs['Trait']] + thiefConfig[currentObs['Skill']]
            currentResult = random.randint(1, 20) + currentBonus
            # print(currentResult, currentObs['Difficulty'])

            if currentResult >= currentObs['Difficulty']:
                passed = True
                effectLs = currentObs['Success'].split(', ')
                for ef in effectLs:
                    if ef == 'experience': xpEarned += 1
                    if ef == 'pass': obsPos += 1
                    if ef == 'pass next': obsPos += 2
                    if ef == 'treasure': goldEarned += 10
                    if ef == 'healing': wounds -= currentObs['Damage'] /2
                if wounds < 0: wounds = 0

            else:
                passed = False
                effectLs = currentObs['Failure'].split(', ')
                for ef in effectLs:
                    if ef == 'wound': wounds += RollDamage(currentObs['Damage'])
                    if ef == 'pass': obsPos += 1
                if wounds >= thiefConfig['Hlt']: obsPos -= 1

        else:
            enemyWounds = 0

            while wounds < thiefConfig['Hlt'] and enemyWounds < currentObs['Health']:

                # player attack

                attackResult = random.randint(1, 20) + thiefConfig['Att']
                if attackResult >= currentObs['Defense']:
                    enemyWounds += RollDamage(thiefConfig['Dmg'])
                
                # print('player attack', wounds, enemyWounds)

                # if enemy lives, they attack

                if enemyWounds < currentObs['Health']:
                    attackResult = random.randint(1, 20) + currentObs['Attack']
                    if attackResult >= thiefConfig['Def']:
                        wounds += RollDamage(currentObs['Damage'])

                # print('enemy attack', wounds, enemyWounds)

            if enemyWounds >= currentObs['Health']:
                passed = True
                effectLs = currentObs['Success'].split(', ')
                for ef in effectLs:
                    if ef == 'experience': xpEarned += 2
                    if ef == 'pass': obsPos += 1

            else:
                passed = False

        result = {
            'obstacle': currentObs['Name'],
            'passed': passed,
            'curr pos': currPos,
            'next pos': obsPos,
            'wounds': wounds,
            'xp': xpEarned,
            'gold': goldEarned,
        }
        debugLs.append(result)

    return debugLs

def RunPassTest(thiefConfig, obstacleLs):
    obsPos = 0
    wounds = 0
    xpEarned = 0
    goldEarned = 0
    debugLs = []

    while thiefConfig['Hlt'] > wounds and obsPos < len(obstacleLs):

        currentObs = obstacleLs[obsPos]
        currPos = obsPos

        if currentObs['Skill'] != 'Fight':

            currentBonus = thiefConfig[currentObs['Trait']] + thiefConfig[currentObs['Skill']]
            currentResult = random.randint(1, 20) + currentBonus

            if currentResult >= currentObs['Difficulty']:
                passed = True
                effectLs = currentObs['Success'].split(', ')
                for ef in effectLs:
                    if ef == 'experience': xpEarned += 1
                    if ef == 'pass': obsPos += 1
                    if ef == 'pass next': obsPos += 2
                    if ef == 'treasure': goldEarned += 10
                    if ef == 'healing': wounds -= currentObs['Damage'] /2
                if wounds < 0: wounds = 0

            else:
                passed = False
                effectLs = currentObs['Failure'].split(', ')
                for ef in effectLs:
                    if ef == 'wound': wounds += SG.RollDamage(currentObs['Damage'])
                    if ef == 'pass': obsPos += 1
                if wounds >= thiefConfig['Hlt']: obsPos -= 1

        else:
            # print('combat:', currentObs['Name'])
            enemyWounds = 0

            while thiefConfig['Hlt'] > wounds and currentObs['Health'] > enemyWounds:

                # player attack

                attackResult = random.randint(1, 20) + thiefConfig['Att']
                if attackResult >= currentObs['Defense']:
                    enemyWounds += SG.RollDamage(thiefConfig['Dmg'])
                
                # print('player attack', wounds, enemyWounds)

                # if enemy lives, they attack

                if currentObs['Health'] > enemyWounds:
                    attackResult = random.randint(1, 20) + currentObs['Attack']
                    if attackResult >= thiefConfig['Def']:
                        wounds += SG.RollDamage(currentObs['Damage'])

                # print('enemy attack', wounds, enemyWounds)

            if currentObs['Health'] <= enemyWounds:
                passed = True
                effectLs = currentObs['Success'].split(', ')
                for ef in effectLs:
                    if ef == 'experience': xpEarned += 2
                    if ef == 'pass': obsPos += 1

            else:
                passed = False

        debugLs.append({
            'obstacle': currentObs['Name'],
            'passed': passed,
            'curr pos': currPos,
            'next pos': obsPos,
            'wounds': wounds,
            'xp': xpEarned,
            'gold': goldEarned,
        })

    return debugLs


def TestExpedition(thiefConfig, expDx):

    passed = 0
    trapMd = EM.Trap.objects.filter(Level=expDx['level']).order_by('Difficulty')[0]
    diffTarget = trapMd.Difficulty
    # print('diff target:', diffTarget)

    # main trait

    bonus = thiefConfig[expDx['MainTrait'].title()]

    for rg in range(1, 10):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    # secondary traits

    bonus = thiefConfig[expDx['SecondaryOne'].title()]
    for rg in range(1, 4):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    bonus = thiefConfig[expDx['SecondaryTwo'].title()]
    for rg in range(1, 4):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    bonus = thiefConfig[expDx['SecondaryThree'].title()]
    for rg in range(1, 4):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    # skills
    # compare with simulation.AttachWargear and resource.SetThiefTotals

    if 'att' in expDx['SkillOne']:
        bonus = thiefConfig['Att'] - thiefConfig['Agi']
        bonus += thiefConfig['Dmg'] - thiefConfig['Cun'] - 6
        bonus += thiefConfig['Def'] - thiefConfig['Mig'] - 11
    else:
        bonus = 0
        if 'sab' in expDx['SkillOne']: bonus += thiefConfig['Sab']
        if 'per' in expDx['SkillOne']: bonus += thiefConfig['Per']
        if 'tra' in expDx['SkillOne']: bonus += thiefConfig['Tra']
    for rg in range(1, 4):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    if 'att' in expDx['SkillTwo']:
        bonus = thiefConfig['Att'] - thiefConfig['Agi']
        bonus += thiefConfig['Dmg'] - thiefConfig['Cun'] - 6
        bonus += thiefConfig['Def'] - thiefConfig['Mig'] - 11
    else:
        bonus = 0
        if 'sab' in expDx['SkillTwo']: bonus += thiefConfig['Sab']
        if 'per' in expDx['SkillTwo']: bonus += thiefConfig['Per']
        if 'tra' in expDx['SkillTwo']: bonus += thiefConfig['Tra']
    for rg in range(1, 4):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    if 'att' in expDx['SkillThree']:
        bonus = thiefConfig['Att'] - thiefConfig['Agi']
        bonus += thiefConfig['Dmg'] - thiefConfig['Cun'] - 6
        bonus += thiefConfig['Def'] - thiefConfig['Mig'] - 11
    else:
        bonus = 0
        if 'sab' in expDx['SkillThree']: bonus += thiefConfig['Sab']
        if 'per' in expDx['SkillThree']: bonus += thiefConfig['Per']
        if 'tra' in expDx['SkillThree']: bonus += thiefConfig['Tra']
    for rg in range(1, 4):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    return passed

