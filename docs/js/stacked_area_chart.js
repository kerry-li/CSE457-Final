class StackedAreaChart {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
        this.margin = {
            top: 20,
            right: 60,
            bottom: 200,
            left: 100
        };
        this.data = [];
        this.displayData = this.data;
        this.width = 800;
        this.height = 600;
        this.svg = d3.select("#area-chart")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.bottom + this.margin.top + this.margin.bottom)
            .append("g")
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
        let lmao = this;
        d3.selectAll(".d3-tip").remove();
        var tip = d3.tip().attr('class', 'd3-tip')
            .html(function(d) {
                var categories = new Array(VideoCategory.getAllCategories().length).fill([]);
                for (let i = 0; i < lmao.displayData.length; i++) {
                    let videos = lmao.displayData[i].videos;
                    for (let j = 0; j < videos.length; j++) {
                        // if (categories[videos[i].category.id].includes(videos[i].author)) {
                        //     console.log("YAAAS")
                        // } else {
                            categories[videos[j].category.id].push({
                                "author": videos[j].author,
                                "links": [videos[j].link],
                                "views": videos[j].views,
                                "titles": [videos[j].title]
                            })
                            // console.log("add author");
                        // }
                    }
                }
                let s = "";
                let currentCat = categories[d.key];
                currentCat.sort((a,b) => {return b.views-a.views});
                for (let i = 0; i < 5; i++) {
                    s += "<li>Author: " + String(currentCat[i]['author']) + "<br>";
                    s += 'Title: <a href="'+ currentCat[i]['links'][0]+ '">' + currentCat[i]['titles'][0]+"</a>";
                    s += "Views: " + currentCat[i]['views'] + "</li>";
                }
                let yeet = "<h2>"+ String(new VideoCategory(+d.key)) +"</h2><ul>" + s + "</ul>";
                return yeet;

            });



        this.svg.selectAll("*")
            .remove();
        var stackedData = this.stackedData();
        //console.log(stackedData);
        var xScale = d3.scaleTime()
            .domain(d3.extent(this.displayData, d => d.datetime))
            .range([0, this.width]);

        var yScale = d3.scaleLinear()
            .domain([d3.max(this.displayData, d => d.totalViews), 0])
            .range([0, this.height]);

        var xAxis = this.svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(xScale)
                .ticks(3))

        var yAxis = this.svg.append("g")
            .call(d3.axisLeft(yScale)
                .ticks(5))

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
            .on("mouseover", function(d) {
                var x = d3.event.x;
                var y = d3.event.y;
                tip.offset([y, x-200])
                tip.show(d);
            })
            .on("mousemove", function(d, i) {
                var x = d3.event.x;
                var y = d3.event.y;
                tip.offset([y+(50*i), x-200])
                tip.show(d);
            })
            .on("mouseout", tip.hide);
        this.svg.append("text")
            .attr("transform", "translate("+(-this.margin.left/1.4)+","+this.height/2+")rotate(-90)")
            .style("text-anchor", "middle")
            .text("Total Views");
        this.svg.append("text")
            .attr("transform", "translate("+(this.width/2)+","+(this.height + this.margin.bottom / 3)+")")
            .style("text-anchor", "middle")
            .text("Time");
        this.svg.call(tip);
    }

    tooltipRender(data) {

    }

}
