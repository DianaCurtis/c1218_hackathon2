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
        this.getIp();
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.getIp = this.getIp.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.logUserData = this.logUserData.bind(this);
        this.displayWeather = this.displayWeather.bind(this);
    }
/**
 * addEventHandlers
 * calls the function getLocation when the button with id of accept is triggered
 * **/
    addEventHandlers() {
        $('#accept').click(this.getLocation);
    }
/**
 * getIP
 * Get the IP address of the user once they load the landing page
 * **/
    getIp() {
        $.getJSON("http://jsonip.com?callback=?", (data) => {
            this.ip = data.ip;
            this.addEventHandlers();
        });
    }
/**
 * getLocation
 * Once the user clicks on accept we are sending their IP to the API to get their location
 * */
    getLocation() {
        // $('.landing_page').remove();
        // $('.display_category_options_page').removeClass('hide');
        var access_key = 'c4d72f43b4c7bbf8a0f17e939dd57438\n';
        var ajaxCallOptionsGeoIp = {
            url: 'http://api.ipstack.com/' + this.ip + '?access_key=' + access_key,
            dataType: 'jsonp',
            success: this.logUserData,
            error: this.failedToGetLocation
        };
        $.ajax( ajaxCallOptionsGeoIp );
    }
 /**
  * logUserData
  * If the API call is successful we then grab the following data: City, Zip, Latitude, Longitude
  * The city will get passed into the WeatherData instantiation along with the reference for the callback function
  * The city, lattitude and longitude are passed into the instantiation of the YelpData
  * **/
    logUserData(response) {
        this.city = response.city;
         if(this.city == null) {
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
             });

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
        $('.weather_display').append(cityOutput,weatherOutput);
    }

}