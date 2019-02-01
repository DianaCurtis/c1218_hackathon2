class MapData {
    
    constructor(longitude, latitude) {
        /** The constructor for the MapData class takes in the Longitude and Latitude of the given user from the location.js file. We then set those as variables in the constructor so that any of the methods below may access this information. 
        * @constructor 
        */
        this.longitude = longitude;
        this.latitude = latitude;
    }

    /** The displayMap method makes the call out to the API via a script tag that is placed onto the DOM. This allows us to call the specific coordinates for the restaurant coordinates that are returned from the Yelp API and then pass those in as the center point of the map. 
    * We then append that map to the DOM at the div elelment that has the "map" ID.
    * There is also a variable to be able to set the zoom of the map (this is currently hardcoded at the default value.
    */
    displayMap() {
        var mapAPI = $("<script>").text(`mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obnRoZWhvbG1hbiIsImEiOiJjanJoZm5vNTIwNXprM3lwb204Ymx1cjgxIn0.er0RDpr6N8SgqInELAYjPg';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/johntheholman/cjrhga5256ww32snyx4x8vwm3',
            center: [${this.latitude},${this.longitude}],
            zoom: 13.6
        });
        var geojson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [${this.latitude}, ${this.longitude}]
                },
            }]
        };
        /** Add the markers to the actual map */
        geojson.features.forEach(function(marker) {

        /** Create an HTML element for each marker */
        var el = document.createElement('div');
        el.className = 'marker';

        /** Make the final marker and add it to the center point of the map */
        new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
        });`);
        $("#map").append(mapAPI);
    }
}