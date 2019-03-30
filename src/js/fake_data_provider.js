class FakeDataProvider {
	constructor(n, numCategories) {
		this.data = generateFakeData(n, numCategories);
	}

	poll() {
		return this.data.shift();
	}
}