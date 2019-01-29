class YelpData{

    constructor(city, latitude, longitude){
        // this.categoryButton = categoryButton;
        // this.categoryButton.click((this.getData).bind(this));
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;

        this.clickHandler = this.clickHandler.bind(this);
        this.getData = this.getData.bind(this);
        this.yelpDataSuccess = this.yelpDataSuccess.bind(this);

        this.clickHandler();

        // this.yelpDataSuccess = this.yelpDataSuccess.bind(this);
    }

    clickHandler() {
        $('.categ-button').click(this.getData);
    }

    getData(){
        // debugger;
        var foodType = $('.categ-button').text();
        foodType = foodType.toLowerCase();

        var ajaxConfig = {
            // url: 'https://danielpaschal.com/lfzproxies/yelpproxy.php',
            url: 'http://localhost:8888/c1218_hackathon2/server/yelp.php',
            method: 'GET',
            dataType: 'json',
            headers: {
                'apikey': '-oCFKpv8HndKWcXaU0uRS03PEI9muDUSEq5cX6W2rgNY9i2nPagmxiEXgJRJ_1y96vpJ2dEe3tBKzVBWzMez0OQPVgF0WUKFpPLRNvLpFfETwJNTXxkd-XOE6rZPXHYx',
            },
            data:{
                location: this.city,
                term: foodType,
                limit: 50,
            },
            success: this.yelpDataSuccess
        }
        // console.log('term was: ', this.categoryButton.val());
        $.ajax(ajaxConfig);
        console.log('term was2: ', ajaxConfig.data.term);
        console.log('Yelp City2: ' + this.city);
        console.log('Food Type: ' + foodType.toLowerCase() );
    }

    yelpDataSuccess (response) {
        console.log('got a response');
        console.log(response);

        var restaurantName = response.name;
        var priceRating = response.price;
        var phoneNumber = response.phone;
        var rating = response.rating;
        var images = response.photos;


        $('.display_category_options_page').remove();
        $('.display_restaurant_data_page').removeClass('hide');

        $('#restaurantName').text(restaurantName);

        for(var index = 0; index < images.length; index++ ) {
            var createImage = $('<img>').attr('src', images[index]).css('height', '50vmin') ;
            $('#foodImages').append(createImage);
        }

        var priceRatingDiv = $('<div>').text(priceRating);
        var phoneNumberDiv = $('<div>').text(phoneNumber);
        var ratingDiv = $('<div>').text(rating);

        $('.restaurant_info').append(priceRatingDiv,phoneNumberDiv, ratingDiv);

    }


}
