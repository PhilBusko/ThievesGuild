"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE LAUNCHER
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import json, random, math

import emporium.models as EM 
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
        woundsRoll = 0

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
                'rollParams':   {   'roll': naturalRoll,
                                    'traitBonus': traitBonus,
                                    'skillBonus': skillBonus,
                                    'result': currentResult,
                                    'trait': currentObs['Trait'],
                                    'skill': currentObs['Skill'], 
                                    'difficulty': currentObs['Difficulty'],
                                },
                'reward': reward,
                'woundsAction': woundsRoll,
                'woundsTotal': thiefWounds,
            })

        else:
            woundsCombat = 0
            woundsEnemy = 0
            thiefRolls = 1
            enemyRolls = 1

            rollParamLs = []

            while thiefWounds < thiefMd.Health and woundsEnemy < currentObs['Health']:

                # player attack

                rollPool = []
                for rg in range(0, thiefRolls):
                    rollPool.append(random.randint(1, 20))
                naturalRoll = max(rollPool)

                woundsRoll = 0
                if naturalRoll + thiefMd.Attack >= currentObs['Defense']:
                    woundsRoll = ST.RollDamage(thiefMd.Damage)
                    woundsEnemy += woundsRoll
                    thiefRolls = 1
                else:
                    thiefRolls += 1

                rollParamLs.append({
                    'attacker': 'thief',
                    'roll': naturalRoll,
                    'attack': thiefMd.Attack,
                    'result': naturalRoll + thiefMd.Attack,
                    'defense': currentObs['Defense'],
                    'woundsRoll': woundsRoll,
                    'woundsTotal': woundsEnemy,
                })

                # if enemy lives, they attack

                if woundsEnemy < currentObs['Health']:

                    rollPool = []
                    for rg in range(0, enemyRolls):
                        rollPool.append(random.randint(1, 20))
                    naturalRoll = max(rollPool)

                    woundsRoll = 0
                    if naturalRoll + currentObs['Attack'] >= thiefMd.Defense:
                        woundsRoll = ST.RollDamage(currentObs['Damage'])
                        woundsCombat += woundsRoll
                        thiefWounds += woundsRoll
                        enemyRolls = 1
                    else:
                        enemyRolls += 1

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
                'woundsAction': woundsCombat,
                'woundsTotal': thiefWounds,
            })

    return resultLs

def GetLandingRewards(pActions):
    rewardDx = {}
    for ac in pActions:
        reward = ac['reward']
        if reward:
            if 'xp' in reward:      rewardDx['xp'] = rewardDx.get('xp', 0) + int(reward.split(' ')[1])
            if 'gold' in reward:    rewardDx['gold'] = rewardDx.get('gold', 0) + int(reward.split(' ')[1])
            if 'gems' in reward:    rewardDx['gems'] = rewardDx.get('gems', 0) + int(reward.split(' ')[1])
    return rewardDx

def ThiefResults(stageMd):

    # this runs on win or loss
    # either way release all thieves to injuries or ready

    assigned = []
    for nt, thId in enumerate(stageMd.Assignments):

        if thId:
            thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thId)

            # apply results to thief

            actions = stageMd.Actions[nt]
            wounds = 0
            xpReward = 0
            if actions:
                xpReward = GetLandingRewards(actions).get('xp', 0)
                RS.GrantExperience(thiefMd, xpReward)
                wounds = actions[-1]['woundsTotal']

            status, cooldown = RS.ApplyWounds(thiefMd, wounds)

            # return thief display for aftermath

            thiefDx = thiefMd.__dict__
            dropCols = ['_state', 'GuildFK_id', 'PowerBase', 'CooldownExpire',
                        'BaseAgi', 'BaseCun', 'BaseMig', 'BaseEnd', 
                        'TrainedAgi', 'TrainedCun', 'TrainedMig', 'TrainedEnd',
                        'Agility', 'Cunning', 'Might', 'Endurance',
                        'Attack', 'Damage', 'Defense', 'Sabotage', 'Perceive', 'Traverse', ]
            for dp in dropCols: thiefDx.pop(dp)

            thiefDx['Experience'] = thiefDx['Experience'] - xpReward        # the reward is already on thief
            thiefDx['ExpReward'] = xpReward
            thiefDx['ExpNextLevel'] = GD.GetNextLevelXp(thiefMd.Level)
            thiefDx['Wounds'] = wounds
            thiefDx['Status'] = status
            thiefDx['Cooldown'] = cooldown
            assigned.append( thiefDx )
        else:
            assigned.append( None )

    return assigned

