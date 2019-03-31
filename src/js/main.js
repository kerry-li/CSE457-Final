function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
            'apiKey': 'AIzaSyDlVZRSyu6K-j6HYabaJblFPtmoFJZQHZA'
        })
        .then(loadYoutubeCategoryMapping)
        .then(createVis);
};

function loadYoutubeCategoryMapping() {
    // Load the category mapping from YouTube.
    gapi.client.request({
            'path': 'https://www.googleapis.com/youtube/v3/videoCategories',
            'params': {
                part: 'snippet',
                regionCode: 'US'
            }
        })
        .then(function(response) {
            var mapping = {};
            response.result.items.forEach(item => {
                mapping[+item.id] = item.snippet.title;
            });
            VideoCategory.setCategoryMap(mapping);
        }, function(reason) {
            console.log('Error obtaining Youtube category mapping: ' + reason.result.error.message);
        });
}

function createVis() {
    var dataProvider = YoutubeDataProvider.noInitialData();
    var chart = new StackedAreaChart(fakeDataProvider);
}

// 1. Load the JavaScript client library.
gapi.load('client', start);
