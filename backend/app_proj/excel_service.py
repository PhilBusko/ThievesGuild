"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
EXCEL SERVICE
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import os
import pandas as PD

def ReadSheet(filePath, sheetName):
    excelFl = PD.ExcelFile(filePath)
    sheetDf = PD.read_excel(excelFl, sheetName)
    excelFl.close()
    return sheetDf

def AppendToExcel(filePath, sheetName, updateLs):
    """ Append data to an excel sheet. 
        If the file or sheet don't exist, they'll be created.
        updateLs: list of dictionaries with keys matching any existing sheet """
    
    # check for the file

    if os.path.exists(filePath) == False:
        writer = PD.ExcelWriter(filePath, engine='openpyxl')
    else:
        writer = PD.ExcelWriter(filePath, engine='openpyxl', mode='a', if_sheet_exists='replace')

    # check for the sheet

    sheetLs = [x.title for x in writer.book.worksheets]

    if sheetName not in sheetLs:
        reportDf = PD.DataFrame()
    else:
        excelFl = PD.ExcelFile(filePath)
        reportDf = PD.read_excel(excelFl, sheetName)
        excelFl.close()

    # append data and overwrite excel

    reportDf = PD.concat([reportDf, PD.DataFrame(updateLs)])
    reportDf.to_excel(writer, sheet_name=sheetName, index=False)
    writer.close()

def ResetFile(filePath):
    """ Delete file from the file system. """

    if os.path.exists(filePath): 
        os.remove(filePath)

def ResetSheet(filePath, sheetName):
    """ Delete a sheet and keep the rest of the file. """

    try:
        writer = PD.ExcelWriter(filePath, engine='openpyxl', mode='a')
    except:
        print(f"no excel file found")
        return
    try:
        writer.sheets = dict((ws.title, ws) for ws in writer.book.worksheets) 
    except:
        print(f"no sheet found")
        return
    try:
        sheetRef = writer.book[sheetName]
        writer.book.remove(sheetRef)
        print("sheet removed")
    except:
        print(f"no sheet found: {sheetName}")
    writer.close()

