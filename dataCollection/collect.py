import csv
import datetime
import json
import os
import os.path
import schedule
import time

import googleapiclient.discovery

DEVELOPER_KEY = "AIzaSyDlVZRSyu6K-j6HYabaJblFPtmoFJZQHZA"

COUNTRIES_FILE = "../docs/countries.txt"

DATA_FILE_TEMPLATE = "historical_data_{}.csv"

ERR_FILE_TEMPLATE = "historical_errors_{}.csv"

def getDataFileNameForCountry(regionCode):
    return DATA_FILE_TEMPLATE.format(regionCode)

def getErrorFileNameForCountry(regionCode):
    return ERR_FILE_TEMPLATE.format(regionCode)

class YoutubeClient:

    def __init__(self, apiKey):
        self.apiKey = apiKey
        self.youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=self.apiKey)

    def getMostPopularVideosForRegion(self, regionCode):
        request = self.youtube.videos().list(
            part="snippet,statistics",
            chart="mostPopular",
            regionCode=regionCode,
            maxResults=50
        )
        return request.execute()

def writePointsForRegions(youtubeClient, regionCodes):
    headers = ['time', 'categoryId', 'title', 'viewCount', 'url', 'channelTitle']
    time = datetime.datetime.now().isoformat()
    for regionCode in regionCodes:
        fileName = getDataFileNameForCountry(regionCode)
        fileExists = os.path.isfile(fileName)
        with open(fileName, 'a') as csvfile:
            writer = csv.DictWriter(csvfile, delimiter=',', lineterminator='\n', fieldnames=headers)
            videos = youtubeClient.getMostPopularVideosForRegion(regionCode)

            if not fileExists:
                writer.writeheader()

            for video in videos['items']:
                snippet = video['snippet']
                stats = video['statistics']
                try:
                    writer.writerow({
                        'time': time,
                        'categoryId': snippet['categoryId'],
                        'title': snippet['title'],
                        'viewCount': stats['viewCount'],
                        'url': video['id'],
                        'channelTitle': snippet['channelTitle']
                    })
                except KeyError as e:
                    with open(getErrorFileNameForCountry(regionCode), 'a') as errFile:
                        errorWriter = csv.writer(errFile, delimiter=',')
                        errorWriter.writerow([time, regionCode, snippet['title'], video['id']])


def main():
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    youtubeClient = YoutubeClient(DEVELOPER_KEY)
    with open(COUNTRIES_FILE) as f:
        regionCodes = [country.strip() for country in f.readlines()]

    schedule.every(30).minutes.do(lambda: writePointsForRegions(youtubeClient, regionCodes))
    writePointsForRegions(youtubeClient, regionCodes)
    while True:
        schedule.run_pending()
        time.sleep(1)


if __name__ == '__main__':
    main()