def DefeatMaterialResults(stageMd, guildMd):

    # sum the landings that have an assignment

    totalLanding = {}

    for nt, sn in enumerate(stageMd.Assignments):
        if sn:
            actions = stageMd.Actions[nt]
            if actions:
                rewards = GetLandingRewards(actions)

                for rw in rewards:
                    if rw != 'xp':
                        totalLanding[rw] = totalLanding.get(rw, 0) + rewards[rw]

    # guild bonus

    guildBonus = {}

    # apply rewards to guild

    totalMaterial = {}
    mats = ['gold', 'stone', 'gems']
    for mt in mats:
        totalMaterial[mt] = totalLanding.get(mt, 0) + guildBonus.get(mt, 0)

    RS.GrantGold(guildMd, totalMaterial['gold'])
    RS.GrantStone(guildMd, totalMaterial['stone'])
    RS.GrantGems(guildMd, totalMaterial['gems'])

    # format display for aftermath

    fullRewards = []
    for mt in mats:
        if mt in totalMaterial:
            fullRewards.append({
                'type': mt, 
                'fullAmount': totalMaterial.get(mt, 0),
                'textOne': f"{totalLanding[mt]} collected" if mt in totalLanding else None,
                'textTwo': None,
            })

    return fullRewards

def VictoryMaterialResults(stageMd, guildMd):

    # stage win rewards

    totalBase = ST.GetStageRewards(stageMd.BaseRewards)

    # sum the landings that have an assignment

    totalLanding = {}

    for nt, sn in enumerate(stageMd.Assignments):
        if sn:
            actions = stageMd.Actions[nt]
            rewards = GetLandingRewards(actions)
            stageMd.LandingRewards[nt] = rewards        # save the current rewards

            for rw in rewards:
                if rw != 'xp':
                    totalLanding[rw] = totalLanding.get(rw, 0) + rewards[rw]

    # guild bonus applies to base + landing ?

    guildBonus = {}

    # apply rewards to guild

    totalMaterial = {}
    mats = ['gold', 'stone', 'gems']
    for mt in mats:
        totalMaterial[mt] = totalBase.get(mt, 0) + totalLanding.get(mt, 0) + guildBonus.get(mt, 0)

    RS.GrantGold(guildMd, totalMaterial['gold'])
    RS.GrantStone(guildMd, totalMaterial['stone'])
    RS.GrantGems(guildMd, totalMaterial['gems'])

    # format display for aftermath

    fullRewards = []
    for mt in mats:
        if mt in totalMaterial:
            fullRewards.append({
                'type': mt, 
                'fullAmount': totalMaterial.get(mt, 0),
                'textOne': f"{totalLanding[mt]} collected" if mt in totalLanding else None,
                'textTwo': None,
            })

    # save and return

    stageMd.StageRewards = fullRewards
    stageMd.save()

    return fullRewards


