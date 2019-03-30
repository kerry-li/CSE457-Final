class StackedAreaChart() {
	let points = [
		{"Day": 1, "v1": 10, "v2": 20},
		{"Day": 2, "v1": 15, "v2": 23},
		{"Day": 3, "v1": 20, "v2": 30},
		{"Day": 4, "v1": 15, "v2": 10},
		{"Day": 5, "v1": 25, "v2": 15},
	];
	let videos = [];
	const xMaxLength = 5;
	var xScale; 
	var yScale;
	var svg;
	var svgWidth;
	var svgHeight;
	var area;
	constructor(width, height) {
		// this.points=points;
		this.svgWidth = width;
		this.svgHeight = height;
		this.svg = d3.select("body").append("svg").attr("width", width).attr("height", height)
			.append("g")
		
		this.xScale = d3.scaleLinear().domain([0, points.length]).range([0, svgWidth]);
		this.yScale = d3.scaleLinear().domain([0,50]).range([0,svgHeight]);
		updateVis();
	}
	function wrangle() {
		//if points > 5, remove first, push new points on to points
		// for (let i = 0; i < newPoints.vids.length; i++ ) {

		// }
		var stack = d3.stack().keys(["v1", "v2"]);
		stack(points);
		updateVis();
	}

	function updateVis() {
		// let p = [];
		// for (let i = 0; i < 2; i++) {
		// 	for (let j = 0; j < points.length; j++) {

		// 	}
		// }
		// for (i in points) {
		// 	p
		// }
		// var area 
		
		this.svg.selectAll("path").data(points).enter()
		.append("path")
		.attr()
		// .attr("d")
	}

	// function updateScale() {

	// }

	function tootlTipBullshit() {

	}
	//p format: [ [0,1], [1,1] .....]
	function pointsToD(day) {
		let d = "M " + String(p[0][0]) + " " + String(p[0][1]) + " ";
		for (let i = 1; i < p.length; i++) {
			d += " l " + String(p[i][0]) + " " + String(p[i][1]);
		}
		d += " z";
		return d;
	}
}