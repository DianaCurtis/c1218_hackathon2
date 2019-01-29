class WeatherData{

   constructor(responseCity){
       this.city=responseCity;
       console.log('the city weather',this.city);
   }

    // var ajaxWeatherOptions={
    //     url: "http://api.openweathermap.org/data/2.5/forecast",
    //     method:'get',
    //     dataType:'json',
    //     data:{
    //         q: this.city,
    //         APPID:'a43ebfad64f2c63ddaff84b2c095f1ff'
    //     },
    //     success: this.weatherDataFunctionSucces,
    //     error: this.weatherDataFailure
    // };
    // $.ajax(ajaxWeatherOptions);
    //
    // weatherDataFunctionSucces(response){
    //     console.log('the response was given',response);
    // }
    // weatherDataFailure(response){
    //     console.log('the error was given',response);
    //  }



}





