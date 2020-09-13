//function to create map
function createMap(earthquakes){

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    //layers: [streetmap, earthquakes]
    });

 // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
 var geojsonMarkerOptions = {
    //fillcolor:"#DF3A01",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Location:<hr>" + feature.properties.place +
      "</h3><hr><p>Date:<hr>" + new Date(feature.properties.time) + 
      "</p><hr><p>Magnitude:<hr>" + feature.properties.mag + "</p>");
  }

function markercolor(magnitude){

    switch(true){

        case (magnitude<=1):
            return "#A5DF00";
        case (magnitude>1 && magnitude<=2):
            return "#D7DF01";
        case (magnitude>2 && magnitude<=3):
            return "#DBA901";
        case (magnitude>3 && magnitude<=4):
            return "#DF7401";
        case (magnitude>4 && magnitude<=5):
            return "#DF3A01";
        default:
            return "#DF0101";

    }

}

var streetmap= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(myMap)


// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
// var earthquakes = 
L.geoJSON(earthquakes, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    style: function(feature) {
        return{
            radius:feature.properties.mag*4
            ,fillColor:markercolor(feature.properties.mag)
        }
    },
    onEachFeature:onEachFeature
}).addTo(myMap);


}

//Call earthquake data for last 7 days and build on map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", data=>{
    console.log(data)
    createMap(data.features);
});