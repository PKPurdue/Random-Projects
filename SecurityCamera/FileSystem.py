import os, shutil, time

currentPath = os.getcwd()

def getPath(folderName):
    return currentPath + "/" + folderName + "/"

def createFolder(folderName):
    if (os.path.exists(currentPath + "/" + folderName) == True):
        print("Folder " + folderName + " already exists.")
        return
    try:
        dir = os.mkdir(currentPath + "/" + folderName)
        return dir
    except OSError:
        print("Creation of the directory " + folderName + " failed!")


def deleteFolder(folderName):
    if (os.path.exists(currentPath + "/" + folderName) == False):
        print("Folder " + folderName + " does not exist.")
        return
    try:
        shutil.rmtree(currentPath + "/" + folderName)
        time.sleep(3)
    except OSError:
        print("Deletion of the directory " + folderName + " failed")
