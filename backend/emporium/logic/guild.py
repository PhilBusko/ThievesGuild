"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM GUILD
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import emporium.models as EM

POWER_FACTOR = 50


def GetNextLevelXp(level):
    exp = EM.ThiefLevel.objects.GetOrNone(Level=level+1).Experience
    return exp

