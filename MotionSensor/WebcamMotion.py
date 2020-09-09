import cv2, pandas, time, sys, os
from datetime import datetime
import Projects.FileSystem as fileSystem
import Projects.Postprocessing as Postprocessing

static_back = None
motion_list = [0, 0]
times = []
imageCaptureName = "movement-images"
lastImageTime = datetime.now()
lastMotion = datetime.now()
moving = False
saveMovementTime = 1500 # saves movement image every x ms


# for facial classification
faceCascade = cv2.CascadeClassifier(os.getcwd() + "/facialRecognitionData.xml")

df = pandas.DataFrame(columns=["Start", "End"])
video = cv2.VideoCapture(0)
# video = cv2.VideoCapture("https://d2v9y0dukr6mq2.cloudfront.net/video/preview/dFR-e4G/reenactment-of-the-final-battle-between-the-army-of-vespasian-and-the-army-of-vitellius-in-the-roman-civil-war-ad-69-during-the-birth-of-rome-celebration-on-21-april-2014-rome-italy_vy2uxv26x__SB_PM.mp4") #0 for webcam
fileSystem.deleteFolder(imageCaptureName)
movementDirectory = fileSystem.createFolder(imageCaptureName)

def dateDifference(date1, date2):
    return abs(int((date1 - date2).total_seconds() * 1000))

while True:
    check, frame = video.read()
    motion = 0 # (no motion)

    grayscaleFrame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(grayscaleFrame, (21, 21), 0)

    # In first iteration we assign the value of static_back to our first frame
    if static_back is None:
        static_back = gray
        continue

    # Difference between static background and current frame(which is GaussianBlur)
    diff_frame = cv2.absdiff(static_back, gray)

    # If change in between static background and current frame is greater than 30 it will show white color(255)
    thresh_frame = cv2.threshold(diff_frame, 15, 255, cv2.THRESH_BINARY)[1]
    thresh_frame = cv2.dilate(thresh_frame, None, iterations=2)

    # Finding contour of moving object
    cnts, _ = cv2.findContours(thresh_frame.copy(),
                               cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    #box faces
    faces = Postprocessing.findFaces(faceCascade, grayscaleFrame, frame)
    cnts = Postprocessing.findMovement(cnts)

    if len(cnts) > 0:
        motion = 1
        if dateDifference(lastImageTime, datetime.now()) > saveMovementTime:
            faceNum = 1
            for (x, y, w, h) in faces:
                newImageName = str(time.time_ns()) + "Face" + str(faceNum)
                newImageName = fileSystem.getPath(imageCaptureName) + newImageName + ".jpg"
                faceNum += 1
                fileSystem.saveCroppedImage(frame, newImageName, (x, y, w, h), 1.3)

        imageNum = 1
        for contour in cnts:
            (x, y, w, h) = cv2.boundingRect(contour)
            # making green rectangle around the moving object
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 127, 0), 3)

            if dateDifference(lastImageTime, datetime.now()) > saveMovementTime:
                newImageName = str(time.time_ns()) + "Motion" + str(imageNum)
                newImageName = fileSystem.getPath(imageCaptureName) + newImageName + ".jpg"
                imageNum += 1
                fileSystem.saveCroppedImage(frame, newImageName, (x, y, w, h), 1.3)

        if dateDifference(lastImageTime, datetime.now()) > saveMovementTime:
            lastImageTime = datetime.now()
            newImageName = fileSystem.getPath(imageCaptureName) + str(time.time_ns()) + "Full" + ".jpg"
            fileSystem.saveCroppedImage(frame, newImageName, (0, 0, int(video.get(3)), int(video.get(4))), 1)

    motion_list.append(motion)
    motion_list = motion_list[-10:] #get last x of array, each frame is ~.05 seconds

    # Appending Start time of motion
    if motion_list[-1] == 1 and motion_list[-2] == 0 and moving == False:
        times.append(datetime.now())
        moving = True
        lastMotion = datetime.now()
        print("Motion started at " + str(datetime.now()))

    # Appending End time of motion
    if sum(motion_list) < 1 and moving == True and dateDifference(lastMotion, datetime.now()) > 100:
        times.append(datetime.now())
        moving = False
        print("Motion stopped at " + str(datetime.now()))

    # Displaying image in gray_scale
    cv2.imshow("Gray Frame", gray)
    # Displaying the difference in current frame to the last motion frame
    cv2.imshow("Difference Frame", diff_frame)
    # Displaying the black and white image in which if intensity difference greater than 30 it will appear white
    cv2.imshow("Threshold Frame", thresh_frame)
    # Displaying color frame with contour of motion of object
    cv2.imshow("Color Frame", frame)

    key = cv2.waitKey(1)
    if motion == 1:
        static_back = gray

    # if q entered whole process will stop
    if cv2.waitKey(10) & 0xFF == ord("q"):
        # if something is movingthen it append the end time of movement
        if motion == 1:
            times.append(datetime.now())
            print("Movement ended")
        break

print(len(times))

# Appending time of motion in DataFrame
for i in range(0, len(times) - 1, 2):
    df = df.append({"Start": times[i], "End": times[i + 1]}, ignore_index=True)

# Creating a CSV file in which time of movements will be saved
df.to_csv("Time_of_movements.csv")

video.release()
cv2.destroyAllWindows() 