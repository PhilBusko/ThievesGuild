"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
CHARACTER NAMES
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

MODULE_PATH = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(MODULE_PATH, 'data')


def CharacterNames():

    inputPath = os.path.join(DATA_PATH, 'CharacterNames.xlsx')
    nameDf = XS.ReadSheet(inputPath, 'Names')
    nameDf = nameDf.reset_index().drop(['index', 'Sort Letter', 'Unnamed: 2'], axis=1, errors='ignore')
    nameDf = nameDf.dropna(axis=1, how='all')

    nameLs = nameDf.values.tolist()
    characters = []

    for rw in nameLs:
        for nm in rw:
            checkVal = str(nm)
            if not checkVal in ['nan', 'NaT', '<NA>'] and not any(char.isdigit() for char in checkVal): 
                characters.append(nm)

    return sorted(characters)

