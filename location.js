/**
 * class representing the Location
 * **/

class LocDataTemplate {
/**
 * @constructor
 * stores the values that will later be used in the functions below
 * **/
    constructor() {
        this.ip = 0;
        this.latitude = 0;
        this.longitude = 0;
        this.zip = 0;
        this.city = '';
        // this.getIp();
        this.getLocation();
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.getIp = this.getIp.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.onResponseSuccess = this.onResponseSuccess.bind(this);
        this.displayWeather = this.displayWeather.bind(this);
    }
/**
 * addEventHandlers
 * calls the function getLocation when the button with id of accept is triggered
 * **/
    addEventHandlers() {
        $('#accept').click(this.removeHomePage);
    }

    removeHomePage() {
        $('.landing_page').remove();
        $('.display_category_options_page').removeClass('hide');
    }
/**
 * getIP
 * Get the IP address of the user once they load the landing page
 * **/
    getIp() {
        $.getJSON('https://jsonip.com?callback=?', (data) => {
            this.ip = data.ip;
            this.addEventHandlers();
        });
    }
/**
 * getLocation
 * Once the user clicks on accept we are sending their IP to the API to get their location
 * */
    getLocation() {
        if(!location.search == '') {
            $('.landing_page').remove();
            var businessID = location.search;
            businessID = businessID.substring(businessID.indexOf('=') + 1);
            var linkToYelp = new YelpData();
            linkToYelp.specificBusinessLookup(businessID);
        }

        this.addEventHandlers();
         $('.spinner').removeClass('hide');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                $.ajax({
                    url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&zoom=18&addressdetails=1',
                    dataType: 'json',
                    success: this.onResponseSuccess,
                    error: this.failedToGetLocation
                });
            }, (error) => {
                if(error.code == error.PERMISSION_DENIED){
                    console.log('Denied');
                    this.locationDenied();
                }
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

    }
 /**
  * onResponseSuccess
  * If the API call is successful we then grab the following data: City, Zip, Latitude, Longitude
  * The city will get passed into the WeatherData instantiation along with the reference for the callback function
  * The city, lattitude and longitude are passed into the instantiation of the YelpData
  * **/
    onResponseSuccess(response) {
        $('.spinner').addClass('hide');
     // this.city = null;
     // this.city = response.city;
        this.city = response.address.city;

         if(this.city == null) {
             this.locationDenied();
             // this.city = 'irvine';
         } else {
             this.city = response.address.city;
             this.zip = response.address.postcode;
             this.latitude = response.lat;
             this.longitude = response.lon;
             var linkToWeather = new WeatherData(this.city,this.displayWeather);
             linkToWeather.getWeatherData();
             var linkToYelp = new YelpData(this.city, this.latitude, this.longitude);
             linkToYelp.clickHandler();
             // $('.landing_page').remove();
             // $('.display_category_options_page').removeClass('hide');
         }

    }
/**
 * If the API Call is unsuccessful let us know via the console
 * later will add an error message for the failure
 * **/
    failedToGetLocation(response) {
        console.log('The response to get the user\'s location has failed.');
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
        var weatherOutput=$('<div>').addClass('temp_display').text(weather  +`\xB0 F`);
        var cityOutput=$('<div>').addClass('city_display').text(this.city);
        $('.weather_display').append(cityOutput,' ',weatherOutput);
    }

    locationDenied () {
        $('.spinner').addClass('hide');
        $('#accept').hide();
        $('.disclaimer').hide();
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
                    console.log('You have not eneterd in a valid city.');
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
        });
    }
}