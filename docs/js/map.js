// var projection = d3.geoMercator();//geoEqualEarth();
// var path = d3.geoPath(projection);
// let svg = d3.select("body").append("svg").attr("width", 400).attr("height", 400);
// svg.append("path").attr("d", path).attr("stroke-width", "3px");

// console.log(projection);
// console.log(path);
class GeoMap {
    constructor() {
        this.countries = [];
        this.availableCountries = ["United States", "Canada", "Mexico", "United Kingdom", "Russia", "Brazil", "Australia", "India", "Turkey", "Japan"];
        this.width = 1200;
        this.height = 500;
        this.svg = d3.select("#map")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("fill", "grey")
        this.projection = d3.geoEquirectangular()
            .center([0, 15])
            .scale([this.width / (2 * Math.PI)])
            .translate([this.width / 2, this.height / 2]);
        this.path = d3.geoPath()
            .projection(this.projection);
        this.data;
        this.selectedCountry;
        // this.dataProvider;
        this.drawMap();
        // this.stackedAreaChart = stackedAreaChart;
    }

    drawMap() {
        let map = this;
        d3.json("data/custom50.json", function(json) {
            // let data;
            const boxHeight = map.height / 20;
            // map.svg.append("rect")
            // 	.attr("x", 0)
            // 	.attr("y", this.height*(19/20))
            // 	.attr("width", this.width/20)
            // 	.attr("height", boxHeight)
            // 	.attr("fill", "white")
            // map.data = json.features;
            var countriesGroup = map.svg.append("g")
                .attr("id", "map");
            countriesGroup.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", map.width)
                .attr("height", map.height);
            let countries = countriesGroup
                .selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", function(d) {
                    return map.path(d);
                })
                .attr("fill", function(d) {
                    return (map.availableCountries.includes(d.properties.name)) ? "red" : "white";
                })
                .attr("stroke-width", 1)
                .attr("stroke", "grey")
                .attr("id", function(d, i) {
                    return d.properties.iso_a3;
                })
                .attr("class", function(d) {
                    return (map.availableCountries.includes(d.properties.name)) ? "availableCountry" : "nonAvailableCountry";
                })

                .on("mouseover", function(d) {
                    d3.select(".countryText")
                        .remove();
                    map.svg.append("text")
                        .attr("class", "countryText")
                        .attr("x", 10 + (map.width / 12))
                        .attr("y", map.height * (39 / 40) - 5)
                        .text(function() {
                            let t = d.properties.name;
                            if (!map.availableCountries.includes(d.properties.name)) {
                                t += " - N/A"
                            }
                            return t;
                        })
                        .style("text-anchor", "middle")

                })
                // .on("mousemove", function(d) {

                // 	// let coordinates = d3.mouse(this);
                // 	// map.svg.append("text")
                // 	// 	.attr("x", coordinates[0])
                // 	// 	.attr("y", coordinates[1])
                // 	// 	// .attr("class", function(d) {
                // 	// 	// 	return (map.availableCountries.includes(d.properties.name)) ? "availableCountry" : "nonAvailableCountry";
                // 	// 	// })
                // 	// 	.text(d.properties.name)
                // 	// 	.style("text-anchor", "middle");
                // })
                .on("mouseoff", function() {

                })
                .on("click", function(d, i) {
                    d3.select("#areaChartSVG")
                        .remove();
                    // map.stackedAreaChart.beginDataCollection();
                    map.selectedCountry = d.properties.name;
                    console.log(d.properties.name);
                    var dataProvider = FakeDataProvider.withNumVideos(1000, 50, 4);
                    var chart = new StackedAreaChart(dataProvider);
                    console.log(chart);
                });
            map.svg.append("rect")
                .attr("x", 10)
                .attr("y", map.height * (19 / 20) - 10)
                .attr("width", map.width / 6)
                .attr("height", boxHeight)
                .attr("fill", "white")
        });
        // this.data = map.data;
        // console.log(this.data);
    }


}


// const width = 1200;
// const height = 500;
// var projection = d3.geoEquirectangular()
// 	.center([0,15])
// 	.scale([width/(2*Math.PI)])
// 	.translate([width/2,height/2]);
// var path = d3.geoPath()
// 	.projection(projection);
// const availableCountries = ["United States", "Canada", "Mexico", "United Kingdom", "Russia", "Brazil", "Australia", "India", "Turkey", "Japan"];
