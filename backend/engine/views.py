"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
ENGINE VIEWS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import pandas as PD
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

import app_proj.notebooks as NT
import engine.models as GM
import engine.logic.resource as RS


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
def DeleteGuild(request):

    userMd = request.user
    guild = request.data.get('guildName') 

    guildMd = GM.Guild.objects.filter(UserFK=userMd, Name=guild)[0]
    guildMd.delete()

    return Response(f"Charter {guild} has been abolished.")

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

