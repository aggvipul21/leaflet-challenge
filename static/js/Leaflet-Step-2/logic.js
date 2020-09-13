//function to find color based on value of magnitude of earthquake
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
//function to create map
function createMap(earthquakes){

    console.log(earthquakes)
    //outdoormap
    var outdoormap= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
    })
    // .addTo(myMap)

    //satelitte map
    var satellitemap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    })

    //gryscalemap
    var grayscalemap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    })

    var tectonicPlates=new L.LayerGroup()
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", data=>{
           
        L.geoJSON(data, {
            color:"red",
            weight:2
        }).addTo(tectonicPlates)
    });

    //console.log(tectonicPlates)

    //Create variable to store all base maps
    var baseMaps={
        "outdoor":outdoormap,
        "satellite":satellitemap,
        "grayscale":grayscalemap
    }

    //Create variable to store all overlay maps
    var overlayMaps={
        "Earthquake":earthquakes,
        "Fault Line":tectonicPlates
    }
    
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [outdoormap,earthquakes,tectonicPlates]
    });
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
    // Create a legend to display information about our map
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map){
        var div = L.DomUtil.create('div', 'legend');
        grades = [0,1,2,3,4,5];
        for (var i=0;i<grades.length;i++){
            div.innerHTML += '<i style="background:' + markercolor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
}

function createEarthQuakeLayer(earthquakeData){

    console.log(earthquakeData)
    //function to set the style of circle shown as markesr for earthquake
    var geojsonMarkerOptions = {
        //fillcolor:"#DF3A01",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //Function to show pop-up on click of each circle
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p> <b>Location:<hr>" + feature.properties.place +
          "</p><hr><p><b>Date:<hr>" + new Date(feature.properties.time) + 
          "</p><hr><p><b>Magnitude:<hr>" + feature.properties.mag + "</p>");
    }
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = 
    L.geoJSON(earthquakeData, {
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
    })

    // Pass erthquake map to create map function
    createMap(earthquakes);
    
}

//Function to use faultline data to add on map
function createfaultline(){

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", data=>{
        //console.log(data.features)
        //Variable for line styling
        var linestyle={
        color:"red",
        weight:5,
        opacity:0.65
        }
    
        var faultline = L.geoJSON(data, {
            style:linestyle
        })
        return(faultline);
    });
    
}
    
//Call earthquake data for last 7 days and build on map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", data=>{
    console.log(data)
    createEarthQuakeLayer(data.features);
});


