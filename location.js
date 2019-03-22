/**
 * class representing the Location
 * **/

class LocDataTemplate {
/**
 * @constructor
 * stores the values that will later be used in the functions below
 * **/
    constructor() {
        this.getLocation();
        this.ip = 0;
        this.latitude = 0;
        this.longitude = 0;
        this.zip = 0;
        this.city = '';
        // this.getIp();
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.getIp = this.getIp.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.onResponseSuccess = this.onResponseSuccess.bind(this);
        this.displayWeather = this.displayWeather.bind(this);
        // this.getLocationVanilla();
    }
/**
 * addEventHandlers
 * calls the function getLocation when the button with id of accept is triggered
 * **/
    addEventHandlers() {
        $('#accept').click(this.getLocation);

    }

    getLocationVanilla () {
        function geo_success(position) {
            // do_something(position.coords.latitude, position.coords.longitude);
            // console.log(position.coords.latitude, ', ',position.coords.longitude);
            console.log('Lat: ',position.coords.latitude);
            console.log('Long: ',position.coords.longitude);

            $.getJSON(('https://fcc-weather-api.glitch.me/api/current?lat=' + position.coords.latitude +
                '&lon=' + position.coords.longitude), function(loc) {
                // $("#city").html(loc.name + ", " + loc.sys.country);
                console.log(loc.name);
            });
        }

        function geo_error() {
            alert("Sorry, no position available.");
        }

        var geo_options = {
            enableHighAccuracy: true,
            maximumAge        : 30000,
            timeout           : 27000
        };

        var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    }
/**
 * getIP
 * Get the IP address of the user once they load the landing page
 * **/
    getIp() {
        $.getJSON("https://jsonip.com?callback=?", (data) => {
            this.ip = data.ip;
            this.addEventHandlers();
        });
    }
/**
 * getLocation
 * Once the user clicks on accept we are sending their IP to the API to get their location
 * */
    getLocation() {
        $('.landing_page').remove();
        $('.display_category_options_page').removeClass('hide');
        // var access_key = locationCredentials;
        // var ajaxCallOptionsGeoIp = {
        //     url: 'http://api.ipstack.com/' + this.ip + '?access_key=' + access_key,
        //     dataType: 'jsonp',
        //     success: this.onResponseSuccess,
        //     error: this.failedToGetLocation
        // };
        // $.ajax( ajaxCallOptionsGeoIp );

        $.ajax({
            url: "https://geoip-db.com/jsonp",
            jsonpCallback: "callback",
            dataType: "jsonp",
            success: this.onResponseSuccess,
            error: this.failedToGetLocation
        });
    }
 /**
<<<<<<< HEAD
  * onResponseSuccess
=======
  * logUserData
>>>>>>> b2e45810174d0424795e38fb7563a56e690e78d9
  * If the API call is successful we then grab the following data: City, Zip, Latitude, Longitude
  * The city will get passed into the WeatherData instantiation along with the reference for the callback function
  * The city, lattitude and longitude are passed into the instantiation of the YelpData
  * **/
    onResponseSuccess(response) {
        this.city = response.city;

         if(this.city == null) {
             $('#accept').hide();
             $('.disclaimer').hide();

             this.citySelection();

             // this.city = 'irvine';

         } else {
             this.city = response.city;
             this.zip = response.zip;
             this.latitude = response.latitude;
             this.longitude = response.longitude;
             var linkToWeather = new WeatherData(this.city,this.displayWeather);
             linkToWeather.getWeatherData();
             var linkToYelp = new YelpData(this.city, this.latitude, this.longitude);
             linkToYelp.clickHandler();
             $('.landing_page').remove();
             $('.display_category_options_page').removeClass('hide');
         }

    }
/**
 * If the API Call is unsuccessful let us know via the console
 * later will add an error message for the failure
 * **/
    failedToGetLocation(response) {
        console.log("The response to get the user's location has failed.")
    }

/**
 * Linking to the map data within map.js and then hides the restaurant page and then displays the following page
 * **/


/**
 * displayWeather
 * this function will display the weather onto the DOM
 * @param weather is passed in from the weatherDataFunctionSuccess
 * the function below gets passed in as a reference call
 * **/
    displayWeather(weather) {
        $('.city_display').remove();
        $('.temp_display').remove();
        var weatherOutput=$('<div>').addClass('temp_display').text(weather  +`\xB0 F`);
        var cityOutput=$('<div>').addClass('city_display').text(this.city).click( () => {
            console.log('City Clicked');
            this.citySelection();
        });
        $('.weather_display').append(cityOutput,' ',weatherOutput);
    }

    citySelection() {
        var inputDiv = $('<div>').attr('id', 'inputContainer');
        var cityInput = $('<input>').attr('type', 'text').attr('id', 'cityInput').attr('placeholder', 'City');
        var cityInputBtn = $('<button>').attr('id', 'cityInputButton').text('Submit');
        var cityInputText = $('<p>').text('*Your city was not found, please enter it.').addClass('cityInputText');
        // $('.main_body').prepend(cityInput, cityInputBtn);
        $('.main_body').prepend(inputDiv);
        $('#inputContainer').append(cityInput,cityInputBtn, cityInputText);
        $('#cityInput').keydown(function(event){
            if(event.keyCode==13){
                $('#cityInputButton').trigger('click');
                var userCityVal = $('#cityInput').val();
                if (userCityVal == '') {
                    console.log('Empty');
                    location.reload();
                }
            }
        });
        $('#cityInputButton').click((event) => {
            var userCityVal = $('#cityInput').val();
            this.city = userCityVal;
            var linkToWeather = new WeatherData(this.city,this.displayWeather);
            linkToWeather.getWeatherData();
            var linkToYelp = new YelpData(this.city, this.latitude, this.longitude);
            linkToYelp.clickHandler();
            $('.landing_page').remove();
            $('.display_category_options_page').removeClass('hide');
            $('#cityInput').hide();
            $('#cityInputButton').hide();
            $('.cityInputText').hide();
            this.displayWeather();
        });


    }
}