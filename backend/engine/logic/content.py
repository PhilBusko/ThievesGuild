"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE CONTENT
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random, json
import pandas as PD
import app_proj.notebooks as NT

import emporium.models as EM 
import emporium.logic.stage as ST
import engine.models as GM 


def GetOrCreateTower(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='tower', CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create when update needed

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='tower').delete()

    rawStages = list(EM.GothicTower.objects.filter(Keep=guildMd.KeepLevel).values())
    lastType = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.Heist = 'tower'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])

        newStage.ObstaclesR1 = json.dumps(obstacles)
        newStage.CompleteR1 = False
        newStage.TypeR1 = roomType

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])

            newStage.ObstaclesR2 = json.dumps(obstacles)
            newStage.CompleteR2 = False
            newStage.TypeR2 = roomType

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])

            newStage.ObstaclesR3 = json.dumps(obstacles)
            newStage.CompleteR3 = False
            newStage.TypeR3 = roomType

        newStage.save()

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='tower').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs


def GetOrCreateTrial(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='trial', CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create when update needed

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='trial').delete()

    rawStages = list(EM.GothicTower.objects.filter(Keep=guildMd.KeepLevel).values())
    lastType = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.Heist = 'trial'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])

        newStage.ObstaclesR1 = json.dumps(obstacles)
        newStage.CompleteR1 = False
        newStage.TypeR1 = roomType

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])

            newStage.ObstaclesR2 = json.dumps(obstacles)
            newStage.CompleteR2 = False
            newStage.TypeR2 = roomType

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])

            newStage.ObstaclesR3 = json.dumps(obstacles)
            newStage.CompleteR3 = False
            newStage.TypeR3 = roomType

        newStage.save()

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='trial').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs


def GetOrCreateRaid(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='raid', CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create when update needed

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='raid').delete()

    rawStages = list(EM.GothicTower.objects.filter(Keep=guildMd.KeepLevel).values())
    lastType = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.Heist = 'raid'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])

        newStage.ObstaclesR1 = json.dumps(obstacles)
        newStage.CompleteR1 = False
        newStage.TypeR1 = roomType

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])

            newStage.ObstaclesR2 = json.dumps(obstacles)
            newStage.CompleteR2 = False
            newStage.TypeR2 = roomType

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])

            newStage.ObstaclesR3 = json.dumps(obstacles)
            newStage.CompleteR3 = False
            newStage.TypeR3 = roomType

        newStage.save()

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='raid').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs


def GetOrCreateDungeon(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='dungeon', CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create when update needed

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='dungeon').delete()

    rawStages = list(EM.GothicTower.objects.filter(Keep=guildMd.KeepLevel).values())
    lastType = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.Heist = 'dungeon'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])

        newStage.ObstaclesR1 = json.dumps(obstacles)
        newStage.CompleteR1 = False
        newStage.TypeR1 = roomType

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])

            newStage.ObstaclesR2 = json.dumps(obstacles)
            newStage.CompleteR2 = False
            newStage.TypeR2 = roomType

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])

            newStage.ObstaclesR3 = json.dumps(obstacles)
            newStage.CompleteR3 = False
            newStage.TypeR3 = roomType

        newStage.save()

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='dungeon').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs


def GetOrCreateCampaign(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='campaign', CreateDate=currDate
        ).values()

    if checkStages:
        stageDf = PD.DataFrame(checkStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
        stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
        stageLs = NT.DataframeToDicts(stageDf)
        return stageLs

    # create when update needed

    GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='campaign').delete()

    rawStages = list(EM.GothicTower.objects.filter(Keep=guildMd.KeepLevel).values())
    lastType = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.Heist = 'campaign'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])

        newStage.ObstaclesR1 = json.dumps(obstacles)
        newStage.CompleteR1 = False
        newStage.TypeR1 = roomType

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])

            newStage.ObstaclesR2 = json.dumps(obstacles)
            newStage.CompleteR2 = False
            newStage.TypeR2 = roomType

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])

            newStage.ObstaclesR3 = json.dumps(obstacles)
            newStage.CompleteR3 = False
            newStage.TypeR3 = roomType

        newStage.save()

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='campaign').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs



def AttachDisplayData(stageLs):

    for st in stageLs:

        # print(st)

        complete = True
        obstLs = json.loads(st['ObstaclesR1'])
        st['TrapsR1'] = len(obstLs)
        st['LevelR1'] = obstLs[0]['Level']
        if st['CompleteR1'] == False: complete = False

        try:
            obstLs = json.loads(st['ObstaclesR2'])
            st['TrapsR2'] = len(obstLs)
            st['LevelR2'] = obstLs[0]['Level']
            if st['CompleteR2'] == False: complete = False
        except:
            pass

        try:
            obstLs = json.loads(st['ObstaclesR3'])
            st['TrapsR3'] = len(obstLs)
            st['LevelR3'] = obstLs[0]['Level']
            if st['CompleteR3'] == False: complete = False
        except:
            pass

        try:
            obstLs = json.loads(st['ObstaclesR4'])
            st['TrapsR4'] = len(obstLs)
            st['LevelR4'] = obstLs[0]['Level']
            if st['CompleteR4'] == False: complete = False
        except:
            pass

        try:
            obstLs = json.loads(st['ObstaclesR5'])
            st['TrapsR5'] = len(obstLs)
            st['LevelR5'] = obstLs[0]['Level']
            if st['CompleteR5'] == False: complete = False
        except:
            pass

        st['CompleteStage'] = complete

    return stageLs

