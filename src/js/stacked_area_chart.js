var width = 800;
var height = 600;

class StackedAreaChart {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
        //margins for the graph
        this.margin = {
            top: 20,
            right: 60,
            bottom: 200,
            left: 60
        };
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
        var yPadding = 30;
        var xScale = d3.scaleLinear()
            .domain([0, this.data.length])
            .range([xPadding, this.svgWidth]);

        var yScale = d3.scaleLinear()
            .domain([d3.max(this.data, d => d.totalViews), 0])
            .range([0, this.svgHeight-yPadding]);
   //      var xScale = d3.scaleLinear()
			// .domain([0, 2])
			// .range([0, this.svgWidth]);
		var xAxis = this.svg.append("g")
    		.attr("transform", "translate(0," + (height-yPadding) + ")")
    		.call(d3.axisBottom(xScale).ticks(3))
		// var yScale = d3.scaleLinear()
		// 	.domain([this.svgHeight, 0])
		// 	.range([0, sum]);
		var yAxis = this.svg.append("g")
			.attr("transform", "translate(" + xPadding + ",0)")
    		.call(d3.axisLeft(yScale).ticks(5))    


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
                return (i % 2 == 0) ? "blue" : "red";
            })
            .attr("d", function(d) {
                return area(d);
            });

        this.updateVis();
    }

    updateVis() {
        // let p = [];
        // for (let i = 0; i < 2; i++) {
        // 	for (let j = 0; j < points.length; j++) {

        // 	}
        // }
        // for (i in points) {
        // 	p
        // }
        // var area 

        // this.svg.selectAll("path").data(points).enter()
        // .append("path")
        // .attr()
        // .attr("d")
    }

    // function updateScale() {

    // }


    //p format: [ [0,1], [1,1] .....]
    pointsToD(day) {
        let d = "M " + String(p[0][0]) + " " + String(p[0][1]) + " ";
        for (let i = 1; i < p.length; i++) {
            d += " l " + String(p[i][0]) + " " + String(p[i][1]);
        }
        d += " z";
        return d;
    }
}
