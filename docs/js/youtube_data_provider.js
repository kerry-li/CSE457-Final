class YoutubeDataProvider {

    constructor(data, regionCode) {
        this.data = data;
        this.regionCode = regionCode;
    }

    static noInitialData(regionCode) {
        return new YoutubeDataProvider([], regionCode);
    }

    poll() {
        if (this.data.length > 0) {
            return Promise.resolve(this.data[this.regionCode].shift());
        }

        return gapi.client.request({
                'path': 'https://www.googleapis.com/youtube/v3/videos',
                'params': {
                    regionCode: this.regionCode,
                    part: 'snippet, statistics',
                    chart: 'mostPopular',
                    maxResults: 50
                }
            })
            .then(function(response) {
                var result = response.result;
                var videos = [];
                result.items.forEach(video => {
                	var snippet = video.snippet;
                	var stats = video.statistics;
                    videos.push(new Video(
                    	new VideoCategory(+snippet.categoryId),
                    	snippet.title,
                    	+stats.viewCount,
                    	makeVideoUrl(video.id),
                    	snippet.channelTitle
                    ));
                });
                return new ChartPoint(videos);
            }, function(reason) {
                console.log('Error ' + reason.result.error.message);
                return null;
            });
    }
}

function makeVideoUrl(videoId) {
	return "youtube.com/watch?v=" + videoId;
}