def RunExpedition(expeditionMd):

    passed = 0
    trapMd = EM.Trap.objects.filter(Level=expeditionMd.Level).order_by('Difficulty')[0]
    diffTarget = trapMd.Difficulty

    thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=expeditionMd.ThiefFK_id)

    expTemplate = EM.ExpeditionType.objects.GetOrNone(Type=expeditionMd.BaseType)

    # main trait
    # range(begin, end +1)

    bias = 1    # bias=0 : pass 18; b=1 : pass 27

    if expTemplate.MainTrait == 'agi': bonus = thiefMd.Agility
    if expTemplate.MainTrait == 'cun': bonus = thiefMd.Cunning
    if expTemplate.MainTrait == 'mig': bonus = thiefMd.Might
    if expTemplate.MainTrait == 'end': bonus = thiefMd.Endurance

    for rg in range(1, 7 +bias +bias +bias):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    # secondary traits

    if expTemplate.SecondaryOne == 'agi': bonus = thiefMd.Agility
    if expTemplate.SecondaryOne == 'cun': bonus = thiefMd.Cunning
    if expTemplate.SecondaryOne == 'mig': bonus = thiefMd.Might
    if expTemplate.SecondaryOne == 'end': bonus = thiefMd.Endurance

    for rg in range(1, 3 +bias):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    if expTemplate.SecondaryTwo == 'agi': bonus = thiefMd.Agility
    if expTemplate.SecondaryTwo == 'cun': bonus = thiefMd.Cunning
    if expTemplate.SecondaryTwo == 'mig': bonus = thiefMd.Might
    if expTemplate.SecondaryTwo == 'end': bonus = thiefMd.Endurance

    for rg in range(1, 3 +bias):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    if expTemplate.SecondaryThree == 'agi': bonus = thiefMd.Agility
    if expTemplate.SecondaryThree == 'cun': bonus = thiefMd.Cunning
    if expTemplate.SecondaryThree == 'mig': bonus = thiefMd.Might
    if expTemplate.SecondaryThree == 'end': bonus = thiefMd.Endurance

    for rg in range(1, 3 +bias):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    # skills
    # compare with simulation.AttachWargear and resource.SetThiefTotals

    if 'att' in expTemplate.SkillOne:
        bonus = thiefMd.Attack - thiefMd.Agility 
        bonus += thiefMd.Damage - thiefMd.Cunning - 6
        bonus += thiefMd.Defense - thiefMd.Might - 11
    else:
        bonus = 0
        if 'sab' in expTemplate.SkillOne: bonus += thiefMd.Sabotage
        if 'per' in expTemplate.SkillOne: bonus += thiefMd.Perceive
        if 'tra' in expTemplate.SkillOne: bonus += thiefMd.Traverse
    for rg in range(1, 3 +bias):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    if 'att' in expTemplate.SkillTwo:
        bonus = thiefMd.Attack - thiefMd.Agility 
        bonus += thiefMd.Damage - thiefMd.Cunning - 6
        bonus += thiefMd.Defense - thiefMd.Might - 11
    else:
        bonus = 0
        if 'sab' in expTemplate.SkillTwo: bonus += thiefMd.Sabotage
        if 'per' in expTemplate.SkillTwo: bonus += thiefMd.Perceive
        if 'tra' in expTemplate.SkillTwo: bonus += thiefMd.Traverse
    for rg in range(1, 3 +bias):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    if 'att' in expTemplate.SkillThree:
        bonus = thiefMd.Attack - thiefMd.Agility 
        bonus += thiefMd.Damage - thiefMd.Cunning - 6
        bonus += thiefMd.Defense - thiefMd.Might - 11
    else:
        bonus = 0
        if 'sab' in expTemplate.SkillThree: bonus += thiefMd.Sabotage
        if 'per' in expTemplate.SkillThree: bonus += thiefMd.Perceive
        if 'tra' in expTemplate.SkillThree: bonus += thiefMd.Traverse
    for rg in range(1, 3 +bias):
        roll = random.randint(1, 20)
        if roll + bonus >= diffTarget: passed += 1

    return passed

