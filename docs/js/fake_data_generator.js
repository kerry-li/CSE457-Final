function generateFakeData(n, numCategories) {
	var result = [];
	for (var i = 0; i < n; i++) {
		result.push(new Video(
			new VideoCategory(Math.floor(Math.random() * numCategories)),
			`Video${i}`,
			Math.floor(Math.random() * 10000000),
			`Link${i}`,
			`Author${Math.floor(Math.random() * n)}`
			));
	}
	return result;
}