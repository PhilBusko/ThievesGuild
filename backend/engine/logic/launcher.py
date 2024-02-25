"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE LAUNCHER
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import json, random, math
import emporium.logic.stage as ST


def LaunchRoom(thiefMd, obstacleLs):
    obsPos = 0
    woundsRollTotal = 0
    resultLs = []
    thiefWounds = 0

    while thiefWounds < thiefMd.Health and obsPos < len(obstacleLs):

        currentObs = obstacleLs[obsPos]
        posCurr = obsPos
        reward = None
        woundsRoll = None

        if currentObs['Skill'] != 'Fight':

            if currentObs['Trait'] == 'Agi': traitBonus = thiefMd.Agility
            if currentObs['Trait'] == 'Cun': traitBonus = thiefMd.Cunning
            if currentObs['Trait'] == 'Mig': traitBonus = thiefMd.Might
            if currentObs['Skill'] == 'Sab': skillBonus = thiefMd.Sabotage
            if currentObs['Skill'] == 'Per': skillBonus = thiefMd.Perceive
            if currentObs['Skill'] == 'Tra': skillBonus = thiefMd.Traverse
            naturalRoll = random.randint(1, 20)
            currentResult = naturalRoll + traitBonus + skillBonus

            if currentResult >= currentObs['Difficulty']:
                effectLs = currentObs['Success'].split(', ')
                for ef in effectLs:
                    if ef == 'pass': obsPos += 1
                    elif ef == 'pass next': obsPos += 2
                    if ef == 'experience': reward = f"xp {currentObs['Experience']}"
                    elif ef == 'treasure': reward = ST.GetTreasureReward(currentObs['Level'])
                    elif ef == 'healing': 
                        healAmount = ST.GetHealAmount(currentObs['Level'])
                        reward = f"heal {healAmount}"
                        thiefWounds -= healAmount
                if thiefWounds < 0: thiefWounds = 0

            else:
                effectLs = currentObs['Failure'].split(', ')
                for ef in effectLs:
                    if ef == 'wound': 
                        woundsRoll = ST.RollDamage(currentObs['Damage'])
                        thiefWounds += woundsRoll
                    if ef == 'pass': 
                        obsPos += 1
                if thiefWounds >= thiefMd.Health: obsPos -= 1

            resultLs.append({
                'obstacle': currentObs['Name'],
                'posCurr': posCurr,
                'posNext': obsPos,
                'rollParams':   {'roll': naturalRoll,
                                    'traitBonus': traitBonus,
                                    'skillBonus': skillBonus,
                                    'result': currentResult,
                                    'trait': currentObs['Trait'],
                                    'skill': currentObs['Skill'], 
                                    'difficulty': currentObs['Difficulty'],
                                },
                'reward': reward,
                'woundsRoll': woundsRoll,
                'woundsTotal': thiefWounds,
            })

        else:
            woundsCombat = 0
            woundsEnemy = 0
            rollParamLs = []

            while thiefWounds < thiefMd.Health and woundsEnemy < currentObs['Health']:

                # player attack

                thiefDamage = None
                naturalRoll = random.randint(1, 20) 
                if naturalRoll + thiefMd.Attack >= currentObs['Defense']:
                    thiefDamage = ST.RollDamage(thiefMd.Damage)
                    woundsEnemy += thiefDamage

                rollParamLs.append({
                    'attacker': 'thief',
                    'roll': naturalRoll,
                    'attack': thiefMd.Attack,
                    'result': naturalRoll + thiefMd.Attack,
                    'defense': currentObs['Defense'],
                    'woundsRoll': thiefDamage,
                    'woundsTotal': woundsEnemy,
                })

                # if enemy lives, they attack

                if woundsEnemy < currentObs['Health']:

                    naturalRoll = random.randint(1, 20)
                    if naturalRoll + currentObs['Attack'] >= thiefMd.Defense:
                        woundsRoll = ST.RollDamage(currentObs['Damage'])
                        woundsCombat += woundsRoll
                        thiefWounds += woundsRoll

                    rollParamLs.append({
                        'attacker': 'enemy',
                        'roll': naturalRoll,
                        'attack': currentObs['Attack'],
                        'result': naturalRoll + currentObs['Attack'],
                        'defense': thiefMd.Defense,
                        'woundsRoll': woundsRoll,
                        'woundsTotal': thiefWounds,
                    })

            # end combat while loop

            if woundsEnemy >= currentObs['Health']:
                effectLs = currentObs['Success'].split(', ')
                for ef in effectLs:
                    if ef == 'pass': obsPos += 1
                    if ef == 'experience': reward = f"xp {currentObs['Experience']}"

            resultLs.append({
                'obstacle': currentObs['Name'],
                'posCurr': posCurr,
                'posNext': obsPos,
                'rollParams': rollParamLs,
                'reward': reward,
                'woundsCombat': woundsCombat,
                'woundsTotal': thiefWounds,
            })

    return resultLs