def ExpeditionResults(throne, expMd, runResults):

    # get the relative challenge of the expedition

    levels = EM.ExpeditionLevel.objects.filter(Throne=throne).order_by('Level')
    challenge = 'normal' if expMd.Level == levels[0].Level else 'advanced'

    # create the expedition rewards

    resDx = {'passed': runResults}

    if runResults >= 19:
        resDx['grade'] = 'A'
        rewardDx = GenerateBlueprint(throne, None)
        resDx['reward'] = rewardDx

        if challenge == 'advanced':
            resDx['reward2'] = GenerateBlueprint(throne, rewardDx)

    elif runResults >= 17:
        resDx['grade'] = 'B'
        rewardDx = GenerateMaterial(throne, None)
        resDx['reward'] = rewardDx

        if challenge == 'advanced':
            resDx['reward2'] = GenerateMaterial(throne, rewardDx)

    elif runResults == 15:
        resDx['grade'] = 'C'
        resDx['reward'] = {
            'category': 'nothing',
            'resourceId': 'nothing',
            'title': 'Expedition Failure',
            'iconCode': None,
            'value': 'No Reward',
        }

    else:
        resDx['grade'] = 'D'
        thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=expMd.ThiefFK.id)
        thiefLevel = EM.ThiefLevel.objects.GetOrNone(Level=thiefMd.Level)
        resDx['reward'] = {
            'category': 'injury',
            'resourceId': 'injury',
            'title': 'Expedition Failure',
            'iconCode': None,
            'value': f"Injured - {thiefLevel.KnockedOutPeriod}",
        }

    # experience reward

    traps = EM.Trap.objects.filter(World=throne)
    baseXp = traps[0].Experience
    resDx['xp'] = baseXp * 8 * 2

    return resDx

def GenerateBlueprint(throne, existingDx):

    # generate the base reward 

    randType = 'item'
    randTypeNo = random.randint(1, 10)
    if randTypeNo >= 9:         # 30% chance
        randType = 'thief'

    # thief S2 only unlocks at T4
    if throne <= 3: randType = 'item'

    if randType == 'item':
        blueprint = list(EM.UnlockableItem.objects.filter(Throne=throne, MagicLv__gte=1).values('ResourceId'))
        rand = random.choice(blueprint)
        resId = rand['ResourceId']

        while existingDx and resId == existingDx['resourceId']:
            rand = random.choice(blueprint)
            resId = rand['ResourceId']

    else:
        unlockThrn = 2
        if throne >= 4 and throne <= 6: unlockThrn = 4
        if throne >= 7 and throne <= 8: unlockThrn = 7
        if throne == 9: unlockThrn = 9
        blueprint = list(EM.UnlockableThief.objects.filter(UnlockThrone=unlockThrn).values('ResourceId'))
        rand = random.choice(blueprint)
        resId = rand['ResourceId']

        while existingDx and resId == existingDx['resourceId']:
            rand = random.choice(blueprint)
            resId = rand['ResourceId']

    # get more display data

    iconCode = None
    name = None
    magic = None

    if randType == 'item':
        itemMd = EM.UnlockableItem.objects.GetOrNone(ResourceId=resId)
        
        if itemMd.Slot in ['weapon', 'armor', 'back']: stat = itemMd.Trait[:3]
        else:     stat = 'skl' if itemMd.Skill else 'cmb'
        iconCode = f"{itemMd.Slot}-{stat}-m{itemMd.MagicLv}"
        name = itemMd.Name
        magic = itemMd.Magic.title().replace(' ', ' +')

    else:
        thiefMd = EM.UnlockableThief.objects.GetOrNone(ResourceId=resId)
        iconCode = f"class-{thiefMd.Class.lower()}-s{thiefMd.Stars}"
        name = thiefMd.Class

    # return

    rewardDx = {
        'category': 'blueprint',
        'resourceId': resId,
        'title': 'Blueprint Unlocked' if not existingDx else 'Choose Blueprint',
        'iconCode': iconCode,
        'value': name,
        'magic': magic,
    }

    return rewardDx

def GenerateMaterial(throne, existingDx):

    typeLs = ['Gold', 'Stone', 'Gems']
    FACTOR = 4

    randType = random.choice(typeLs)
    resourceDx = EM.GothicTower.objects.GetOrNone(Throne=throne, StageNo=1).__dict__
    resourceDx.pop('_state')
    resId = randType.lower()

    while existingDx and resId == existingDx['resourceId']:
        randType = random.choice(typeLs)
        resourceDx = EM.GothicTower.objects.GetOrNone(Throne=throne, StageNo=1).__dict__
        resourceDx.pop('_state')
        resId = randType.lower()

    # return

    rewardDx = {
        'category': 'material',
        'resourceId': resId,
        'title': 'Material Gained' if not existingDx else 'Choose Material',
        'iconCode': randType.lower(),
        'value': f"{resourceDx[randType] * FACTOR} {randType}",
    }

    return rewardDx
