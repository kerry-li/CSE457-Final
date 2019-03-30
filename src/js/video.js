class VideoCategory {

	// Category-id => human-readable category.
	stringForId(id) {

	}

	// Human-readable category => id.
	idForString(category) {

	}
}

class Video {

	constructor(category, title, views, link, author) {
		this.category = category;
		this.title = title;
		this.views = views;
		this.link = link;
		this.author = author;
	}

}