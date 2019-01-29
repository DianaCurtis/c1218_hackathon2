class LocDataTemplate {
    constructor(){
        this.ip = 0;
        this.lat = 0;
        this.long = 0;
        this.zip = 0;
        this.city = '';

        this.getIp();
        // this.getIp = this.getIp.bind(this);
    }

    addEventHandlers() {
        $('#accept').click(this.getLocation);
    }

    getIp() {
        // debugger;
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
            this.getLocation();
        });
    }

    getLocation() {
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
        // response.feed.entry[0]['img:image'][0].label;
        // var responseObject = JSON.parse(response);
        console.log('Success was called ' );
        console.log(response);

        var city = response.city;
        var zip = response.zip;
        var latitude = response.latitude;
        var longitude = response.longitude;


        console.log('City: ' + city);
        console.log('Zip: ' + zip);
        console.log('Latitude ' + latitude);
        console.log('Longitude ' + longitude);

        var locationDiv = $('<div>').text(zip +' ' + city).attr('id', 'location');
        var latLongDiv = $('<div>').text(latitude + ', ' + longitude).attr('id','latLong');

        // $('body').append(locationDiv,latLongDiv);

        // createMap(city);
        // crime(latitude, longitude);
    }

    functionToRunWhenFailed(response) {
        console.log('Failed');
        console.log(response);
    }

}