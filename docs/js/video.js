class VideoCategory {

	static map = {};

	constructor(id) {
		this.id = id;
	}

	static setCategoryMap(map) {
		VideoCategory.map = map;
	}

	static categoryForId(id) {
		return VideoCategory.map[id];
	}

	static getAllCategories() {
		var categories = [];
		for (var property in VideoCategory.map) {
			if (VideoCategory.map.hasOwnProperty(property)) {
				categories.push(new VideoCategory(property));
			}
		}
		return categories;
	}

	// Returns human readable category.
	toString() {
		return VideoCategory.categoryForId(this.id);
	}

	equals(other) {
		return this.id == other.id;
	}
}

class Video {

	// category: VideoCategory.
	// title: str.
	// views: num.
	// link: str.
	// author: str.
	constructor(category, title, views, link, author) {
		this.category = category;
		this.title = title;
		this.views = views;
		this.link = link;
		this.author = author;
	}

}