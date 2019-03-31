var width = 600;
var height = 600;

class StackedAreaChart {
	constructor(dataProvider) {
		this.dataProvider = dataProvider;
		//margins for the graph
		this.margin = { top: 20, right: 60, bottom: 200, left: 60 };
		this.dataSet1 = this.dataProvider.poll();
		this.dataSet2 = this.dataProvider.poll();
		this.dataSet3 = this.dataProvider.poll();
		this.svgWidth = width;
		this.svgHeight = height;
		this.svg = d3.select("#area-chart").append("svg")
			.attr("width", width)
			.attr("height", height)
		this.areaChart = this.svg.append("g");
		// scales for the graph
		// this.xScale = d3.scaleLinear().domain([0, this.dataSet1.length]).range([0, this.svgWidth]);
		// this.yScale = d3.scaleLinear().domain([0,50]).range([0, this.svgHeight]);
		this.wrangle();
	}

	wrangle() {
		var xScale = d3.scaleLinear()
			.domain([0, 2])
			.range([0, this.svgWidth]);

		var yScale = d3.scaleLinear()
			.domain([500000000, 0])
			.range([0, this.svgHeight]);



		var unstackedData = [];
		var cat0Views = [0,0,0];
		var cat1Views = [0,0,0];
		var cat2Views = [0,0,0];
		var cat3Views = [0,0,0];

		for (var i = 0; i < this.dataSet1.videos.length; i++) {
			if(this.dataSet1.videos[i].category.id == 0){
				cat0Views[0] += this.dataSet1.videos[i].views;
			}
			else if(this.dataSet1.videos[i].category.id == 1){
				cat1Views[0] += this.dataSet1.videos[i].views;
			}
			else if(this.dataSet1.videos[i].category.id == 2){
				cat2Views[0] += this.dataSet1.videos[i].views;
			}
			else if(this.dataSet1.videos[i].category.id == 3){
				cat3Views[0] += this.dataSet1.videos[i].views;
			}
		}

		for (var i = 0; i < this.dataSet2.videos.length; i++) {
			if(this.dataSet2.videos[i].category.id == 0){
				cat0Views[1] += this.dataSet2.videos[i].views;
			}
			else if(this.dataSet2.videos[i].category.id == 1){
				cat1Views[1] += this.dataSet2.videos[i].views;
			}
			else if(this.dataSet2.videos[i].category.id == 2){
				cat2Views[1] += this.dataSet2.videos[i].views;
			}
			else if(this.dataSet2.videos[i].category.id == 3){
				cat3Views[1] += this.dataSet2.videos[i].views;
			}
		}

		for (var i = 0; i < this.dataSet3.videos.length; i++) {
			if(this.dataSet3.videos[i].category.id == 0){
				cat0Views[2] += this.dataSet3.videos[i].views;
			}
			else if(this.dataSet3.videos[i].category.id == 1){
				cat1Views[2] += this.dataSet3.videos[i].views;
			}
			else if(this.dataSet3.videos[i].category.id == 2){
				cat2Views[2] += this.dataSet3.videos[i].views;
			}
			else if(this.dataSet3.videos[i].category.id == 3){
				cat3Views[2] += this.dataSet3.videos[i].views;
			}
		}

		for (var i = 0; i < 3; i++){
			unstackedData.push({
				year: i, 
				cat0Views: cat0Views[i],
				cat1Views: cat1Views[i],
				cat2Views: cat2Views[i],
				cat3Views: cat3Views[i]
			});
		}

		var stack = d3.stack()
			.keys(['cat0Views', 'cat1Views', 'cat2Views', 'cat3Views'])
			.order(d3.stackOrderNone)
    		.offset(d3.stackOffsetNone);

		var stackedData = stack(unstackedData);
		console.log(stackedData);


		var area = d3.area()
			.x(function(d, i){
				return xScale(i);
			})
			.y0(function(d){ 
				return yScale(d[0]); 
			})
    		.y1(function(d){
    		 	return yScale(d[1]); 
    		});

    	this.areaChart
    		.selectAll("#areaChart")
    		.data(stackedData)
    		.enter()
    		.append("path")
    			.style("fill", function(d,i)  {
    				return (i%2==0) ? "blue":"red";
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