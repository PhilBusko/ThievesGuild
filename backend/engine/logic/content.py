"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE CONTENT
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import pandas as PD
import app_proj.notebooks as NT

import emporium.models as EM 
import emporium.logic.stage as ST
import engine.models as GM 


def BackgroundBias():
    potential = [0, 0, 0, 1, 2, 3, 4]
    chosen = random.choice(potential)
    return chosen

def GetOrCreateTower(guildMd, currDate):

    # check for existing daily stages

    checkStages = GM.GuildStage.objects.filter(
        GuildFK=guildMd, Heist='tower', KeepLevel=guildMd.KeepLevel, CreateDate=currDate
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
        newStage.KeepLevel = guildMd.KeepLevel
        newStage.Heist = 'tower'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate
        newStage.RoomTypes = []

        newStage.BaseRewards = {
            'Gold': st['Gold'],
            'Gems': st['Gems'],
            'Wood': st['Wood'],
            'Stone': st['Stone'],
            'Iron': st['Iron'],
        }
        newStage.RoomRewards = [None, None, None, None, None]
        newStage.Assignments = [None, None, None, None, None]

        background = ST.StageBackground(lastBackground)
        lastBackground = background
        newStage.Background = background
        newStage.BackgroundBias = []

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])
        newStage.RoomTypes.append(roomType)
        newStage.BackgroundBias.append(BackgroundBias())
        newStage.ObstaclesR1 = obstacles

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR2 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR3 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 4

        if st['LevelR4']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR4'], st['ObstaclesR4'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR4 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 5

        if st['LevelR5']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR5'], st['ObstaclesR5'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR5 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

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
        GuildFK=guildMd, Heist='trial', KeepLevel=guildMd.KeepLevel, CreateDate=currDate
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
    lastBackground = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.KeepLevel = guildMd.KeepLevel
        newStage.Heist = 'trial'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate
        newStage.RoomTypes = []

        newStage.BaseRewards = {
            'Gold': st['Gold'],
            'Gems': st['Gems'],
            'Wood': st['Wood'],
            'Stone': st['Stone'],
            'Iron': st['Iron'],
        }
        newStage.RoomRewards = [None, None, None, None, None]
        newStage.Assignments = [None, None, None, None, None]

        background = ST.StageBackground(lastBackground)
        lastBackground = background
        newStage.Background = background
        newStage.BackgroundBias = []

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])
        newStage.RoomTypes.append(roomType)
        newStage.BackgroundBias.append(BackgroundBias())
        newStage.ObstaclesR1 = obstacles

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR2 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR3 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 4

        if st['LevelR4']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR4'], st['ObstaclesR4'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR4 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 5

        if st['LevelR5']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR5'], st['ObstaclesR5'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR5 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

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
        GuildFK=guildMd, Heist='raid', KeepLevel=guildMd.KeepLevel, CreateDate=currDate
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
    lastBackground = ''

    for st in rawStages:

        newStage = GM.GuildStage()
        newStage.GuildFK = guildMd
        newStage.KeepLevel = guildMd.KeepLevel
        newStage.Heist = 'raid'
        newStage.StageNo = st['StageNo']
        newStage.CreateDate = currDate
        newStage.RoomTypes = []

        newStage.BaseRewards = {
            'Gold': st['Gold'],
            'Gems': st['Gems'],
            'Wood': st['Wood'],
            'Stone': st['Stone'],
            'Iron': st['Iron'],
        }
        newStage.RoomRewards = [None, None, None, None, None]
        newStage.Assignments = [None, None, None, None, None]

        background = ST.StageBackground(lastBackground)
        lastBackground = background
        newStage.Background = background
        newStage.BackgroundBias = []

        # room 1 

        roomType = ST.RandomRoomType(lastType)
        lastType = roomType
        obstacles = ST.AssembleRoom(roomType, st['LevelR1'], st['ObstaclesR1'])
        newStage.RoomTypes.append(roomType)
        newStage.BackgroundBias.append(BackgroundBias())
        newStage.ObstaclesR1 = obstacles

        # room 2

        if st['LevelR2']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR2'], st['ObstaclesR2'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR2 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 3 

        if st['LevelR3']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR3'], st['ObstaclesR3'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR3 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 4

        if st['LevelR4']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR4'], st['ObstaclesR4'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR4 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        # room 5

        if st['LevelR5']:
            roomType = ST.RandomRoomType(lastType)
            lastType = roomType
            obstacles = ST.AssembleRoom(roomType, st['LevelR5'], st['ObstaclesR5'])
            newStage.RoomTypes.append(roomType)
            newStage.BackgroundBias.append(BackgroundBias())
            newStage.ObstaclesR5 = obstacles
        else:
            newStage.RoomTypes.append(None)
            newStage.BackgroundBias.append(None)

        newStage.save()

    # dev can create duplicate stages

    newStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='raid').values()
    stageDf = PD.DataFrame(newStages).drop(['_state', 'GuildFK_id'], axis=1, errors='ignore')
    stageDf = stageDf.drop_duplicates(subset=['StageNo']).sort_values('StageNo')
    stageLs = NT.DataframeToDicts(stageDf)

    return stageLs

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
        roomCount = 0

        obstLs = st['ObstaclesR1']
        st['ObstaclesR1'] = AttachObstacleDisplay(obstLs)
        trapLevels.append(obstLs[0]['Level'])
        numberObstacles.append(len(obstLs))
        roomCount += 1

        try:
            obstLs = st['ObstaclesR2']
            st['ObstaclesR2'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR3']
            st['ObstaclesR3'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR4']
            st['ObstaclesR4'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        try:
            obstLs = st['ObstaclesR5']
            st['ObstaclesR5'] = AttachObstacleDisplay(obstLs)
            trapLevels.append(obstLs[0]['Level'])
            numberObstacles.append(len(obstLs))
            roomCount += 1
        except:
            trapLevels.append(None)
            numberObstacles.append(None)

        st['ObstLevels'] = trapLevels
        st['ObstCount'] = numberObstacles
        st['StageComplete'] = True if st['StageRewards'] else False
        st['NumberRooms'] = roomCount

    return stageLs

