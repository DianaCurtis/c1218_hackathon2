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

    }

    // Add click handler to the Accept button on the homepage
    // Add click handler to the yes button on the page where the user makes a decision on a food choice
    addEventHandlers() {
        $('#accept').click(this.getLocation);
    }

    // Get the IP address of the user once they load the page
    getIp() {
        $.getJSON("http://jsonip.com?callback=?", (data) => {
            this.ip = data.ip;
            // console.log('getIP:' + this.ip );

            this.addEventHandlers();
        });
    }

    // Once the user clicks on accept we are sending their IP to the API to get their location
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

    // If the API call is successful we then grab the following data:
        // City, Zip, Latitude, Longitude
    runThisWhenDataComesBack( response ) {
        // console.log('Success was called ' );
        // console.log(response);

        this.city = response.city;
        if(this.city == null) {
            // console.error('We have NO CITY!');
            this.city = 'irvine';
        }
        this.zip = response.zip;
        this.latitude = response.latitude;
        this.longitude = response.longitude;

        // console.log('City: ' + this.city);
        // console.log('Zip: ' + this.zip);
        // console.log('Latitude ' + this.latitude);
        // console.log('Longitude ' + this.longitude);

        var linkToWeather = new WeatherData(this.city);
        linkToWeather.getWeatherData();

        var linkToYelp = new YelpData(this.city, this.latitude, this.longitude);
        linkToYelp.getData;
    }

    // If the API Call is unsuccessful let us know via the console
    functionToRunWhenFailed(response) {
        // console.log('Failed');
        // console.log(response);
    }

    // Linking to the map data within map.js and then hides the restaurant page and then displays the following page

}