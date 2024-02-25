"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EMPORIUM GUILD
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random
import emporium.models as EM


def GetNextLevelXp(level):
    exp = EM.ThiefLevel.objects.filter(Level=level+1)[0].Experience
    return exp

def BaseTraits(startMig, startAgi, startCun, randomTraits):

    traitLs = ['Mig', 'Agi', 'Cun', 'End']
    if startMig > startAgi and startMig > startCun:   
        traitLs.remove('Mig')
        favValue = startMig
    if startAgi > startMig and startAgi > startCun:
        traitLs.remove('Agi')
        favValue = startAgi
    if startCun > startMig and startCun > startAgi:
        traitLs.remove('Cun')
        favValue = startCun

    currMig = startMig
    currAgi = startAgi
    currCun = startCun
    currEnd = 0
    bonusSpent = 0

    while bonusSpent < randomTraits:
        newTrait = random.choice(traitLs)
        if newTrait == 'Mig' and currMig < favValue -1:
            currMig += 1
            bonusSpent += 1
        if newTrait == 'Agi' and currAgi < favValue -1:
            currAgi += 1
            bonusSpent += 1
        if newTrait == 'Cun' and currCun < favValue -1:
            currCun += 1
            bonusSpent += 1
        if newTrait == 'End' and currEnd < favValue -1:
            currEnd += 1
            bonusSpent += 1

    return [currMig, currAgi, currCun, currEnd]

