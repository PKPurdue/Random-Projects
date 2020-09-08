import cv2, pandas, time
from datetime import datetime
from PIL import Image
import Projects.FileSystem as fileSystem


static_back = None
motion_list = [None, None]
times = []
imageCaptureName = "movement-images"
lastImageTime = datetime.now()

df = pandas.DataFrame(columns=["Start", "End"])
video = cv2.VideoCapture(0)
fileSystem.deleteFolder(imageCaptureName)
movementDirectory = fileSystem.createFolder(imageCaptureName)

while True:
    check, frame = video.read()
    motion = 0 # (no motion)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (21, 21), 0)

    # In first iteration we assign the value of static_back to our first frame
    if static_back is None:
        static_back = gray
        continue

    # Difference between static background and current frame(which is GaussianBlur)
    diff_frame = cv2.absdiff(static_back, gray)

    # If change in between static background and current frame is greater than 30 it will show white color(255)
    thresh_frame = cv2.threshold(diff_frame, 30, 255, cv2.THRESH_BINARY)[1]
    thresh_frame = cv2.dilate(thresh_frame, None, iterations=2)

    # Finding contour of moving object
    cnts, _ = cv2.findContours(thresh_frame.copy(),
                               cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    imageNum = 1
    willSave = (int(((datetime.now() - lastImageTime).total_seconds() * 1000)) > 2000)
    for contour in cnts:
        if cv2.contourArea(contour) < 10000:
            continue
        motion = 1

        (x, y, w, h) = cv2.boundingRect(contour)
        # making green rectangle arround the moving object
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
        # if it's been x seconds since a pict was saved
        if willSave:
            lastImageTime = datetime.now()
            newImageName = "MotionCapture-" + str(time.time_ns()) + str(imageNum)
            imageNum += 1
            x = max(0, int(x - (w * .15)))
            y = max(0, int(y - (h * .15)))
            w *= 1.3
            h *= 1.3

            croppedImage = Image.fromarray(frame, 'RGB').crop((x, y, x + w, y + h))
            newImageName = fileSystem.getPath(imageCaptureName) + newImageName + ".jpg"
            croppedImage.save(newImageName, quality=95)
            print("Saving image")

    motion_list.append(motion)

    motion_list = motion_list[-2:]

    # Appending Start time of motion
    if motion_list[-1] == 1 and motion_list[-2] == 0:
        times.append(datetime.now())
        print("Motion started at " + str(datetime.now()))

    # Appending End time of motion
    if motion_list[-1] == 0 and motion_list[-2] == 1:
        times.append(datetime.now())
        print("Motion stopped at " + str(datetime.now()))

        # Displaying image in gray_scale
    cv2.imshow("Gray Frame", gray)

    # Displaying the difference in currentframe to
    # the staticframe(very first_frame)
    cv2.imshow("Difference Frame", diff_frame)

    # Displaying the black and white image in which if
    # intensity difference greater than 30 it will appear white
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
for i in range(0, len(times), 2):
    df = df.append({"Start": times[i], "End": times[i + 1]}, ignore_index=True)

# Creating a CSV file in which time of movements will be saved
df.to_csv("Time_of_movements.csv")

video.release()

# Destroying all the windows
cv2.destroyAllWindows() 