"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
NOTEBOOK UTILITIES
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import random 

NOTEBOOK_ENV = 'DEV'  
# NOTEBOOK_ENV = 'PROD'  


def DataframeToDicts(myDf):
    myLs = myDf.to_dict('records')
    for nd, d in enumerate(myLs):
        for k, v in d.items():
            if str(v) in ['nan', 'NaT', '<NA>'] : d[k] = None
    return myLs

def GetRandom(myDf, window):
    sampleMax = myDf.shape[0] - window if myDf.shape[0] - window > 0 else 1
    randStart = random.randint(0, sampleMax)
    sampleDf = myDf[randStart:randStart+window] 
    return sampleDf

