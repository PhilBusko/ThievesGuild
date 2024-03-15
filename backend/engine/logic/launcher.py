"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE LAUNCHER
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import json, random, math
import emporium.logic.guild as GD
import emporium.logic.stage as ST
import engine.models as GM
import engine.logic.resource as RS


def RunObstacles(thiefMd, obstacleLs):
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

def RunResults(guildMd, thiefMd, roomNo, stageMd, obstacleLs, results):

    # deduce the overall results

    win = results[-1]['posNext'] == len(obstacleLs)
    nextRoom = stageMd.RoomTypes[roomNo] 

    nextStep = ''
    if not win:                 nextStep = 'defeat'
    if win and not nextRoom:    nextStep = 'victory'
    if win and nextRoom:        nextStep = 'next-room'

    # total up room rewards

    roomRewards = {}
    for rs in results:
        reward = rs['reward']
        if reward:
            if 'xp' in reward:      roomRewards['xp'] = roomRewards.get('xp', 0) + int(reward.split(' ')[1])
            if 'gold' in reward:    roomRewards['gold'] = roomRewards.get('gold', 0) + int(reward.split(' ')[1])
            if 'gems' in reward:    roomRewards['gems'] = roomRewards.get('gems', 0) + int(reward.split(' ')[1])

    # grant room rewards, win or lose
    # todo: apply guild bonus

    for key in roomRewards.keys():
        if key == 'xp':     RS.GrantExperience(thiefMd, roomRewards[key])
        if key == 'gold':   RS.GrantGold(guildMd, roomRewards[key])
        if key == 'gems':   RS.GrantGems(guildMd, roomRewards[key])

    thiefDx = GM.ThiefInGuild.objects.filter(id=thiefMd.id)
    thiefDx = thiefDx.values('id', 'Name', 'Class', 'Health', 'Experience')[0]
    status, cooldown = RS.ApplyWounds(thiefMd, results[-1]['woundsTotal'])
    thiefDx['Status'] = status
    thiefDx['Cooldown'] = cooldown

    thiefDx['Wounds'] = results[-1]['woundsTotal']
    thiefDx['ExpReward'] = roomRewards['xp'] if 'xp' in roomRewards else 0
    thiefDx['ExpNextLevel'] = GD.GetNextLevelXp(thiefMd.Level)

    # save room status, on lose the traps are reset

    if win:
        stageMd.RoomRewards[roomNo -1] = roomRewards
        stageMd.Assignments[roomNo -1] = thiefDx
        stageMd.save()

    # stage rewards
    # on defeat only display the current room's results

    stageRewards = {}
    # roomRewards = [roomRewards]

    if nextStep == 'victory':
        stageRewards = ST.GetStageRewards(stageMd.BaseRewards)
        stageMd.StageRewards = stageRewards
        stageMd.save()

        # grant the rewards
        # todo: apply guild bonus

        for key in stageRewards.keys():
            if key == 'gold':   RS.GrantGold(guildMd, stageRewards[key])
            if key == 'gems':   RS.GrantGems(guildMd, stageRewards[key])
            if key == 'wood':   RS.GrantWood(guildMd, stageRewards[key])
            if key == 'stone':  RS.GrantStone(guildMd, stageRewards[key])
            if key == 'iron':   RS.GrantIron(guildMd, stageRewards[key])

        # display all room results

        # stageMd = GM.GuildStage.objects.GetOrNone(GuildFK=guildMd, Heist=heist, StageNo=stageNo)
        # roomRewards = stageMd.RoomRewards

    return thiefDx, nextStep, stageRewards

def AttachDisplayData(roomRewards, stageRewards):

    # assemble display for frontend

    roomTotal = {}
    for rm in roomRewards:
        if not rm: break
        for key in rm.keys():
            if key == 'gold':   roomTotal['gold'] = roomTotal.get('gold', 0) + rm['gold']
            if key == 'gems':   roomTotal['gems'] = roomTotal.get('gems', 0) + rm['gems']

    fullRewards = []

    material = 'gold'
    if material in stageRewards or material in roomTotal:
        fullRewards.append({
            'type': material, 
            'fullAmount': stageRewards.get(material, 0) + roomTotal.get(material, 0),
            'textOne': f"{roomTotal[material]} collected" if material in roomTotal else None,
            'textTwo': None,
        })

    material = 'gems'
    if material in stageRewards or material in roomTotal:
        fullRewards.append({
            'type': material, 
            'fullAmount': stageRewards.get(material, 0) + roomTotal.get(material, 0),
            'textOne': f"{roomTotal[material]} collected" if material in roomTotal else None,
            'textTwo': None,
        })

    material = 'wood'
    if material in stageRewards:
        fullRewards.append({
            'type': material, 
            'fullAmount': stageRewards.get(material, 0),
            'textOne': None,
            'textTwo': None,
        })

    material = 'stone'
    if material in stageRewards:
        fullRewards.append({
            'type': material, 
            'fullAmount': stageRewards.get(material, 0),
            'textOne': None,
            'textTwo': None,
        })

    material = 'iron'
    if material in stageRewards:
        fullRewards.append({
            'type': material, 
            'fullAmount': stageRewards.get(material, 0),
            'textOne': None,
            'textTwo': None,
        })

    return roomRewards, fullRewards

