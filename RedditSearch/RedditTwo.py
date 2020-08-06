# Searches and logs various strings from specific subreddits.

import praw
import json
import os
import time
import playsound

reddit = praw.Reddit() #account metadata hidden
subReddits = {
    "Merlin": {"Hobby":True},
    "Purdue": {"Academic":True},
    "Nashville": {"Life":True},
},


while True:
    postFile = open("RedditPosts.txt", "r")
    postData = json.load(postFile) #load the old post data into the file
    postFile.close()

    posts = postData["posts"]
    ids = postData["ids"]

    multi = ""
    for key, value in subReddits.items():
        multi = multi + key + "+"

    multi = multi[:-1]
    subs = reddit.subreddit(multi)


    #title, id, url, created_utc, .subreddit.display_name
    searchStrings = ["brentwood", "season 6", "movie", "cs373"]
    for searchStr in searchStrings:
        for post in subs.search(searchStr, limit = 25, sort = 'new'):
            tempTitle = post.title.upper()
            if not str(post.id) in ids:
                print("New post: " + tempTitle)
                ids[str(post.id)] = True
                newArr = {}
                newArr["id"] = post.id
                newArr["url"] = "https://www.reddit.com" + post.permalink
                newArr["title"] = post.title
                newArr["created"] = post.created_utc
                newArr["subreddit"] = post.subreddit.display_name
                if post.url.find(".jpg") > -1 or post.url.find(".jpeg") > -1 or post.url.find(".png") > -1 or post.url.find(".gif") > -1:
                    newArr["picture"] = post.url
                posts.append(newArr)

    posts.sort(key = lambda x: x["created"], reverse = True)
    posts = posts[:100] #only keep 100 most recent posts

    if "season 6" not in searchStrings: #don't write to the file if season 6 is in it
        with open('RedditPosts.txt', 'w') as outfile:
            json.dump(postData, outfile)

    dataFile = open('my computer path', "w")
    dataFile.write("data = ");
    dataFile.close();

    with open('my computer path', "a") as tempFile:
        json.dump(postData, tempFile)

    dataFile = open('my computer path', "a")
    dataFile.write(";");
    dataFile.close();


    time.sleep(600) #run every 10 minutes