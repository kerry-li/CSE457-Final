class StackedAreaChart {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
        //margins for the graph
        this.margin = {
            top: 20,
            right: 60,
            bottom: 200,
            left: 100
        };
        this.data = [];
        this.width = 800;
        this.height = 600;
        this.svg = d3.select("#area-chart")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
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

    receiveNewData() {
        var newData = [];
        var point;
        while ((point = this.dataProvider.poll()) != null) {
            newData.push(point);
        }
        return newData;
    }

    wrangle() {
    	var newData = receiveNewData();
        Promise.all(newData)
            .then(newData => {
                this.data.push(...newData);
                var stackedData = this.stackedData();
                var xScale = d3.scaleLinear()
                    .domain([0, this.data.length])
                    .range([0, this.width]);

                var yScale = d3.scaleLinear()
                    .domain([d3.max(this.data, d => d.totalViews), 0])
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
                    .style("fill", function(d, i) {
                        return colorScale(i);
                    })
                    .attr("d", function(d) {
                        return area(d);
                    });

                this.updateVis();
            });
    }

    updateVis() {

    }


}
