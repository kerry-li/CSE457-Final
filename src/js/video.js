class VideoCategory {

	// Category-id => human-readable category.
	stringForId(id) {

	}

	// Human-readable category => id.
	idForString(category) {

	}
}

class Video {

	constructor(categoryId, title, views, link, author) {
		this.categoryId = categoryId;
		this.title = title;
		this.views = views;
		this.link = link;
		this.author = author;
	}

}