"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE VIEWS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import pandas as PD
from django.utils import timezone
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
import engine.logic.content as CT
import engine.logic.launcher as LH


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
RESOURCE VIEWS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UserAccount(request):

    userMd = request.user
    guilds = GM.Guild.objects.filter(UserFK=userMd)
    guildLs = list(guilds.values())

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

    userDx = {
        'Name': userMd.user_name,
        'Email': userMd.email,
        'Unique Id': userMd.unique_id,
        'Date Joined': userMd.date_joined.strftime('%Y-%b-%d'), 
        'Admin': 'Yes' if userMd.is_superuser else 'No',
        'Selected Guild': selectedName,
        'Guilds': guildLs,
    }
    return Response(userDx)

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

        response = RS.CreateNewGuild(userMd, guild)
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
def ThiefDetails(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if not guildMd:
        return Response({
            'thiefLs': None,
            'message': '* A guild must be chosen in the Account page.',
        })

    RS.ResetInjuryCooldowns(guildMd)
    thiefDf = RS.GetThiefList(guildMd)
    thiefDf = thiefDf.sort_values(by=['Class', 'Power'], ascending=[True, False])

    details = {
        'thiefLs': NT.DataframeToDicts(thiefDf),
        'message': None,
    }
    return Response(details)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def VaultDetails(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if not guildMd:
        return Response({
            'assetLs': None,
            'message': '* A guild must be chosen in the Account page.',
        })

    assetDf = RS.GetAssetList(guildMd)

    details = {
        'assetLs': NT.DataframeToDicts(assetDf),
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
    RS.SetGuildTotals(guildMd)

    # refresh the frontend

    thiefDf = RS.GetThiefList(guildMd)
    assetDf = RS.GetAssetList(guildMd)

    details = {
        'thiefLs': NT.DataframeToDicts(thiefDf),
        'assetLs': NT.DataframeToDicts(assetDf),
        'message': None,
    }
    return Response(details)


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
CONTENT VIEWS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def DailyHeists(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if not guildMd:
        return Response({'message': '* A guild must be chosen in the Account page.'})

    currDt = timezone.now()
    currDate = f"{currDt.year}-{str(currDt.month).zfill(2)}-{str(currDt.day).zfill(2)}"

    tower = CT.GetOrCreateTower(guildMd, currDate)
    tower = CT.AttachDisplayData(tower)

    trial = CT.GetOrCreateTrial(guildMd, currDate)
    trial = CT.AttachDisplayData(trial)

    dungeon = CT.GetOrCreateDungeon(guildMd, currDate)
    dungeon = CT.AttachDisplayData(dungeon)

    campaign = CT.GetOrCreateCampaign(guildMd, currDate)
    campaign = CT.AttachDisplayData(campaign)

    responseDx = {
        'tower': tower,
        'trial': trial,
        'dungeon': dungeon,
        'campaign': campaign,
        'message': None,
    }
    return Response(responseDx)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def LaunchRoom(request):

    userMd = request.user
    heist = request.data.get('heist') 
    stageNo = request.data.get('stageNo')
    roomNo = request.data.get('roomNo')         # 1 based
    thiefId = request.data.get('thiefId')

    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)
    stageMd = GM.GuildStage.objects.GetOrNone(GuildFK=guildMd, Heist=heist, StageNo=stageNo)
    thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thiefId)    

    obstacleLs = stageMd.ObstaclesR1
    if roomNo == 2: obstacleLs = stageMd.ObstaclesR2
    if roomNo == 3: obstacleLs = stageMd.ObstaclesR3
    if roomNo == 4: obstacleLs = stageMd.ObstaclesR4
    if roomNo == 5: obstacleLs = stageMd.ObstaclesR5

    results = LH.RunObstacles(thiefMd, obstacleLs)
    results = LH.AttachCombatDisplay(results)

    thiefDx, nextStep, stageRewards = LH.RunResults(guildMd, thiefMd, roomNo, stageMd, obstacleLs, results)

    roomRewards, fullRewards = LH.AttachDisplayData(stageMd.RoomRewards, stageRewards)

    resultDx = {
        'roomNo': roomNo,
        'actions': results,
        'nextStep': nextStep,
        'assignments': [thiefDx] if nextStep == 'defeat' else stageMd.Assignments,
        'roomRewards': roomRewards,
        'stageRewards': stageRewards,
        'fullRewards': fullRewards,
    }
    return Response(resultDx)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ExpeditionUpdate(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    trunkNow = timezone.now().replace(microsecond=0)
    currDate = f"{trunkNow.year}-{str(trunkNow.month).zfill(2)}-{str(trunkNow.day).zfill(2)}"

    # remove any closed expeditions: expired or claimed from previous day

    expireLs = GM.GuildExpedition.objects.filter(GuildFK=guildMd, CreateDate__lt=currDate, ThiefFK__isnull=True)
    for ep in expireLs: ep.delete()

    claimLs = GM.GuildExpedition.objects.filter(GuildFK=guildMd, CreateDate__lt=currDate, Claimed=True)
    for ep in claimLs: ep.delete()

    # store the expeditions in slots to keep the order on the frontend

    dailySlots = RS.GetExpeditionCount(guildMd)
    for sl in range(1, dailySlots +1):
        exists = GM.GuildExpedition.objects.GetOrNone(GuildFK=guildMd, SlotNo=sl)
        if not exists:
            CT.CreateExpedition(guildMd, currDate, sl)

    # check if any expeditions have ended
    # if they have, the results are created but not claimed

    RS.ResetInjuryCooldowns(guildMd)

    expeditionLs = GM.GuildExpedition.objects.filter(GuildFK=guildMd, StartDate__isnull=False)

    for ep in expeditionLs:
        endTime = ep.StartDate + PD.Timedelta(ep.Duration).to_pytimedelta()
        if endTime <= trunkNow and not ep.Results:
            runResults = LH.RunExpedition(ep)
            winResults = LH.ExpeditionResults(guildMd.ThroneLevel, ep, runResults)
            ep.Results = winResults                 # applied when user claims
            ep.save()

    # return the current expeditions
    # will include all previous edits of this function
    # check for reward replacements here

    expeditionLs = CT.GetExpeditions(guildMd, trunkNow) 
    return Response({'expeditions': expeditionLs})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ExpeditionLaunch(request):

    expeditionId = request.data.get('expeditionId')
    thiefId = request.data.get('thiefId')

    expToStart = GM.GuildExpedition.objects.GetOrNone(id=expeditionId)
    thiefMd = GM.ThiefInGuild.objects.GetOrNone(id=thiefId)

    trunkNow = timezone.now().replace(microsecond=0)
    expireTm = PD.Timedelta(expToStart.Duration).to_pytimedelta()

    expToStart.StartDate = trunkNow
    expToStart.ThiefFK = thiefMd
    expToStart.save()

    thiefMd.Status = 'Exploring'
    thiefMd.CooldownExpire = trunkNow + expireTm
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
                'GuildFK': guildMd,
                'ThiefFK': EM.UnlockableThief.objects.GetOrNone(ResourceId=selectReward['resourceId']),
            }
            newModel = GM.ThiefUnlocked(**newBlueprint)
            newModel.save()

        else:
            newBlueprint = {
                'GuildFK': guildMd,
                'ItemFK': EM.UnlockableItem.objects.GetOrNone(ResourceId=selectReward['resourceId']),
            }
            newModel = GM.ItemUnlocked(**newBlueprint)
            newModel.save()

    elif not replace and selectReward['category'] == 'material':
        amount = int(selectReward['value'].split(' ')[0])
        if selectReward['resourceId'] == 'gold':        RS.GrantGold(guildMd, amount)
        if selectReward['resourceId'] == 'gems':        RS.GrantGems(guildMd, amount)
        if selectReward['resourceId'] == 'wood':        RS.GrantWood(guildMd, amount)
        if selectReward['resourceId'] == 'stone':       RS.GrantStone(guildMd, amount)
        if selectReward['resourceId'] == 'iron':        RS.GrantIron(guildMd, amount)

    elif replace:
        amount = int(replace.split(' ')[-2])
        RS.GrantGems(guildMd, amount)

    # apply results to thief

    RS.GrantExperience(thiefMd, expToClaim.Results['xp'])

    if selectReward['category'] != 'injury':
        thiefMd.Status = 'Ready'
        thiefMd.CooldownExpire = None
        thiefMd.save()

    else:
        RS.ApplyWounds(thiefMd, thiefMd.Health)

    # mark the expedition as claimed
    # it will be wiped on the next day when the user updates the expeditions

    expToClaim.Claimed = True
    expToClaim.save()

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

