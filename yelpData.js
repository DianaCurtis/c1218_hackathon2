class YelpData{

    constructor(city, latitude, longitude){
        // this.categoryButton = categoryButton;
        // this.categoryButton.click((this.getData).bind(this));
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.restaurantName = '';
        this.priceRating = 0;
        this.phoneNumber = 0;
        this.reviewCount = 0;
        this.rating = 0;
        this.images = '';

        this.clickHandler = this.clickHandler.bind(this);
        this.getData = this.getData.bind(this);
        this.yelpDataSuccess = this.yelpDataSuccess.bind(this);
        this.showUserSelection = this.showUserSelection.bind(this);

        this.clickHandler();

        // this.yelpDataSuccess = this.yelpDataSuccess.bind(this);
    }

    clickHandler() {
        $('.categ-button').click(this.getData);
        // console.log($(this));
        // $('.button-container-food-options').on('click', '.categ-button', this.getData);
        $('#yesButton').click(this.showUserSelection);
    }

    showUserSelection(){
        // THIS BELOW WAS COMMENTED OUT BECAUSE WE BOTH DID THIS, LOOK BACK AT THE BOTTOM OF location.js FOR THE OTHER HIDE
        // $('.display_restaurant_data_page').addClass('hide');
        $('.full_restaurant_page').removeClass('hide');
        $('.restaurantName').text(this.restaurantName);
        for(var index = 0; index < this.images.length; index++ ) {
            var createImage = $('<img>').attr('src', this.images[index]).addClass('all-images') ;
            $('#allImages').append(createImage);
        }

        var phoneNumberDiv = $('<div>').text(this.phoneNumber);
        var priceRatingDiv = $('<div>').text(this.priceRating);
        var reviewCountDiv = $('<div>').text('Review Count: ' + this.reviewCount);
        var ratingDiv = $('<div>').text('Rating: ' + this.rating);

        $('.restaurant_info_final_selection').append(phoneNumberDiv, priceRatingDiv,reviewCountDiv, ratingDiv);

    }

    getData(event){
        // console.log('hi',event.target.innerText, event.target.value);
        // debugger;
        // var foodType = $('.categ-button').text();
        // foodType = foodType.toLowerCase();
        // $('.yelp_categories').css('background-color', 'black');
        // $('.button-container-food-options').css('background-color', 'white');

        var foodType = event.target.innerText;

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

        this.restaurantName = response.name;
        this.priceRating = response.price;
        this.phoneNumber = response.phone;
        this.reviewCount = response.review_count;
        this.rating = response.rating;
        this.images = response.photos;


        $('.display_category_options_page').remove();
        $('.display_restaurant_data_page').removeClass('hide');

        $('#restaurantName').text(this.restaurantName);



        $('#foodImages').append($('<img>').attr('src', response.image_url).addClass('main-image'));

        var priceRatingDiv = $('<div>').text(this.priceRating);
        var reviewCountDiv = $('<div>').text('Review Count: ' + this.reviewCount);
        var ratingDiv = $('<div>').text('Rating: ' + this.rating);

        $('.restaurant_info').append(priceRatingDiv,reviewCountDiv, ratingDiv);

    }


}

