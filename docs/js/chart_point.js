class ChartPoint {

    // videos: [Video].
    constructor(videos) {
        this.videos = videos;
    }

    get totalViews() {
        var views = 0;
        this.videos.forEach(video => {
            views += video.views;
        });
        return views;
    }

    viewsForCategory(category) {
        return this.videos.filter(video => video.category.equals(category))
            .reduce((accumulator, video) => accumulator + video.views, 0);
    }
}
