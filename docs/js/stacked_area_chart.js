class StackedAreaChart {
    constructor(dataProvider, country) {
        this.dataProvider = dataProvider;
        this.margin = {
            top: 50,
            right: 300,
            bottom: 100,
            left: 100
        };
        this.data = [];
        this.country = country;
        this.displayData = this.data;
        this.width = 800;
        this.height = 600;
        var svg = d3.select("#area-chart")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.bottom + this.margin.top);

        this.breakdownRadius = this.margin.right / 2;
        this.breakdown = svg.append("g")
            .attr("transform", "translate(" + (this.margin.left + this.width + this.breakdownRadius) + "," + (this.margin.top + this.breakdownRadius) + ")");

        this.svg = svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.interval = 10000; // Milliseconds.
        this.wrangle();
    }

    // Get new points into this.data.
    receiveNewData() {
        var newPoint = this.dataProvider.poll();
        if (newPoint != null) {
            newPoint.then(point => {
                this.data.push(point);
                this.wrangle();
            });
        }
    }

    // Fill this.displayData.
    wrangle() {
        this.displayData = this.dataProvider.data[this.dataProvider.regionCode];
        this.updateVis();
    }

    // Prepare this.displayData for graphing in the area chart.
    stackedData() {
        var categories = VideoCategory.getAllCategories();
        var readyForStacking = [];
        var otherData = [];
        this.displayData.forEach(point => {
            var stackPoint = {};
            categories.forEach(category => {
                stackPoint[category.id] = point.viewsForCategory(category);
            });
            stackPoint.datetime = point.datetime;
            readyForStacking.push(stackPoint);
        });
        var stack = d3.stack()
            .keys(categories.map(category => category.id))
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
        return stack(readyForStacking);
    }

    // Use this.displayData to draw.
    updateVis() {
        let self = this;
        this.svg.selectAll("*")
            .remove();
        var stackedData = this.stackedData();
        var xScale = d3.scaleTime()
            .domain(d3.extent(this.displayData, d => d.datetime))
            .range([0, this.width]);
        var screenXToDataScale = d3.scaleLinear()
            .domain([0, this.width])
            .range([0, this.displayData.length - 1]);
        var yScale = d3.scaleLinear()
            .domain([d3.max(this.displayData, d => d.totalViews), 0])
            .range([0, this.height]);

        var numDays = new Set(this.displayData.map(d => d.datetime.getDay()))
            .size;
        var xAxis = this.svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(xScale)
                .ticks(numDays));

        var yAxis = this.svg.append("g")
            .call(d3.axisLeft(yScale)
                .ticks(5));

        var colorScale = d3.scaleOrdinal(d3.schemeCategory20)
            .domain(d3.keys(VideoCategory.getAllCategories()))

        var area = d3.area()
            .x(function(d) {
                return xScale(d.data.datetime);
            })
            .y0(function(d) {
                return yScale(d[0]);
            })
            .y1(function(d) {
                return yScale(d[1]);
            });

        this.svg
            .selectAll("#areaChart")
            .data(stackedData)
            .enter()
            .append("path")
            .style("fill", function(d) {
                return colorScale(new VideoCategory(+d.key));
            })
            .attr("d", function(d) {
                return area(d);
            })
            .on("click", d => {
                var point = this.displayData[Math.floor(screenXToDataScale(d3.event.x))];
                this.updateBreakdown(point, 5);
            })
            .on("mouseover", d => {
                d3.selectAll(".catText").remove();
                self.svg.append("text")
                    .attr("class", "catText")
                    .attr("x", (this.width-this.margin.left)/2)
                    .attr("y", 0)
                    .style("text-anchor", "middle")
                    .style("font-size", 20)
                    .text(new VideoCategory(d.key));
            })
            .on("mouseout", () => {
                 d3.selectAll(".catText").remove();
            });
        this.svg.append("text")
            .attr("transform", "translate(" + (-this.margin.left / 1.4) + "," + this.height / 2 + ")rotate(-90)")
            .style("text-anchor", "middle")
            .text("Total Views");
        this.svg.append("text")
            .attr("transform", "translate(" + (this.width / 2) + "," + (this.height + this.margin.bottom / 3) + ")")
            .style("text-anchor", "middle")
            .text("Time");
        this.svg.append("text")
            .attr("class", "countryTitle")
            .attr("x", (this.width-this.margin.left)/2)
            .attr("y", -this.margin.top/2)
            .style("text-anchor", "middle")
            .style("font-size", 28)
            .text(this.country);
    }

    // Show breakdown for the top /numSlices/ videos and other.
    updateBreakdown(point, numSlices) {
        var topVideos = point.videos.sort((v1, v2) => v2.views - v1.views)
            .slice(0, numSlices);

        var topViews = topVideos.map(v => v.views);
        var otherViews = point.totalViews - topVideos.reduce((accum, v) => accum + v.views, 0);

        var colorScale = d3.scaleOrdinal(d3.schemeCategory20c);

        var tipClass = "d3-tip";
        d3.selectAll("." + tipClass).remove();
        var tip = d3.tip()
            .attr("class", tipClass)
            .html(function(d, i) {
                if (i >= numSlices) {
                    return `<h2>Other videos</h2><br/>
                            <h4>${(otherViews / point.totalViews * 100).toFixed(1)}% of the total trending views.`;
                }
                var video = topVideos[i];
                return `<h2><a href="https://youtube.com/watch?v=${video.link}">${video.title}</a></h2><br/>
                        <h4>${(video.views / point.totalViews * 100).toFixed(1)}% of the total trending views.`;
            });

        this.breakdown.call(tip);

        var arcs = this.breakdown.selectAll(".arc")
            .data(d3.pie()(topViews.concat(otherViews)));
        arcs.enter()
            .append("path")
            .attr("class", "arc")
            .merge(arcs)
            .attr("fill", (d, i) => colorScale(i))
            .attr("d", d3.arc()
                .innerRadius(0)
                .outerRadius(this.breakdownRadius))
            .on("click", (d, i) => {
                tip.hide();
                tip.direction("se");
                tip.offset([-10, -10]);
                tip.show(d, i);
            })
            .on("mouseover", function() {
                d3.select(this).style("opacity", 0.6);
            })
            .on("mouseout", function() {
                d3.select(this).style("opacity", 1);
            });

        arcs.exit()
            .remove();
    }

}
