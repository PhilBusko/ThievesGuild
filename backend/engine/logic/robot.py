"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ROBOTS 
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import json, math, random
import engine.models as GM
import engine.logic.resource as RS


def RefreshEquipment(guild):

    RemoveItems(guild)

    AssignWargear(guild, 'weapon', 'Burglar')
    AssignWargear(guild, 'weapon', 'Scoundrel')
    AssignWargear(guild, 'weapon', 'Ruffian')

    AssignWargear(guild, 'armor', 'Burglar')
    AssignWargear(guild, 'armor', 'Scoundrel')
    AssignWargear(guild, 'armor', 'Ruffian')

    roll = random.randint(1,3)
    if roll == 1:
        AssignAccessory(guild, 'head')
        AssignAccessory(guild, 'hands')
        AssignAccessory(guild, 'feet')
    if roll == 2:
        AssignAccessory(guild, 'hands')
        AssignAccessory(guild, 'feet')
        AssignAccessory(guild, 'head')
    if roll == 3:
        AssignAccessory(guild, 'feet')
        AssignAccessory(guild, 'head')
        AssignAccessory(guild, 'hands')

def RemoveItems(guildMd):
    guildItems = GM.ItemInGuild.objects.filter(GuildFK=guildMd, ThiefFK__isnull=False).all()
    for gi in guildItems:
        currThief = gi.ThiefFK
        gi.ThiefFK = None
        gi.save()
        RS.SetThiefTotals(currThief)

def AssignWargear(guildMd, assignSlot, thiefClass):

    itemObs = (GM.ItemInGuild.objects
           .filter(GuildFK=guildMd, ThiefFK__isnull=True, Slot=assignSlot, Requirement=thiefClass)
           .order_by('-Power')
           .all())
    thiefObs = (GM.ThiefInGuild.objects
                .filter(GuildFK=guildMd, Class=thiefClass)
                .order_by('Power')
                .all())

    for nb, th in enumerate(thiefObs):
        if len(itemObs) > nb:
            currItem = itemObs[nb]
            currItem.ThiefFK = th
            currItem.save()
            RS.SetThiefTotals(th)

def AssignAccessory(guildMd, assignSlot):
    
    itemObs = (GM.ItemInGuild.objects
           .filter(GuildFK=guildMd, ThiefFK__isnull=True, Slot=assignSlot)
           .order_by('-Power')
           .all())
    thiefObs = (GM.ThiefInGuild.objects
                .filter(GuildFK=guildMd)
                .order_by('Power')
                .all())

    for nb, th in enumerate(thiefObs):
        if len(itemObs) > nb:
            currItem = itemObs[nb]
            currItem.ThiefFK = th
            currItem.save()
            RS.SetThiefTotals(th)

def EquipmentReport(guildMd):
    report = []

    # get equipment on thieves

    thieves = GM.ThiefInGuild.objects.filter(GuildFK=guildMd).all()
    for th in thieves:

        equipObs = GM.ItemInGuild.objects.filter(ThiefFK=th).all()
        equipTx = []
        for eq in equipObs: equipTx.append(eq.Slot)
        equipTx = ', '.join(equipTx)
        
        report.append({
            'Class': th.Class,
            'Power': th.Power,
            'Equipment': equipTx,
        })

    # get vault items

    vaultObs = GM.ItemInGuild.objects.filter(GuildFK=guildMd, ThiefFK__isnull=True).all()
    vaultDx = {}

    for vt in vaultObs:
        vaultDx[vt.Slot] = vaultDx.get(vt.Slot, 0) +1

    report.append({
        'Class': 'Vault',
        'Power': 'N/A',
        'Equipment': json.dumps(vaultDx),
    })

    return report


def ResetCooldowns(guildMd):
    # a night has gone by and all thief cooldowns are reset
    thiefObs = GM.ThiefInGuild.objects.filter(GuildFK=guildMd).all()
    for th in thiefObs:
        th.Wounds = 0
        th.Cooldown = None
        th.save()

def GetNextRamp(guildMd):
    towers = (GM.GuildRamp.objects.filter(GuildFK=guildMd)
            .filter(StageNo__gte=1)
            .exclude(CompleteR1=True)
            .order_by('StageNo').all())
    return towers[0]

