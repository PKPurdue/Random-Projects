import os, shutil, time
from PIL import Image

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

def saveCroppedImage(image, imageName, coordinates, allowance):
    x, y, w, h = coordinates
    x = max(0, int(x - (w * (allowance - 1) / 2)))
    y = max(0, int(y - (h * (allowance - 1) / 2)))
    w *= allowance
    h *= allowance
    height, width, c = image.shape
    w = min(w, width - x)
    h = min(h, height - y)
    croppedImage = Image.fromarray(image, 'RGB').crop((x, y, x + w, y + h))

    croppedImage.save(imageName, quality=95)
    print("Saving image")