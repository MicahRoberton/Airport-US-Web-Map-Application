// 1. Create a map object.
var mymap = L.map('map', {
    center: [40.7511, -90.7401],
    zoom: 4,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var airports = null;

// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('Set2').mode('lch').colors(10);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 13; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// Get GeoJSON and put on it on the map when it loads
airports= L.geoJson.ajax("assets/airports.geojson", {
  // assign a function to the onEachFeature parameter of the cellTowers object.
  // Then each (point) feature will bind a popup window.
  // The content of the popup window is the value of `feature.properties.company`
  onEachFeature: function (feature, layer) {
      layer.bindPopup(popup(feature));
      return feature.properties.STATE;
  },

  pointToLayer: function (feature, latlng) {
        var id = 0;

        if (feature.properties.CNTL_TWR == "Y") {
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-building'}); color: });
        } else { // "N"
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane'})});
        }
    },

    attribution: 'Airport Data &copy; HIFLD | USA &copy; USA Data & Research | Base Map &copy; CartoDB | Made By Micah Roberton'
}).addTo(mymap);

function popup(feature) {
    var phrase1 = ' is';
    var phrase2 = 'an airport with Control Tower.';
    if (feature.properties.CNTL_TWR == "Y") {
        return feature.properties.AIRPT_NAME + phrase1 + ' ' + phrase2;
    } else {
        return feature.properties.AIRPT_NAME + phrase1 + ' NOT ' + phrase2;
    }
}

// 6. Set function for color ramp
colors = chroma.scale(['#ffff00','#ff0000'])
    .mode('lch').colors(6)

function setColor(density) {
    var id = 0;
    if (density > 61) { id = 4; }
    else if (density > 46 && density <= 60) { id = 3; }
    else if (density > 12 && density <= 45) { id = 2; }
    else if (density > 3 &&  density <= 11) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// 7. Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#ffff00',
        dashArray: '4'
    };
}

// 8. Add county polygons
// create counties variable, and assign null to it.
var counties = null;
counties = L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(mymap);


// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// 10. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b># How many Airports each State has</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 61+ </p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 46-60 </p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 12-45 </p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 3-11 </p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-2 </p>';
    div.innerHTML += '<hr><b>Airport<b><br />';
    div.innerHTML += '<i class="fa fa-building marker-color-2"></i><p> Airport with tower </p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> Just Airport </p>';
    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
