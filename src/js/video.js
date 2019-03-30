class VideoCategory {

	constructor(id) {
		this.id = id;
	}

	static setCategoryMap(map) {
		VideoCategory.map = map;
	}

	static categoryForId(id) {
		return VideoCategory.map[id];
	}

	// Returns human readable category.
	toString() {
		return VideoCategory.categoryForId(this.id);
	}

	equals(other) {
		return this.id == other.id;
	}
}

VideoCategory.map = {};

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