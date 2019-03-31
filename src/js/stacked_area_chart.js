var width = 600;
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
        var newData = [];
        var point;
        while ((point = this.dataProvider.poll()) != null) {
            newData.push(point);
        }

        Promise.all(newData)
            .then(newData => {
                this.data.push(...newData);
                var stackedData = this.stackedData();
                var xScale = d3.scaleLinear()
                    .domain([0, this.data.length])
                    .range([0, this.svgWidth]);

                var yScale = d3.scaleLinear()
                    .domain([d3.max(this.data, d => d.totalViews), 0])
                    .range([0, this.svgHeight]);
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
            });

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
