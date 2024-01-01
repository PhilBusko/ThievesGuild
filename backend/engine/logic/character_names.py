"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
CHARACTER NAMES
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

MODULE_PATH = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(MODULE_PATH, 'data')


def CharacterNames():

    # create google sheets authorization
    # https://developers.google.com/sheets/api/quickstart/python

    SPREADSHEET = '1s4u7IVzAofK_caYPdK6erqeHNWWe9KIl6YlH90sCoNw'
    CELL_RANGE = 'Names!D3:J'
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

    credPath = os.path.join(DATA_PATH, 'credentials.json')
    flow = InstalledAppFlow.from_client_secrets_file(credPath, SCOPES)
    creds = flow.run_local_server(port=0)

    # get the data as list of lists

    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    result = (
        sheet.values()
        .get(spreadsheetId=SPREADSHEET, range=CELL_RANGE)
        .execute()
    )
    sheetLs = result.get('values', [])

    # flatten the list to return

    characters = []
    for rw in sheetLs:
        for nm in rw:
            if nm and not any(char.isdigit() for char in nm): 
                characters.append(nm)

    return sorted(characters)

