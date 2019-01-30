class MapData {
    constructor(longitude, latitude){
        this.longitude = longitude;
        this.latitude = latitude;
        console.log(this.longitude, this.latitude);
        //this.clickHandler = this.clickHandler.bind(this);
        //this.displayMap = this.displayMap.bind(this);
    }

    displayMap(){
        console.log("you have rendered the map!");
        var mapAPI = $("<script>").text(`mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obnRoZWhvbG1hbiIsImEiOiJjanJoZm5vNTIwNXprM3lwb204Ymx1cjgxIn0.er0RDpr6N8SgqInELAYjPg';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/johntheholman/cjrhga5256ww32snyx4x8vwm3',
            center: [${this.latitude},${this.longitude}],
            zoom: 13.6
        });`);

        $("#map").append(mapAPI);
    }
}