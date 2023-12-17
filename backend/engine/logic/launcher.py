"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE LAUNCHER
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import json, random, math
import emporium.models as EM


def RollDamage(aveDamage):
    variance = math.floor(aveDamage / 2)
    if variance > 10: variance = 10
    roll = random.randint(aveDamage - variance, aveDamage + variance)
    return roll

def GetTreasureReward(obsLevel):
    return 'gold 1'

def GetHealAmount(obsLevel):
    trapObs = EM.Trap.objects.filter(Level=obsLevel, Trait='Agi').order_by('Damage')
    trapDx = list(trapObs)[0]
    heal = math.floor(trapDx.Damage / 2)
    return heal



def LaunchStage(roomLs, runStage):

    resultsR1 = []
    resultsR2 = []
    resultsR3 = []
    for rm in roomLs:
        if rm['room'] == 1:
            resultsR1 = LaunchRoom(rm['thief'], json.loads(runStage.ObstaclesR1))
        if rm['room'] == 2:
            resultsR2 = LaunchRoom(rm['thief'], json.loads(runStage.ObstaclesR2))
        if rm['room'] == 3:
            resultsR3 = LaunchRoom(rm['thief'], json.loads(runStage.ObstaclesR3))

    return resultsR1, resultsR2, resultsR3


def LaunchRoom(thiefMd, obstacleLs):
    obsPos = 0
    stageRewards = {}
    resultLs = []

    while thiefMd.Wounds < thiefMd.Health and obsPos < len(obstacleLs):

        currentObs = obstacleLs[obsPos]
        currPos = obsPos
        reward = None
        wounds = None

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
                    elif ef == 'treasure': reward = GetTreasureReward(currentObs['Level'])
                    elif ef == 'healing': 
                        healAmount = GetHealAmount(currentObs['Level'])
                        reward = f"heal {healAmount}"
                        thiefMd.Wounds -= healAmount
                if thiefMd.Wounds < 0: thiefMd.Wounds = 0

            else:
                effectLs = currentObs['Failure'].split(', ')
                for ef in effectLs:
                    if ef == 'wound': 
                        wounds = RollDamage(currentObs['Damage'])
                        thiefMd.Wounds += wounds
                    if ef == 'pass': 
                        obsPos += 1
                if thiefMd.Wounds >= thiefMd.Health: obsPos -= 1

            resultLs.append({
                'obstacle': currentObs['Name'],
                'currPos': currPos,
                'nextPos': obsPos,
                'rollParams': {'roll': naturalRoll,
                                'traitBonus': traitBonus,
                                'skillBonus': skillBonus,
                                'result': currentResult,
                                'trait': currentObs['Trait'],
                                'skill': currentObs['Skill'], 
                                'difficulty': currentObs['Difficulty'],
                                },
                'reward': reward,
                'wounds': wounds,
            })

        else:
            thiefWounds = 0
            enemyWounds = 0
            rollParamLs = []

            while thiefMd.Wounds < thiefMd.Health and enemyWounds < currentObs['Health']:

                # player attack

                thiefDamage = None
                naturalRoll = random.randint(1, 20) 
                if naturalRoll + thiefMd.Attack >= currentObs['Defense']:
                    thiefDamage = RollDamage(thiefMd.Damage)
                    enemyWounds += thiefDamage

                rollParamLs.append({
                    'attacker': 'thief',
                    'roll': naturalRoll,
                    'attack': thiefMd.Attack,
                    'result': naturalRoll + thiefMd.Attack,
                    'defense': currentObs['Defense'],
                    'wounds': thiefDamage,
                })

                # if enemy lives, they attack

                if enemyWounds < currentObs['Health']:

                    naturalRoll = random.randint(1, 20)
                    if naturalRoll + currentObs['Attack'] >= thiefMd.Defense:
                        wounds = RollDamage(currentObs['Damage'])
                        thiefMd.Wounds += wounds
                        thiefWounds += wounds

                    rollParamLs.append({
                        'attacker': 'enemy',
                        'roll': naturalRoll,
                        'attack': currentObs['Attack'],
                        'result': naturalRoll + currentObs['Attack'],
                        'defense': thiefMd.Defense,
                        'wounds': wounds,
                    })

            # end combat while loop

            if enemyWounds >= currentObs['Health']:
                effectLs = currentObs['Success'].split(', ')
                for ef in effectLs:
                    if ef == 'pass': obsPos += 1
                    if ef == 'experience': reward = f"xp {currentObs['Experience']}"

            resultLs.append({
                'obstacle': currentObs['Name'],
                'currPos': currPos,
                'nextPos': obsPos,
                'rollParams': rollParamLs,
                'reward': reward,
                'wounds': thiefWounds,
            })

    return resultLs



