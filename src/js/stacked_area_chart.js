var width = 800;
var height = 600;

class StackedAreaChart {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
        // //margins for the graph
        // this.margin = {
        //     top: 20,
        //     right: 60,
        //     bottom: 200,
        //     left: 60
        // };
        this.data = [];
        this.svgWidth = width;
        this.svgHeight = height;
        this.svg = d3.select("#area-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
        this.areaChart = this.svg.append("g");
        // scales for the graph
        // this.xScale = d3.scaleLinear().domain([0, this.dataSet1.length]).range([0, this.svgWidth]);
        // this.yScale = d3.scaleLinear().domain([0,50]).range([0, this.svgHeight]);
        this.wrangle();
    }

    // Prepare this.data for graphing in the area chart.
    stackedData() {
        var categories = VideoCategory.getAllCategories();
        var readyForStacking = [];
        this.data.forEach(point => {
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

    wrangle() {
        var point;
        while ((point = this.dataProvider.poll()) != undefined) {
            this.data.push(point);
        }

        var xPadding = 75;
        var farXPadding = 15;
        var yPadding = 30;

        var xScale = d3.scaleLinear()
            .domain([0, this.data.length-1])
            .range([xPadding, this.svgWidth-farXPadding]);

        var yScale = d3.scaleLinear()
            .domain([d3.max(this.data, d => d.totalViews), 0])
            .range([0, this.svgHeight-yPadding]);

		var xAxis = this.svg.append("g")
    		.attr("transform", "translate(0," + (height-yPadding) + ")")
    		.call(d3.axisBottom(xScale).ticks(this.data.length-2))
		
		var yAxis = this.svg.append("g")
			.attr("transform", "translate(" + xPadding + ",0)")
    		.call(d3.axisLeft(yScale).ticks(5))   

    	var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
    	colorScale.domain(d3.keys(VideoCategory.getAllCategories()))

        var stackedData = this.stackedData();

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

        this.areaChart
            .selectAll("#areaChart")
            .data(stackedData)
            .enter()
            .append("path")
            .style("fill", function(d, i) {
            	console.log(colorScale(i))
                return colorScale(i);
            })
            .attr("d", function(d) {
                return area(d);
            });

        this.updateVis();
    }

    updateVis() {

    }

    
}
