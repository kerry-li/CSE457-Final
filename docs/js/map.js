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
		this.svg = d3.select("#map").append("svg").attr("width", this.width).attr("height", this.height).attr("fill", "grey")
		this.projection = d3.geoEquirectangular()
		.center([0,15])
		.scale([this.width/(2*Math.PI)])
		.translate([this.width/2,this.height/2]);
		this.path = d3.geoPath().projection(this.projection);
		this.drawMap();
	}

	drawMap() {
		let map = this;
		d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json", function(json) {
			var countriesGroup = map.svg.append("g").attr("id", "map");
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
			.attr("class", "country")
			.on("click", function(d, i) {
				console.log(d.properties.name);
			});
		})
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
