var DATA_DIRECTORY = 'data/';
var FILE_FORMAT = 'historical_data_{}.csv';

function parseFiles(directory, regionCodes, callback) {
    queue = d3.queue();
    regionCodes.forEach(regionCode => {
        queue.defer(parseFile, regionCode);
    });
    queue.awaitAll(function(error, historicalData) {
        if (error) {
            throw error;
        }
        var result = {};
        historicalData.forEach(data => {
        	result[data.regionCode] = data.points;
        });
        callback(result);
    });
}

function getFileName(directory, regionCode) {
    return directory + FILE_FORMAT.replace('{}', regionCode);
}

// Returns [ChartPoint] from a file name.
function parseFile(regionCode, callback) {
	var fileName = getFileName(DATA_DIRECTORY, regionCode);
    return d3.csv(fileName, function(err, data) {
        if (err) {
            callback(err, data);
            return;
        }
        var parsedData = {
        	regionCode: regionCode,
        	points: []
        };
        var currentPoint = null;
        data.forEach(row => {
        	var datetime = new Date(Date.parse(row.time));
        	if (currentPoint == null) {
        		currentPoint = new ChartPoint([], datetime);
        	} else if (datetime.getTime() != currentPoint.datetime.getTime()) {
        		parsedData.points.push(currentPoint);
        		currentPoint = new ChartPoint([], datetime);
        	}
            currentPoint.addVideo(new Video(row.categoryId, row.title, row.viewCount, row.url, row.channelTitle));
        });
        callback(null, parsedData);
    });
}
