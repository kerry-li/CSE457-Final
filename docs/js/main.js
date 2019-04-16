function start() {
    // 2. Initialize the JavaScript client library.
    VideoCategory.setCategoryMap({
      0: 'Gaming',
      1: 'Comedy',
      2: 'Entertainment',
      3: 'Sports'
    });
    gapi.client.init({
            'apiKey': 'AIzaSyDlVZRSyu6K-j6HYabaJblFPtmoFJZQHZA'
        })
        // .then(loadYoutubeCategoryMapping)
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
    // var dataProvider = FakeDataProvider.withNumVideos(1000, 50, 4);
    // var dataProvider = YoutubeDataProvider.noInitialData();
    // var chart = new StackedAreaChart(dataProvider);
    d3.tsv('../countries.tsv', function(data) {
        console.log(data);
        let availableCountries = [];
        let countryCodes = [];
        for (let i = 0; i < data.length; i++) {
            availableCountries.push(data[i].country)
            countryCodes.push(data[i].country_code);
        }
        console.log(getAllFileNames('data/', countryCodes));
        var dataProvider = FakeDataProvider.withNumVideos(10000, 50, 4);
        // var dataProvider = YoutubeDataProvider.noInitialData();
        var map = new GeoMap(availableCountries, countryCodes, dataProvider);
    })
    
}

// 1. Load the JavaScript client library.
gapi.load('client', start);
