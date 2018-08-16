//LOAD THE DOCUMENT ONLY WHEN EVERYTHING IS LOADED
$(document).ready(function() {
	
	
//1.1. Web map settings (center, zoom, zoom control)
var time;	
//HERE YOU HAVE TO DEFINE THE BOUNDS OF YOUR WEBMAP: http://leafletjs.com/reference.html#latlngbounds
//var bounds = new L.LatLngBounds(new L.LatLng(45.76560699, 5.89141846), new L.LatLng(47.82975208, 10.61004639));
	var map = L.map('map', { 
			center: [50.102222, 4.154167],
			zoom: 4,	
			minZoom: 4,
			maxZoom: 10,
			zoomControl:false,
			//maxBounds:bounds

		});
	
		L.tileLayer('https://{s}.tiles.mapbox.com/v4/dariooertle.m5bne759/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFyaW9vZXJ0bGUiLCJhIjoiY0U0YmtJVSJ9.HF_Z4A2k3lGJJSoFV9n34w'
// HERE YOU SHOULD PROVIE THE RIGHT REFERENCE FOR THE BASEMAP		
		//, {
		//		attribution: '<a href="http://www.nature.com/articles/sdata201442#cite1"> Nature</a> ' 
		//}
		).addTo(map)	



$.getJSON("http://www.geo.uzh.ch/~gboo/festivals/alldatatime.json")    
		.done(function(data) {
			var info = processData(data);
			createPropSymbols(info.timestamps, data);
			});

function processData(data) {
	var timestamps = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
	var min = 19; 
	var max = 35;

	for (var feature in data.features) {

		var properties = data.features[feature].properties; 

			for (var attribute in properties) { 

				if ( attribute != 'Name' ){
						
	if ( $.inArray(attribute,timestamps) === -1) {timestamps.push(attribute);}

	if (properties[attribute] < min) {min = properties[attribute];}

	if (properties[attribute] > max) {max = properties[attribute];}
	}
	}
	}

	return {
	timestamps : timestamps,
	min : min,
	max : max
	}
	}
	
function createPropSymbols(timestamps, data) {		
time = L.geoJson(data).addTo(map); 
}
	});
