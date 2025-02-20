"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE VIEWS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import pandas as PD
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

import app_proj.notebooks as NT
import emporium.models as EM 
import emporium.logic.stage as ST
import emporium.logic.guild as GD

import engine.models as GM
import engine.logic.resource as RS
import engine.logic.castle as CS
import engine.logic.content as CT
import engine.logic.launcher as LH


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
RESOURCE VIEWS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UserAccount(request):

    userMd = request.user
    guildLs = GM.Guild.objects.filter(UserFK=userMd).values()

    if len(guildLs) > 0:
        guildDf = PD.DataFrame(guildLs)
        guildDf = guildDf.drop(['UserFK_id', 'VaultGold', 'VaultGems'], axis=1, errors='ignore')
        guildDf = guildDf.sort_values('LastPlayed', ascending=False)
        guildLs = NT.DataframeToDicts(guildDf)
        selectedName = None
        selectedLs = [x['Name'] for x in guildLs if x['Selected']]
        if len(selectedLs) > 0: selectedName = selectedLs[0]
    else:
        guildLs = []
        selectedName = None

    for gd in guildLs:
        gd['TotalPower'] = RS.GetTotalPower(gd['id'])

    userDx = {
        'Name': userMd.user_name,
        'Email': userMd.email,
        'Unique Id': userMd.unique_id,
        'Date Joined': userMd.date_joined.strftime('%Y-%b-%d'), 
        'Admin': 'Yes' if userMd.is_superuser else 'No',
        'Selected Guild': selectedName,
        'Guilds': guildLs,
    }

    userDx.update(RS.GetBlueprints(userMd))

    return Response(userDx)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ChosenGuild(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    guildDx = {}
    if guildMd:
        guildDx = guildMd.__dict__
        removeKeys = ['id', '_state', 'UserFK_id', 'Selected']
        for k in removeKeys:
            guildDx.pop(k)

        # somehow the guild gets trashed when converted to dict
        guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

        guildDx['StorageGold'] = RS.GetGoldMax(guildMd)
        guildDx['StorageStone'] = RS.GetStoneMax(guildMd)

    return Response(guildDx)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GuildInfo(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if not guildMd:
        return Response({})

    leftDx = {
        'Power': RS.GetTotalPower(guildMd),
        'Throne': RS.GetThroneLevel(guildMd),
        'Campaign': guildMd.CampaignWorld,
        'Created': guildMd.CreateDate,
    }

    middleDx = {
        'Thieves': f"{RS.GetThiefCount(guildMd)} / {RS.GetThiefMax(guildMd)}",
        'Items': RS.GetItemCount(guildMd),
        'Castle Rooms': f"{RS.GetRoomCount(guildMd)} / {RS.GetRoomMax(guildMd)}",
        'Expeditions': RS.GetExpeditionCount(guildMd),
        'Magic Store': RS.GetMagicStoreCount(guildMd),
    }

    recovery, recInfo = RS.GetRecoveryReduction(guildMd)
    hours = int(recovery.seconds/3600 % 24)
    minutes = int(recovery.seconds/60 % 60)
    seconds = recovery.seconds % 60
    if hours >= 1:      recoveryTx = f"{hours} hr"
    elif minutes >= 1:  recoveryTx = f"{minutes} min"
    else:               recoveryTx = f"{seconds} sec"

    expedition, expInfo = RS.GetExpeditionReduction(guildMd)
    hours = int(expedition.seconds/3600 % 24)
    expeditionTx = f"{hours} hr"

    rightDx = {
        'Rest Bonus': recoveryTx,
        'Expedition Bonus': expeditionTx,
        'Gold Bonus': f"{RS.GetGoldBonus(guildMd)}%",
        'Stone Bonus': f"{RS.GetStoneBonus(guildMd)}%",
        'Gems Bonus': f"+{RS.GetGemsBonus(guildMd)}",
    }

    guildDx = {
        'leftDx': leftDx,
        'middleDx': middleDx,
        'rightDx': rightDx,
    }
    return Response(guildDx)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CreateGuild(request):

    userMd = request.user
    guild = request.data.get('guildName') 

    # check name

    guilds = GM.Guild.objects.filter(UserFK=userMd)
    guildLs = list(guilds.values())
    guildCheck = [x for x in guildLs if x['Name'] == guild]

    # check to create the guild

    if len(guildCheck) == 0:

        # unselect other guilds

        for gd in guilds:
            gd.Selected = False
            gd.save()

        # create the guild

        RS.CreateNewGuild(userMd, guild)
        return Response(f"New guild {guild} created.")
    else:
        return Response(
            {'detail': 'Guild moniker presently found in the archives.'}, 
            status=status.HTTP_404_NOT_FOUND )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def SelectGuild(request):

    userMd = request.user
    guildName = request.data.get('guildName')

    guilds = GM.Guild.objects.filter(UserFK=userMd)
    for gd in guilds:
        gd.Selected = (gd.Name == guildName)
        gd.save()

    return Response(f"Charter {guildName} is selected.")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def DeleteGuild(request):

    userMd = request.user
    guild = request.data.get('guildName') 

    guildMd = GM.Guild.objects.filter(UserFK=userMd, Name=guild)[0]
    guildMd.delete()

    return Response(f"Charter {guild} has been abolished.")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def CastleDetails(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if not guildMd:
        return Response({'message': '* A guild must be chosen in the Account page.'})

    resultDx = CS.CastleDetails(guildMd)

    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CreatePermission(request):

    userMd = request.user
    roomName = request.data.get('roomName') 
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    resultDx = CS.CreatePermission(roomName, guildMd)

    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CreateRoom(request):

    userMd = request.user
    roomName = request.data.get('roomName') 
    placement = request.data.get('placement') 
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    CS.CreateRoom(roomName, placement, guildMd)

    return Response('room created')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def UpgradePermission(request):

    userMd = request.user
    placement = request.data.get('placement') 
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    resultDx = CS.UpgradePermission(placement, guildMd)

    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def UpgradeRoom(request):

    userMd = request.user
    placement = request.data.get('placement') 
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    resultDx = CS.UpgradeRoom(placement, guildMd)

    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def MoveRoom(request):

    userMd = request.user
    currentPlace = request.data.get('currentPlace') 
    targetPlace = request.data.get('targetPlace') 
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    CS.MoveRoom(guildMd, currentPlace, targetPlace)

    return Response('room moved')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def DeletePermission(request):

    userMd = request.user
    placement = request.data.get('placement') 
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    resultDx = CS.DeletePermission(guildMd, placement)

    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def DeleteRoom(request):

    userMd = request.user
    placement = request.data.get('placement') 
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    CS.DeleteRoom(guildMd, placement)

    return Response('room moved')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def TrainingDetails(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    RS.ResetInjuryCooldowns(guildMd)
    resultDx = CS.TrainingDetails(guildMd)

    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def TrainingStart(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)
    thiefId = request.data.get('thiefId')
    advance = request.data.get('advance')
    placement = request.data.get('placement')

    resultDx = CS.TrainingStart(guildMd, thiefId, advance, placement)

    return Response('training started')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CastleFinalize(request):

    userMd = request.user
    placement = request.data.get('placement')
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    CS.CastleFinalize(placement, guildMd)

    return Response('castle finalize')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ThiefDetails(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if not guildMd:
        return Response({
            'thiefLs': None,
            'message': '* A guild must be chosen in the Account page.',
        })

    RS.ResetInjuryCooldowns(guildMd)
    thiefLs = RS.GetThiefList(guildMd)

    details = {
        'thiefLs': thiefLs,
        'message': None,
    }
    return Response(details)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def VaultDetails(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if not guildMd:
        return Response({'message': '* A guild must be chosen in the Account page.'})

    details = {
        'assetLs': RS.GetAssetList(guildMd),
        'message': None,
    }
    return Response(details)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ChangeEquip(request):

    userMd = request.user
    thiefId = request.data.get('thief') 
    nextItemId = request.data.get('item')       # an id or -1 for unequip
    slot = request.data.get('slot')  

    # change or unequip

    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)
    thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thiefId)
    nextItem = GM.ItemInGuild.objects.GetOrNone(id=nextItemId)

    prevItem = GM.ItemInGuild.objects.GetOrNone(ThiefFK=thiefMd, Slot=slot)

    if prevItem:
        prevItem.ThiefFK = None
        prevItem.save()

    if nextItem:

        # is the item claimed?

        prevClaimant = None
        if nextItem.ThiefFK:
            prevClaimant = nextItem.ThiefFK

        # equip the new claimant, which unequips any previous claimant

        nextItem.ThiefFK = thiefMd
        nextItem.save()

        # reset the previous claimant when necessary

        if prevClaimant: RS.SetThiefTotals(prevClaimant)

    RS.SetThiefTotals(thiefMd)

    # refresh the frontend

    details = {
        'thiefLs': RS.GetThiefList(guildMd),
        'assetLs': RS.GetAssetList(guildMd),
        'message': None,
    }
    return Response(details)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def RetireThief(request):

    userMd = request.user
    thiefId = request.data.get('retireId')

    # any items on thief are unequipped first

    thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thiefId).delete()

    return Response({'result': 'success'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def SellItem(request):

    userMd = request.user
    sellId = request.data.get('sellId') 
    storeCost = request.data.get('storeCost')

    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    GM.ItemInGuild.objects.GetOrNone(id=sellId).delete()

    gold = int(storeCost) * 0.5
    RS.GrantGold(guildMd, gold)

    return Response({'result': 'success'})


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
CONTENT VIEWS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def DailyHeists(request):

    userMd = request.user
    guildMd = RS.PrepGuild(userMd)

    if not guildMd:
        return Response({'message': '* A guild must be chosen in the Account page.'})

    currDt = RS.TimezoneToday()

    towerStages = CT.GetOrCreateTower(guildMd, currDt)
    towerStages = CT.AttachDisplayData(towerStages)
    towerInfo = CT.GetHeistInfo(towerStages)

    trialStages = CT.GetOrCreateTrial(guildMd, currDt)
    trialStages = CT.AttachDisplayData(trialStages)
    trialInfo = CT.GetHeistInfo(trialStages)

    dungeonStages = CT.GetOrCreateDungeon(guildMd, currDt)
    dungeonStages = CT.AttachDisplayData(dungeonStages)
    dungeonInfo = CT.GetHeistInfo(dungeonStages)

    campaignStages = CT.GetOrCreateCampaign(guildMd, currDt)
    campaignStages = CT.AttachDisplayData(campaignStages)
    campaignInfo = CT.GetHeistInfo(campaignStages)

    responseDx = {
        'towerStages': towerStages,
        'trialStages': trialStages,
        'dungeonStages': dungeonStages,
        'campaignStages': campaignStages,
        'towerInfo': towerInfo,
        'trialInfo': trialInfo,
        'dungeonInfo': dungeonInfo,
        'campaignInfo': campaignInfo,
        'lastHeist': guildMd.LastHeist,
        'campaignForward': CT.GetCampaignForward(guildMd),
    }
    return Response(responseDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def SetLastHeist(request):

    userMd = request.user
    heist = request.data.get('heist')

    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)
    guildMd.LastHeist = heist
    guildMd.save()

    return Response({'success': True})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def LaunchLanding(request):

    heist = request.data.get('heist') 
    stageNo = request.data.get('stageNo')
    thieves = request.data.get('thieves')
    thieves = [x['id'] if x else None for x in thieves]

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    # if no queue, queue the stage

    queueStage = GM.GuildStage.objects.GetOrNone(GuildFK=guildMd, StageQueue=True)

    if not queueStage:

        stageMd = GM.GuildStage.objects.GetOrNone(GuildFK=guildMd, Heist=heist, StageNo=stageNo)
        stageMd.StageQueue = True
        stageMd.Assignments = thieves
        stageMd.save()

        for th in thieves:
            if not th: continue
            thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=th)
            thiefMd.Status = 'Looting'
            thiefMd.save()

        queueStage = GM.GuildStage.objects.GetOrNone(GuildFK=guildMd, StageQueue=True)

    # play the queue

    for nt in range(0, 5):

        if not queueStage.Assignments[nt]:
            continue

        if queueStage.LandingTypes[nt] and not queueStage.Actions[nt]:

            thiefId = queueStage.Assignments[nt]
            thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thiefId)    

            obstacleLs = queueStage.ObstaclesL1
            if nt == 1: obstacleLs = queueStage.ObstaclesL2
            if nt == 2: obstacleLs = queueStage.ObstaclesL3
            if nt == 3: obstacleLs = queueStage.ObstaclesL4
            if nt == 4: obstacleLs = queueStage.ObstaclesL5

            actions = LH.RunObstacles(thiefMd, obstacleLs)
            queueStage.Burgles[nt] += 1
            queueStage.Actions[nt] = actions
            queueStage.save()

        if queueStage.LandingTypes[nt] and not queueStage.LandingRewards[nt]:
            landingIdx = nt
            break

    # additional stage display data

    stageDx = queueStage.__dict__
    stageDx.pop('_state')

    minPower, trapLevels, numberObstacles, roomCount = CT.GetStageDisplay(stageDx)
    stageDx['MinPower'] = minPower
    stageDx['ObstLevels'] = trapLevels
    stageDx['ObstCount'] = numberObstacles
    stageDx['NumberRooms'] = roomCount

    assigned = []
    for thId in stageDx['Assignments']:
        if not thId:
            assigned.append( None )
        else:
            thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thId)
            thiefDx = thiefMd.__dict__
            dropCols = ['_state', 'GuildFK_id', 'PowerBase', 'CooldownExpire',
                        'BaseAgi', 'BaseCun', 'BaseMig', 'BaseEnd', 
                        'TrainedAgi', 'TrainedCun', 'TrainedMig', 'TrainedEnd', ]
            for dp in dropCols:
                thiefDx.pop(dp)
            assigned.append( thiefDx )

    resultDx = {
        'stage': stageDx,
        'assigned': assigned,
        'landingIdx': landingIdx,
        'actions': queueStage.Actions[landingIdx],
    }
    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def FinishLanding(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    queueStage = GM.GuildStage.objects.GetOrNone(GuildFK=guildMd, StageQueue=True)

    for nt in range(0, 5):
        if queueStage.LandingTypes[nt] and not queueStage.LandingRewards[nt]:
            landingIdx = nt
            break

    actions = queueStage.Actions[landingIdx]

    # procesing results is complicated
    # on defeat apply the rewards immediately
    # on win apply the results when the stage is complete

    # check for landing defeat

    if actions[-1]['posNext'] == actions[-1]['posCurr']:

        assigned = LH.ThiefResults(queueStage)
        fullRewards = LH.DefeatMaterialResults(queueStage, guildMd)

        queueStage.Assignments = [None, None, None, None, None]
        queueStage.Actions = [None, None, None, None, None]
        queueStage.StageQueue = False
        queueStage.save()

        resultDx = {
            'nextScene': 'defeat',
            'heist': queueStage.Heist,
            'stageNo': queueStage.StageNo,
            'assigned': assigned,
            'fullRewards': fullRewards,
        }
        return Response(resultDx)

    # check for win and end of stage

    elif landingIdx == 4 or queueStage.LandingTypes[landingIdx +1] == None:

        assigned = LH.ThiefResults(queueStage)
        fullRewards = LH.VictoryMaterialResults(queueStage, guildMd)

        queueStage.StageQueue = False
        queueStage.save()

        # check for end of campaign

        if queueStage.Heist == 'campaign':
            campaignStages = GM.GuildStage.objects.filter(GuildFK=guildMd, Heist='campaign')
            if queueStage.StageNo == len(campaignStages):   # StageNo is 1-based
                guildMd.CampaignWorld += 1
                guildMd.save()

        resultDx = {
            'nextScene': 'victory',
            'heist': queueStage.Heist,
            'stageNo': queueStage.StageNo,
            'assigned': assigned,
            'fullRewards': fullRewards,
        }
        return Response(resultDx)

    # check for win and go to next landing

    else:
        rewards = LH.GetLandingRewards(actions)
        queueStage.LandingRewards[landingIdx] = rewards
        queueStage.save()

        resultDx = {
            'nextScene': 'next-landing',
        }
        return Response(resultDx)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ExpeditionUpdate(request):

    userMd = request.user
    guildMd = RS.PrepGuild(userMd)

    if not guildMd:
        return Response({'message': '* A guild must be chosen in the Account page.'})

    currDt = RS.TimezoneToday()

    # remove any closed expeditions: expired or claimed from previous day

    expireLs = GM.GuildExpedition.objects.filter(GuildFK=guildMd, CreateDate__lt=currDt, ThiefFK__isnull=True)
    for ep in expireLs: ep.delete()

    claimLs = GM.GuildExpedition.objects.filter(GuildFK=guildMd, CreateDate__lt=currDt, Claimed=True)
    for ep in claimLs: ep.delete()

    # create the expeditions in slots to keep the order on the frontend

    dailySlots = RS.GetExpeditionCount(guildMd)
    for sl in range(1, dailySlots +1):
        exists = GM.GuildExpedition.objects.GetOrNone(GuildFK=guildMd, SlotNo=sl)
        if not exists:
            CT.CreateExpedition(guildMd, currDt, sl)

    # check if any expeditions have ended
    # if they have, the results are created but not claimed

    RS.ResetInjuryCooldowns(guildMd)

    expeditionLs = GM.GuildExpedition.objects.filter(GuildFK=guildMd, StartDate__isnull=False)
    currTm = RS.TimezoneToday(withTime=True)

    for ep in expeditionLs:
        endTime = ep.StartDate + PD.Timedelta(ep.Duration).to_pytimedelta()
        if endTime <= currTm and not ep.Results:
            runResults = LH.RunExpedition(ep)
            winResults = LH.ExpeditionResults(guildMd.CampaignWorld, ep, runResults)
            ep.Results = winResults                 # applied when user claims
            ep.save()

    # return the current expeditions
    # will include all previous edits of this function
    # check for reward replacements here

    expeditionLs = CT.GetExpeditions(guildMd, currTm) 
    return Response({'expeditions': expeditionLs})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ExpeditionLaunch(request):

    userMd = request.user
    guildMd = RS.PrepGuild(userMd)
    expeditionId = request.data.get('expeditionId')
    thiefId = request.data.get('thiefId')

    expToStart = GM.GuildExpedition.objects.GetOrNone(id=expeditionId)
    thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thiefId)

    # get the reduced duration

    expeditionMd = EM.ExpeditionLevel.objects.GetOrNone(Level=expToStart.Level)
    levelTm = PD.Timedelta(expeditionMd.Duration).to_pytimedelta()
    durationFinal = levelTm

    roomLs = GM.RoomInGuild.objects.filter(GuildFK=guildMd, Name='Cartographer')
    for rm in roomLs:
        if rm.Level == 0: continue
        referenceMd = EM.BasicRoom.objects.GetOrNone(Level=rm.Level)
        roomTm = PD.Timedelta(referenceMd.Cartog_Bonus).to_pytimedelta()
        durationFinal -= roomTm

    minDt = PD.Timedelta(expeditionMd.DurationMin).to_pytimedelta()
    if durationFinal < minDt:
        durationFinal = minDt

    # save values on expedition instance

    trunkNow = RS.TimezoneToday(withTime=True)

    expToStart.StartDate = trunkNow
    expToStart.ThiefFK = thiefMd
    expToStart.save()

    thiefMd.Status = 'Exploring'
    thiefMd.CooldownExpire = trunkNow + durationFinal
    thiefMd.save()

    return Response({'success': True})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ExpeditionClaim(request):

    expeditionId = request.data.get('expeditionId')
    selected = request.data.get('resultSelected')

    guildMd = GM.Guild.objects.GetOrNone(UserFK=request.user, Selected=True)
    expToClaim = GM.GuildExpedition.objects.GetOrNone(id=expeditionId)
    thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=expToClaim.ThiefFK_id)

    selectReward = expToClaim.Results['reward'] if selected == 'first' else expToClaim.Results['reward2']
    replace = CT.GetReplacement(guildMd, selectReward)

    # apply rewards to guild

    if not replace and selectReward['category'] == 'blueprint':

        if 'thief' in selectReward['resourceId']:
            newBlueprint = {
                'UserFK': guildMd.UserFK,
                'ThiefFK': EM.UnlockableThief.objects.GetOrNone(ResourceId=selectReward['resourceId']),
            }
            newModel = GM.ThiefUnlocked(**newBlueprint)
            newModel.save()

        else:
            newBlueprint = {
                'UserFK': guildMd.UserFK,
                'ItemFK': EM.UnlockableItem.objects.GetOrNone(ResourceId=selectReward['resourceId']),
            }
            newModel = GM.ItemUnlocked(**newBlueprint)
            newModel.save()

    elif not replace and selectReward['category'] == 'material':
        amount = int(selectReward['value'].split(' ')[0])
        if selectReward['resourceId'] == 'gold':        RS.GrantGold(guildMd, amount)
        if selectReward['resourceId'] == 'stone':       RS.GrantStone(guildMd, amount)
        if selectReward['resourceId'] == 'gems':        RS.GrantGems(guildMd, amount)

    elif replace:
        amount = int(replace.split(' ')[-2])
        RS.GrantGems(guildMd, amount)

    # apply results to thief

    RS.GrantExperience(thiefMd, expToClaim.Results['xp'])
    woundReduce = RS.GetRecoveryReduction(guildMd)

    if selectReward['category'] != 'injury':
        thiefMd.Status = 'Ready'
        thiefMd.CooldownExpire = None
        thiefMd.save()

    else:
        RS.ApplyWounds(thiefMd, thiefMd.Health, woundReduce)

    # mark the expedition as claimed
    # it will be wiped on the next day when the user updates the expeditions

    expToClaim.Claimed = True
    expToClaim.save()

    return Response({'success': True})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def DailyMarket(request):

    userMd = request.user
    guildMd = RS.PrepGuild(userMd)

    if not guildMd:
        return Response({'message': '* A guild must be chosen in the Account page.'})

    commonStore, dailyStore = CT.GetOrCreateMarket(userMd, guildMd)

    gemStore = [
        {'gems': 20,    'targetAmount': 340,    'targetIcon': 'material-gold', },
        {'gems': 80,    'targetAmount': 1500,   'targetIcon': 'material-gold', },
        {'gems': 150,   'targetAmount': 3200,   'targetIcon': 'material-gold', },
        {'gems': 300,   'targetAmount': 7100,   'targetIcon': 'material-gold', },
        {'gems': 20,    'targetAmount': 100,    'targetIcon': 'material-stone', },
        {'gems': 80,    'targetAmount': 440,    'targetIcon': 'material-stone', },
        {'gems': 150,   'targetAmount': 920,    'targetIcon': 'material-stone', },
        {'gems': 300,   'targetAmount': 2000,   'targetIcon': 'material-stone', },
    ]

    marketDx = {
        'commonStore': commonStore,
        'dailyStore': dailyStore,
        'gemStore': gemStore,
    }
    return Response(marketDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def BuyPermission(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)
    storeId = int(request.data.get('storeId'))

    permission = CT.BuyPermission(storeId, guildMd)

    resultDx = {
        'storeId': storeId,
        'notPermitted': permission,
    }
    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def BuyMarket(request):

    userMd = request.user
    storeId = int(request.data.get('storeId'))
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    storeMd = CT.BuyMarket(storeId, guildMd)

    resultDx = {
        'storeId': storeId,
        'bought': storeMd.Bought,
    }
    return Response(resultDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def GemExchange(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)
    gems = int(request.data.get('gems'))
    material = request.data.get('material')
    amount = int(request.data.get('amount'))

    # check permissions

    if guildMd.VaultGems < gems:
        return Response({'message': '* Gem coffers are deficient.'})

    # trade the goods

    guildMd.VaultGems -= gems
    guildMd.save()

    if 'gold' in material:  RS.GrantGold(guildMd, amount)
    if 'stone' in material:  RS.GrantStone(guildMd, amount)

    return Response({'success': True})


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
SIGNALS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
from django.db.models.signals import post_save
from django.dispatch import receiver
import members.models as MM 


@receiver(post_save, sender=MM.User, dispatch_uid='member_verified_init')
def member_verified(sender, instance, **kwargs):
    # signals trigger on webserver but not in notebooks

    # check for errors

    if instance.verified == False:
        print(instance, 'not verified')
        return

    currentGuilds = GM.Guild.objects.filter(UserFK=instance)

    if len(currentGuilds) > 0:
        print(instance, 'guilds exist')
        return

    # create the first guild
    
    newMd = GM.Guild(**{'UserFK': instance, 'Name': '123', 'Selected': True})
    newMd.save()

