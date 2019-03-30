var width = 600;
var height = 600;

class StackedAreaChart {
	constructor(points) {
		//margins for the graph
		this.margin = { top: 20, right: 60, bottom: 200, left: 60 };
		this.points = points;
		this.svgWidth = width;
		this.svgHeight = height;
		this.svg = d3.select("#area-chart").append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.transform("translate",  "translate(" + this.margin.left + "," + this.margin.top + ")")

		// scales for the graph
		this.xScale = d3.scaleLinear().domain([0, points.length]).range([0, svgWidth]);
		this.yScale = d3.scaleLinear().domain([0,50]).range([0,svgHeight]);
		updateVis();
	}
	wrangle = function() {
		//if points > 5, remove first, push new points on to points
		// for (let i = 0; i < newPoints.vids.length; i++ ) {

		// }
		var stack = d3.stack().keys(["v1", "v2"]);
		stack(points);
		updateVis();
	}

	updateVis = function() {
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
	pointsToD = function(day) {
		let d = "M " + String(p[0][0]) + " " + String(p[0][1]) + " ";
		for (let i = 1; i < p.length; i++) {
			d += " l " + String(p[i][0]) + " " + String(p[i][1]);
		}
		d += " z";
		return d;
	}
}