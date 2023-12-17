"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE CONTENT
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random, json

import emporium.models as EM 
import emporium.logic.stage as SG
import engine.models as GM 


def SetTestRamp(guildMd):

    # wipe previous day
    GM.GuildRamp.objects.filter(GuildFK=guildMd).delete()

    rawStages = EM.TestRamp.objects.filter(World=1).values()
    lastType = ''

    for st in rawStages:

        newStage = GM.GuildRamp()
        newStage.GuildFK = guildMd
        newStage.StageNo = st['StageNo']

        # stage 1 

        stageType = SG.TowerStageType()
        if 'biased' in stageType and 'biased' in lastType:   
            stageType = 'balanced'
        lastType = stageType

        if stageType == 'balanced':
            potentialLs = SG.GetObstacleTable(st['LevelR1'],2,1,1,1)
            obstacleLs = SG.ObstacleSequence(potentialLs, st['ObstaclesR1'], 'balanced')
    
        else:
            if 'agi' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR1'],2,3,1,1)
            if 'cun' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR1'],2,1,3,1)
            if 'mig' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR1'],2,1,1,3)
            obstacleLs = SG.ObstacleSequence(potentialLs, st['ObstaclesR1'], 'biased')

        newStage.ObstaclesR1 = json.dumps(obstacleLs)
        newStage.TypeR1 = stageType
        newStage.CompleteR1 = False

        newStage.save()


def SetGuildTower(guildMd):

    # wipe previous day
    GM.GuildTower.objects.filter(GuildFK=guildMd).delete()

    # TODO: set the world based on the campaign?
    rawStages = EM.GothicTower.objects.filter(World=1).values()
    lastType = ''

    for st in rawStages:

        newStage = GM.GuildTower()
        newStage.GuildFK = guildMd
        newStage.StageNo = st['StageNo']

        # stage 1 

        stageType = SG.TowerStageType()
        if 'biased' in stageType and 'biased' in lastType:   
            stageType = 'balanced'
        lastType = stageType

        if stageType == 'balanced':
            potentialLs = SG.GetObstacleTable(st['LevelR1'],4,2,2,2)
            obstacleLs = SG.ObstacleSequence(potentialLs, st['ObstaclesR1'], 'balanced')

        else:
            if 'agi' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR1'],2,3,1,1)
            if 'cun' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR1'],2,1,3,1)
            if 'mig' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR1'],2,1,1,3)
            obstacleLs = SG.ObstacleSequence(potentialLs, st['ObstaclesR1'], 'biased')

        newStage.ObstaclesR1 = json.dumps(obstacleLs)
        newStage.CompleteR1 = False
        newStage.TypeR1 = stageType

        # stage 2

        if st['ObstaclesR2']:
            stageType = SG.TowerStageType()
            if 'biased' in stageType and 'biased' in lastType:   
                stageType = 'balanced'
            lastType = stageType

            if stageType == 'balanced':
                potentialLs = SG.GetObstacleTable(st['LevelR2'],2,1,1,1)
                obstacleLs = SG.ObstacleSequence(potentialLs, st['ObstaclesR2'], 'balanced')

            else:
                if 'agi' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR2'],2,3,1,1)
                if 'cun' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR2'],2,1,3,1)
                if 'mig' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR2'],2,1,1,3)
                obstacleLs = SG.ObstacleSequence(potentialLs, st['ObstaclesR2'], 'biased')

            newStage.ObstaclesR2 = json.dumps(obstacleLs)
            newStage.CompleteR2 = False
            newStage.TypeR2 = stageType

        # stage 3

        if st['ObstaclesR3']:
            stageType = SG.TowerStageType()
            if 'biased' in stageType and 'biased' in lastType:   
                stageType = 'balanced'
            lastType = stageType

            if stageType == 'balanced':
                potentialLs = SG.GetObstacleTable(st['LevelR3'],2,1,1,1)
                obstacleLs = SG.ObstacleSequence(potentialLs, st['ObstaclesR3'], 'balanced')

            else:
                if 'agi' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR3'],2,3,1,1)
                if 'cun' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR3'],2,1,3,1)
                if 'mig' in stageType: potentialLs = SG.GetObstacleTable(st['LevelR3'],2,1,1,3)
                obstacleLs = SG.ObstacleSequence(potentialLs, st['ObstaclesR3'], 'biased')

            newStage.ObstaclesR3 = json.dumps(obstacleLs)
            newStage.CompleteR3 = False
            newStage.TypeR3 = stageType

        newStage.save()


def SetGuildTrial(guildMd):
    pass


def SetCommonWares(guildMd):
    pass

 
def SetMagicMarket(guildMd):
    pass


def SetGuildAssets(guildMd):
    pass

