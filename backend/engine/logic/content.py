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
    lastBackground = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.Heist = 'tower'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate
        newStage.RoomTypes = []
        newStage.CompleteRooms = []
        newStage.BackgroundRoomBias = []
        background = ST.StageBackground(lastBackground)
        newStage.Background = background
        lastBackground = background

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])
        newStage.RoomTypes.append(roomType)
        newStage.CompleteRooms.append(False)
        newStage.BackgroundRoomBias.append(random.randint(0,1))
        newStage.ObstaclesR1 = obstacles

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])
            newStage.RoomTypes.append(roomType)
            newStage.CompleteRooms.append(False)
            newStage.BackgroundRoomBias.append(random.randint(0,1))
            newStage.ObstaclesR2 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.CompleteRooms.append(None)
            newStage.BackgroundRoomBias.append(None)

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])
            newStage.RoomTypes.append(roomType)
            newStage.CompleteRooms.append(False)
            newStage.BackgroundRoomBias.append(random.randint(0,1))
            newStage.ObstaclesR3 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.CompleteRooms.append(None)
            newStage.BackgroundRoomBias.append(None)

        # room 4

        if st['LevelR4']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR4'], st['ObstaclesR4'])
            newStage.RoomTypes.append(roomType)
            newStage.CompleteRooms.append(False)
            newStage.BackgroundRoomBias.append(random.randint(0,1))
            newStage.ObstaclesR4 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.CompleteRooms.append(None)
            newStage.BackgroundRoomBias.append(None)

        # room 5

        if st['LevelR5']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR5'], st['ObstaclesR5'])
            newStage.RoomTypes.append(roomType)
            newStage.CompleteRooms.append(False)
            newStage.BackgroundRoomBias.append(random.randint(0,1))
            newStage.ObstaclesR5 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.CompleteRooms.append(None)
            newStage.BackgroundRoomBias.append(None)

        newStage.save()

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='tower').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs



def GetOrCreateTrial(guildMd, currDate):
    
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


def GetOrCreateRaid(guildMd, currDate):
    pass

def GetOrCreateDungeon(guildMd, currDate):
    pass

def GetOrCreateCampaign(guildMd, currDate):
    pass



def AttachObstacleDisplay(obstacleLs):

    for ob in obstacleLs:

        obstType = 'Trap' 
        if ob['Failure'] == 'knockout': obstType = 'Enemy'
        if 'next' in ob['Success']: obstType = 'Passage'
        if ob['Failure'] == 'pass': obstType = 'Favor'
        ob['Type'] = obstType

        dmgMin = ob['Damage'] - int(ob['Damage'] /2)
        dmgMax = ob['Damage'] + int(ob['Damage'] /2)
        ob['DisplayDamage'] = f"{dmgMin}-{dmgMax}"

        ob['IconCode'] = None

    return obstacleLs

def AttachDisplayData(stageLs):

    for st in stageLs:

        trapLevels = []
        numberObstacles = []
        complete = True
        roomCount = 0

        obstLs = st['ObstaclesR1']
        st['ObstaclesR1'] = AttachObstacleDisplay(obstLs)
        trapLevels.append(obstLs[0]['Level'])
        numberObstacles.append(len(obstLs))
        if st['CompleteRooms'][0] == False: complete = False
        roomCount += 1

        try:
            obstLs = st['ObstaclesR2']
            st['ObstaclesR2'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            if st['CompleteRooms'][1] == False: complete = False
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR3']
            st['ObstaclesR3'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            if st['CompleteRooms'][2] == False: complete = False
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR4']
            st['ObstaclesR4'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            if st['CompleteRooms'][3] == False: complete = False
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR5']
            st['ObstaclesR5'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            if st['CompleteRooms'][4] == False: complete = False
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        st['ObstLevels'] = trapLevels
        st['ObstCount'] = numberObstacles
        st['StageComplete'] = complete
        st['NumberRooms'] = roomCount

    return stageLs

