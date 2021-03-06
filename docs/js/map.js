class GeoMap {
    constructor(availableCountries, countryCodes, dataProvider) {
        this.availableCountries = availableCountries;
        this.countryCodes = countryCodes;
        this.width = window.innerWidth;
        this.height = (5.0 / 12.0) * this.width;
        this.dataProvider = dataProvider;
        //https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
        this.svg = d3.select("#map")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("fill", "#e0ffff")

        this.projection = d3.geoEquirectangular()
            .center([0, 15])
            .scale([this.width / (2 * Math.PI)])
            .translate([this.width / 2, this.height / 2]);
        this.path = d3.geoPath()
            .projection(this.projection);
        this.data;
        this.selectedCountry;
        this.dataProvider;
        this.chart;
        this.drawMap();
    }

    drawMap() {
        //adopted much of the code from the example at: https://medium.com/@andybarefoot/making-a-map-using-d3-js-8aa3637304ee
        let map = this;
        d3.json("data/custom50.json", function(json) {
            const boxHeight = map.height / 20;
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
                .attr("stroke", "black")
                .attr("id", function(d, i) {
                    return map.countryCodes[i];
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
                            if (!map.availableCountries.includes(d.properties.name)) t += " - N/A";
                            return t;
                        })
                        .attr("stroke", "black")
                        .attr("fill", "black")
                        .style("font-size", map.width / 6 / 12)
                        .style("text-anchor", "middle");
                })
                .on("mouseout", function() {
                    d3.select(".countryText")
                        .remove();
                    if (map.selectedCountry !== "") {
                        map.svg.append("text")
                            .attr("class", "countryText")
                            .attr("x", 10 + (map.width / 12))
                            .attr("y", map.height * (39 / 40) - 5)
                            .attr("stroke", "black")
                            .attr("fill", "black")
                            .style("font-size", map.width / 6 / 12)
                            .text(map.selectedCountry)
                            .style("text-anchor", "middle")
                    }
                })
                .on("click", function(d, i) {
                	var countryCode = d.properties.name;
                	if (!map.availableCountries.includes(countryCode)) {
                		return;
                	}
                    // document.getElementById("chart-title").innerHTML = countryCode;
                    d3.select("#area-chart")
                        .selectAll("svg")
                        .remove();
                    map.selectedCountry = countryCode;
                    map.dataProvider.regionCode = d.properties.iso_a2;
                    map.chart = new StackedAreaChart(map.dataProvider, countryCode);
                });
            map.svg.append("rect")
                .attr("x", 10)
                .attr("y", map.height * (19 / 20) - 10)
                .attr("width", map.width / 6)
                .attr("height", boxHeight)
                .attr("fill", "white")
        });
    }
}
