class ChartPoint {

    // videos: [Video].
    // datetime: Date.
    constructor(videos, datetime) {
        this.videos = videos;
        this.datetime = datetime;
    }

    get totalViews() {
        var views = 0;
        this.videos.forEach(video => {
            views += video.views;
        });
        return views;
    }

    addVideo(video) {
        this.videos.push(video);
    }

    viewsForCategory(category) {
        return this.videos.filter(video => video.category.equals(category))
            .reduce((accumulator, video) => accumulator + video.views, 0);
    }
}
