/**
 * create an object that will handle the data from the weather api that location.s will hav access to**/
class WeatherData{
 /**
  * from the locations.js file we pass in the city from the response that we got from runThisWhenDataComesBack
  * @param responseCity the city passed into  **/
   constructor(responseCity){
       this.city=responseCity;
       this.weatherDataFunctionSuccess = this.weatherDataFunctionSuccess.bind(this);
       this.weatherDataFailure= this.weatherDataFailure.bind(this);
   }
 /**
  * create a function that will handle the ajax call from the api
  * **/
    getWeatherData(){
        var city=this.city;
        console.log('the city we want',city);
        var ajaxWeatherOptions={
            url: "http://api.openweathermap.org/data/2.5/weather",
            method:'get',
            dataType:'json',
            data:{
                q: city,
                APPID:'a43ebfad64f2c63ddaff84b2c095f1ff'
            },
            success: this.weatherDataFunctionSuccess,
            error: this.weatherDataFailure
        };
        $.ajax(ajaxWeatherOptions);
    }
/**
 * this function that is run when success has returned a response
 * @param response is an object with the information for the current location of the user
 * **/
    weatherDataFunctionSuccess(response){
        var currentKelvinTemp=response.main.temp;
        var convertKToF=Math.floor((currentKelvinTemp-273.15)*(9/5)+32);
        console.log('the response was given',convertKToF);
        this.displayWeather(convertKToF);
    }
/**
 * this is a function that will run when an error has occured
 * currently the function is only storing the response**/
    weatherDataFailure(response){
        var failResponse=response;
     }
/**
 * this function will display the weather onto the DOM
 * @param weather is pased in from the weatherDataFunctionSuccess**/
     displayWeather(weather){
       console.log(weather);
       var weatherOutput=$('<div>').addClass('temp_display').text(weather+"F");
       var cityOutput=$('<div>').addClass('city_display').text(this.city);
       $('.weather_display').append(cityOutput,weatherOutput);
     }

}





