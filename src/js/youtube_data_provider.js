class YoutubeDataProvider {
	constructor(data) {
		this.data = data;
	}

	static emptyInitialData() {
		return new YoutubeDataProvider([]);
	}

	poll() {

	}
}