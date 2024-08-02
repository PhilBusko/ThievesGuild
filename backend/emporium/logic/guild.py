"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM GUILD
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import emporium.models as EM

POWER_FACTOR = 50


def GetNextLevelXp(level):
    exp = EM.ThiefLevel.objects.filter(Level=level+1)[0].Experience
    return exp

