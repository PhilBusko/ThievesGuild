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
def GuildDetails(request):

    userMd = request.user
    guildMd = GM.Guild.objects.GetOrNone(UserFK=userMd, Selected=True)

    if not guildMd:
        return Response({
            'thiefLs': None,
            'assetLs': None,
            'message': '* A guild must be chosen in the Account page.',
        })

    RS.ResetCooldowns(guildMd)
    thiefDf = RS.GetThiefList(guildMd)
    assetDf = RS.GetAssetList(guildMd)

    details = {
        'thiefLs': NT.DataframeToDicts(thiefDf),
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
    RS.SetGuildPower(guildMd)

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
        return Response({
            'thiefLs': None,
            'assetLs': None,
            'message': '* A guild must be chosen in the Account page.',
        })

    currDt = timezone.now()
    currDate = f"{currDt.year}-{str(currDt.month).zfill(2)}-{str(currDt.day).zfill(2)}"
    currWeekDay = currDt.weekday()   # 0 monday, 1 tuesday, .. 6 sunday

    tower = CT.GetOrCreateTower(guildMd, currDate)
    tower = CT.AttachDisplayData(tower)

    trial = CT.GetOrCreateTower(guildMd, currDate)[1:3]
    trial = CT.AttachDisplayData(trial)

    raid = [CT.GetOrCreateTower(guildMd, currDate)[4]]
    raid = CT.AttachDisplayData(raid)

    dungeon = []
    dungeon = CT.AttachDisplayData(dungeon)

    campaign = CT.GetOrCreateTower(guildMd, currDate)[2:] + CT.GetOrCreateTower(guildMd, currDate)[6:10]
    campaign = CT.AttachDisplayData(campaign)

    responseDx = {
        'tower': tower,
        'trial': trial,
        'raid': raid,
        'dungeon': dungeon,
        'campaign': campaign,
        'message': None,
    }
    return Response(responseDx)

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

    RS.ResetCooldowns(guildMd)
    thiefDf = RS.GetThiefList(guildMd)
    thiefDf = thiefDf.sort_values(by=['Class', 'Power'], ascending=[True, False])

    details = {
        'thiefLs': NT.DataframeToDicts(thiefDf),
        'message': None,
    }
    return Response(details)

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

