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
            .attr("height", this.height+this.margin.bottom + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.interval = 1000; // Milliseconds.
        this.receiveNewData();
        this.receiveNewData();
        setInterval((function(self) { //Self-executing func which takes 'this' as self
            return function() { //Return a function in the context of 'self'
                self.receiveNewData(); //Thing you wanted to run as non-window 'this'
            }
        })(this), this.interval);
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
        this.displayData = this.data;
        // console.log(this.data)
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
            readyForStacking.push(stackPoint);
            // console.log("stackpoint")
            // console.log(stackPoint)
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

        // let html = 
        // let blah = d3.mouse(this.svg);
        var tip = d3.tip().attr('class', 'd3-tip')
            // .direction('e')
            // .offset((d, i) => {
            //     console.log(d)
            //     // let coordinates = d3.mouse(lmao.svg);
            //     return [0,0];//lmao.svg.width];
            // })
            .html(function(d) {
                // console.log("DDDDDDDDdddddddddd")
                // console.log()
        // console.log(lmao.displayData)

                // let avg =0;
                var categories = new Array(VideoCategory.getAllCategories().length).fill([]);
                // const yeet = this.displayData[i].videos;
                for (let i = 0; i < lmao.displayData.length; i++) {
                    let videos = lmao.displayData[i].videos;
                    // console.log(videos);
                    for (let j = 0; j < videos.length; j++) {
                        // console.log
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
                //TODO
                let s = "";
                let currentCat = categories[d.key];
                currentCat.sort((a,b) => {return b.views-a.views});
                // console.log(currentCat)
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
        var xScale = d3.scaleLinear()
            .domain([0, this.displayData.length])
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
            .x(function(d, i) {
                return xScale(i);
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
                console.log()
                
                // tip.style('top', y);
                // tip.style('left', x);

                tip.offset([y, x-200])
                // tip.direction('e')
                // tip.offset(() => {
                //     return [0,-this.width]
                // })
                tip.show(d);
            })
            .on("mousemove", function(d, i) {
                var x = d3.event.x;
                var y = d3.event.y;
                console.log()
                
                // tip.style('top', y);
                // tip.style('left', x);

                tip.offset([y+(50*i), x-200])
                // tip.direction('e')
                // tip.offset(() => {
                //     return [0,-this.width]
                // })
                tip.show(d);
            })
            .on("mouseout", 
                // console.log(tip.hover)
                tip.hide
            );
        this.svg.append("text")
            .attr("transform", "translate("+(-this.margin.left/1.4)+","+this.height/2+")rotate(-90)")
            .style("text-anchor", "middle")
            .text("Total Views");
        this.svg.append("text")
            .attr("transform", "translate("+(this.width/2)+","+(this.height+30)+")")
            .style("text-anchor", "middle")
            .text("Time (seconds)");
        this.svg.call(tip);
    }

    tooltipRender(data) {

    }

}
