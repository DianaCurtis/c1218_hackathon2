class WeatherData{

   constructor(responseCity){
       this.city=responseCity;

       //console.log('the city weather',this.city);
       this.weatherDataFunctionSuccess= this.weatherDataFunctionSuccess.bind(this);
       this.weatherDataFailure= this.weatherDataFailure.bind(this);
   }

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

    weatherDataFunctionSuccess(response){
        var currentKelvinTemp=response.main.temp;
        var convertKToF=Math.floor((currentKelvinTemp-273.15)*(9/5)+32);
        console.log('the response was given',convertKToF);
        this.displayWeather(convertKToF);
    }
    weatherDataFailure(response){
        console.log('the error was given',response);
     }

     displayWeather(weather){
       console.log(weather);
       var weatherOutput=$('<div>').addClass('temp_display').text(weather+"F");
       var cityOutput=$('<div>').addClass('city_display').text(this.city);
       $('.weather_display').append(cityOutput,weatherOutput);
     }

}