def GetRampAssignments(readyThieves, runStage):

    # check there are enough thieves for stage
    
    if len(readyThieves) == 0:
        return []

    # assign thieves based on room type

    stagePlayLs = []

    if 'biased' in runStage.TypeR1:
        chosenThief = None
        for th in readyThieves:
            if 'agi' in runStage.TypeR1 and th.Class == 'Burglar':
                chosenThief = th
                break
            if 'cun' in runStage.TypeR1 and th.Class == 'Scoundrel':
                chosenThief = th
                break
            if 'mig' in runStage.TypeR1 and th.Class == 'Ruffian':
                chosenThief = th
                break
        if not chosenThief: chosenThief = readyThieves[0]
        readyThieves.remove(chosenThief)
        stagePlayLs.insert(0, {
            'thief': chosenThief,
            'room': 1,
            'obstacleResults': [],
            'roomResults': {},
        })

    if 'balanced' in runStage.TypeR1:
        chosenThief = readyThieves[0]
        readyThieves.remove(chosenThief)
        stagePlayLs.insert(0, {
            'thief': chosenThief,
            'room': 1,
            'obstacleResults': [],
            'roomResults': {},
        })
        
    return stagePlayLs




def GetNextTower(guildMd):
    towers = (GM.GuildTower.objects.filter(GuildFK=guildMd)
            .filter(StageNo__gte=1)
            .exclude(CompleteR1=True).exclude(CompleteR2=True).exclude(CompleteR3=True)
            .order_by('StageNo').all())
    return towers[0]

def GetPlayAssignments(readyThieves, runStage):

    # check there are enough thieves for stage
    
    if len(readyThieves) == 0:
        return []
        
    if runStage.ObstaclesR3 and len(readyThieves) <= 2:
        return []
    
    if runStage.ObstaclesR2 and len(readyThieves) <= 1:
        return []
    
    # assign thieves based on room type

    stagePlayLs = []

    if 'biased' in runStage.TypeR1:
        chosenThief = None
        for th in readyThieves:
            if 'agi' in runStage.TypeR1 and th.Class == 'Burglar':
                chosenThief = th
                break
            if 'cun' in runStage.TypeR1 and th.Class == 'Scoundrel':
                chosenThief = th
                break
            if 'mig' in runStage.TypeR1 and th.Class == 'Ruffian':
                chosenThief = th
                break
        if not chosenThief: chosenThief = readyThieves[0]
        readyThieves.remove(chosenThief)
        stagePlayLs.insert(0, {
            'thief': chosenThief,
            'room': 1,
            'obstacleResults': [],
            'roomResults': {},
        })

    if runStage.TypeR2 and 'biased' in runStage.TypeR2:
        chosenThief = None
        for th in readyThieves:
            if 'agi' in runStage.TypeR2 and th.Class == 'Burglar':
                chosenThief = th
                break
            if 'cun' in runStage.TypeR2 and th.Class == 'Scoundrel':
                chosenThief = th
                break
            if 'mig' in runStage.TypeR2 and th.Class == 'Ruffian':
                chosenThief = th
                break
        if not chosenThief: chosenThief = readyThieves[0]
        readyThieves.remove(chosenThief)
        stagePlayLs.insert(1, {
            'thief': chosenThief,
            'room': 2,
            'obstacleResults': [],
            'roomResults': {},
        })

    if runStage.TypeR3 and 'biased' in runStage.TypeR3:
        chosenThief = None
        for th in readyThieves:
            if 'agi' in runStage.TypeR3 and th.Class == 'Burglar':
                chosenThief = th
                break
            if 'cun' in runStage.TypeR3 and th.Class == 'Scoundrel':
                chosenThief = th
                break
            if 'mig' in runStage.TypeR3 and th.Class == 'Ruffian':
                chosenThief = th
                break
        if not chosenThief: chosenThief = readyThieves[0]
        readyThieves.remove(chosenThief)
        stagePlayLs.insert(2, {
            'thief': chosenThief,
            'room': 3,
            'obstacleResults': [],
            'roomResults': {},
        })

    if 'balanced' in runStage.TypeR1:
        chosenThief = readyThieves[0]
        readyThieves.remove(chosenThief)
        stagePlayLs.insert(0, {
            'thief': chosenThief,
            'room': 1,
            'obstacleResults': [],
            'roomResults': {},
        })
        
    if runStage.TypeR2 and 'balanced' in runStage.TypeR2:
        chosenThief = readyThieves[0]
        readyThieves.remove(chosenThief)
        stagePlayLs.insert(1, {
            'thief': chosenThief,
            'room': 2,
            'obstacleResults': [],
            'roomResults': {},
        })

    if runStage.TypeR3 and 'balanced' in runStage.TypeR3:
        chosenThief = readyThieves[0]
        readyThieves.remove(chosenThief)
        stagePlayLs.insert(2, {
            'thief': chosenThief,
            'room': 3,
            'obstacleResults': [],
            'roomResults': {},
        })

    return stagePlayLs

