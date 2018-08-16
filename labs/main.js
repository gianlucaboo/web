$(document).ready(function() {

var ebola;	
		var map = L.map('map', { 
			center: [9.175856, 13.117676], 
			zoom: 4,	
			minZoom: 4,
			maxZoom: 10,
			zoomControl:false
		});
	
		L.tileLayer('https://a.tiles.mapbox.com/v3/giuzgeo454.km4l8cpd/{z}/{x}/{y}.png', {
				attribution: '<a href="http://www.nature.com/articles/sdata201442#cite1"> Nature</a> ' 
		}).addTo(map)	



$.getJSON("http://idiosyncraticmapper.net/labs/geojson/ebola.json")    
		.done(function(data) {
			var info = processData(data);
			createPropSymbols(info.timestamps, data);
			createLegend(info.min,info.max);
	 	})
	
	
function processData(data) {
var timestamps = [1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
var min = 1976; 
var max = 2011;

for (var feature in data.features) {

var properties = data.features[feature].properties; 

for (var attribute in properties) { 

if ( attribute != 'id' &&
attribute != 'country' &&
attribute != 'virus' &&
attribute != 'lat' &&
attribute != 'lng' &&
attribute != 'date' &&
attribute != 'cases' ) {
						
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
	ebola = L.geoJson(data, {		
			pointToLayer: function(feature, latlng) {	

			return L.circleMarker(latlng, { 
				 fillColor: '#0C3',
				 color: '#0C3',
				 weight: 1, 
				 fillOpacity: 0.6
				 }).on({

				mouseover: function(e) {
					this.openPopup();
					this.setStyle({color: '#008122'});
				},
				mouseout: function(e) {
					this.closePopup();
					this.setStyle({color: '#008122'});
				}
				});			}
		}).addTo(map);
		
updatePropSymbols(timestamps[0])

}

function updatePropSymbols(timestamp) {
		
		ebola.eachLayer(function(layer) {
	
			var props = layer.feature.properties;
			var radius = calcPropRadius(props[timestamp]);
			var popupContent =  String(props[timestamp]) + 
					" observed cases:<br>" +
					"virus " + "<i>"+ props.virus + "<i/>";

			layer.setRadius(radius);
			layer.bindPopup(popupContent, { offset: new L.Point(0,-radius) });
		});
	}
	function calcPropRadius(attributeValue) {

		var scaleFactor = 3;
		var area = attributeValue * scaleFactor;
		return Math.sqrt(area/Math.PI)*2;			
	}



function createLegend(min, max) {
	 
if (min < 10) {
min = 50; 
}
if (max > 400) {
max = 400; 
}
		var legend = L.control( { position: 'topleft' } );

		legend.onAdd = function(map) {

		var legendContainer = L.DomUtil.create("div", "legend");  
		var symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
		var classes = [min,(max)/2, max]; 
		var legendCircle;  
		var lastRadius = 0;
		var currentRadius;
		var margin;

		L.DomEvent.addListener(legendContainer, 'mousedown', function(e) { 
			L.DomEvent.stopPropagation(e); 
		});  

		$(legendContainer).append("<h3 id='legendTitle'>Ebola Cases</h3>");
		
		for (var i = 0; i <= classes.length-1; i++) {  

			legendCircle = L.DomUtil.create("div", "legendCircle");  
			
			currentRadius = calcPropRadius(classes[i]);
			
			margin = -currentRadius - lastRadius - 2;

			$(legendCircle).attr("style", "width: " + currentRadius*2 + 
				"px; height: " + currentRadius*2 + 
				"px; margin-left: " + margin + "px" );	
							
			$(legendCircle).append("<span class='legendValue'>"+classes[i]+"</span>");

			$(symbolsContainer).append(legendCircle);

			lastRadius = currentRadius;

		}

		$(legendContainer).append(symbolsContainer); 

		return legendContainer; 

		};

		legend.addTo(map);  

	}
	
	function createSliderUI(timestamps) {
	
		var sliderControl = L.control({ position: 'bottomleft'} );

		sliderControl.onAdd = function(map) {

			var slider = L.DomUtil.create("input", "range-slider");
	
			L.DomEvent.addListener(slider, 'mousedown', function(e) { 
			L.DomEvent.stopPropagation(e); 
		});

		$(slider)
			.attr({'type':'range', 
				'max': timestamps[timestamps.length-1], 
				'min': timestamps[0], 
				'step': 1,
				'value': String(timestamps[0])})
	  		.on('input change', function() {
	  		updatePropSymbols($(this).val().toString());
			$(".temporal-legend").text(this.value);
	  	});
			return slider;
		}

		sliderControl.addTo(map)
		createTemporalLegend(timestamps[0]);  
	}
	
	function createTemporalLegend(startTimestamp) {

	var temporalLegend = L.control({ position: 'bottomleft' }); 

		temporalLegend.onAdd = function(map) { 
			var output = L.DomUtil.create("output", "temporal-legend");
 			$(output).text(startTimestamp)
			return output; 
		}

		temporalLegend.addTo(map); 
	}
	
	});