class LocDataTemplate {
    constructor(){
        this.ip = 0;
        this.latitude = 0;
        this.longitude = 0;
        this.zip = 0;
        this.city = '';

        this.getIp();
        // this.getIp = this.getIp.bind(this);
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.getIp = this.getIp.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.runThisWhenDataComesBack = this.runThisWhenDataComesBack.bind(this);
        this.functionToRunMap = this.functionToRunMap.bind(this);
    }

    addEventHandlers() {
        $('#accept').click(this.getLocation);
        $("#yesButton").click(this.functionToRunMap);
    }

    getIp() {
        $.getJSON("http://jsonip.com?callback=?", (data) => {
            // alert("Your ip: " + data.ip);
            this.ip = data.ip;
            console.log('getIP:' + this.ip );
            //
            // var ipDiv = $('<div>').text(this.ip).attr('id', 'ipAddr');
            // $('body').append(ipDiv);
            // return ip;
            // loadApi(ip);
            // debugger;

            // this.getLocation();
            this.addEventHandlers();
        });
    }

    getLocation() {
        $('.landing_page').remove();
        $('.display_category_options_page').removeClass('hide');

        // var mip = '174.76.22.234';
        var access_key = 'c4d72f43b4c7bbf8a0f17e939dd57438\n';

        var ajaxCallOptionsGeoIp = {
            url: 'http://api.ipstack.com/' + this.ip + '?access_key=' + access_key,
            dataType: 'jsonp',
            success: this.runThisWhenDataComesBack,
            error: this.functionToRunWhenFailed
        };

        $.ajax( ajaxCallOptionsGeoIp );
    }

    runThisWhenDataComesBack( response ) {
        // debugger;

        // response.feed.entry[0]['img:image'][0].label;
        // var responseObject = JSON.parse(response);
        console.log('Success was called ' );
        console.log(response);

        this.city = response.city;
        this.zip = response.zip;
        this.latitude = response.latitude;
        this.longitude = response.longitude;


        console.log('City: ' + this.city);
        console.log('Zip: ' + this.zip);
        console.log('Latitude ' + this.latitude);
        console.log('Longitude ' + this.longitude);

        var locationDiv = $('<div>').text(this.zip +' ' + this.city).attr('id', 'location');
        var latLongDiv = $('<div>').text(this.latitude + ', ' + this.longitude).attr('id','latLong');

        // $('body').append(locationDiv,latLongDiv);

        // createMap(city);
        // crime(latitude, longitude);

        var linkToWeather = new WeatherData(this.city);
        linkToWeather.getWeatherData();

        var linkToYelp = new YelpData(this.city, this.latitude, this.longitude);
        linkToYelp.getData;
    }

    functionToRunWhenFailed(response) {
        console.log('Failed');
        console.log(response);
    }

    functionToRunMap(){
        var linkToMap = new MapData(this.latitude, this.longitude);
        $(".display_restaurant_data_page").hide();
        $(".full_restaurant_page").removeClass("hide");
        linkToMap.displayMap();
    }

}