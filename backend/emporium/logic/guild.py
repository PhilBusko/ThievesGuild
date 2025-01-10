"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM GUILD
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import emporium.models as EM

POWER_FACTOR = 50


def GetNextLevelXp(level):
    exp = EM.ThiefLevel.objects.GetOrNone(Level=level+1).Experience
    return exp

def GetRoman(p_int):
    if p_int == 1: return 'I'
    if p_int == 2: return 'II'
    if p_int == 3: return 'III'
    if p_int == 4: return 'IV'
    if p_int == 5: return 'V'
    if p_int == 6: return 'VI'
    if p_int == 7: return 'VII'
    if p_int == 8: return 'VIII'
    if p_int == 9: return 'IX'
    return None
