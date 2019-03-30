class VideoCategory {

	constructor(id) {
		this.id = id;
	}

	// Returns human readable category.
	toString() {

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