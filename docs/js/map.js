// var projection = d3.geoMercator();//geoEqualEarth();
// var path = d3.geoPath(projection);
// let svg = d3.select("body").append("svg").attr("width", 400).attr("height", 400);
// svg.append("path").attr("d", path).attr("stroke-width", "3px");

// console.log(projection);
// console.log(path);
class GeoMap {
    constructor(availableCountries) {
        this.countries = [];
        this.availableCountries = availableCountries;
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
        this.drawMap();
    }

    drawMap() {
        let map = this;
        d3.json("data/custom50.json", function(json) {
            const boxHeight = map.height / 20;
            // console.log(json.features);
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
                    // console.log(d)
                    return (map.availableCountries.includes(d.properties.name)) ? "availableCountry" : "nonAvailableCountry";
                })
                .on("mouseover", function(d) {
                    d3.select(".countryText").remove();
                    map.svg.append("text")
                        .attr("class", "countryText")
                        .attr("x", 10 + (map.width / 12))
                        .attr("y", map.height * (39 / 40) - 5)
                        .text(function() {
                            let t = d.properties.name;
                            if (!map.availableCountries.includes(d.properties.name)) t += " - N/A";
                            return t;
                        })
                        .style("text-anchor", "middle");
                })
			    .on("mouseout", function() {
				    d3.select(".countryText").remove();
				    if (map.selectedCountry !== "") {
					   map.svg.append("text")
					   .attr("class", "countryText")
					   .attr("x", 10+(map.width/12))
					   .attr("y", map.height*(39/40)-5)
					   .text(map.selectedCountry)
					   .style("text-anchor", "middle")
				    }
			    })
			    .on("click", function(d, i) {
				    d3.select("#area-chart").selectAll("svg").remove();
                    // d3.select("body").append("div").attr("id", "area-chart");
				    map.selectedCountry = d.properties.name;
                    d3.tsv('../countries.tsv', function(data) {
                        for (let i = 0; i < data.length; i++) {
                            if(map.selectedCountry === data[i].country){
                                var countryCode = data[i].country_code;
                                console.log(countryCode);
                                var dataProvider = YoutubeDataProvider.noInitialData(countryCode);
                               // var dataProvider = FakeDataProvider.withNumVideos(1000, 50, 4);
                                var chart = new StackedAreaChart(dataProvider);
                            }
                        }
                    })
			    });
			    map.svg.append("rect")
			    .attr("x", 10)
			    .attr("y", map.height*(19/20)-10)
			    .attr("width", map.width/6)
			    .attr("height", boxHeight)
			    .attr("fill", "white")
		});
	}

}