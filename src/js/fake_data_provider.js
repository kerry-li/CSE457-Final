class FakeDataProvider {

	// data: [ChartPoint].
	constructor(data) {
		this.data = data;
	}

	static fromVideos(videos, videosPerPoint) {
		var data = [];
		for (var i = 0; i < videos.length; i += videosPerPoint) {
			data.push(new ChartPoint(videos.slice(i, videosPerPoint)));
		}
		return new FakeDataProvider(data);
	}

	static withNumVideos(n, videosPerPoint, numCategories) {
		var fakeVideos = generateFakeData(n, numCategories);
		return FakeDataProvider.fromVideos(videos, videosPerPoint);
	}

	poll() {
		return this.data.shift();
	}
}