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
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.interval = 10000; // Milliseconds.
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
        this.updateVis();
    }

    // Prepare this.displayData for graphing in the area chart.
    stackedData() {
        var categories = VideoCategory.getAllCategories();
        var readyForStacking = [];
        this.displayData.forEach(point => {
            var stackPoint = {};
            categories.forEach(category => {
                stackPoint[category.id] = point.viewsForCategory(category);
            });
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
            });
        this.svg.append("text")
            .attr("transform", "translate("+(-this.margin.left/1.4)+","+this.height/2+")rotate(-90)")
            .style("text-anchor", "middle")
            .text("Total Views");
        this.svg.append("text")
            .attr("transform", "translate("+(this.width/2)+","+(this.height+30)+")")
            .style("text-anchor", "middle")
            .text("Time (seconds)");
    }


}
