import cv2

def findFaces(faceCascade, grayscaleFrame, frame):
    faces = faceCascade.detectMultiScale(
        grayscaleFrame,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y - int(h * .1)), (x + w, y + int(h * 1.2)), (0, 255, 0), 2)
    return faces

def findMovement(cnts):
    contours = []
    for contour in cnts:
        if cv2.contourArea(contour) < 10000:
            continue
        contours.append(contour)
    return contours