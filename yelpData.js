/**The class for all all the code regarding the use of the Yelp API*/

class YelpData{
    /**Represents an and individual Yelp API Call
     * Takes in a city, as well as latitude and longitude coordinates
     * @constructor
     * */
    constructor(city, latitude, longitude){
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.restaurantName = '';
        this.priceRating = 0;
        this.phoneNumber = 0;
        this.reviewCount = 0;
        this.rating = 0;
        this.images = '';
        this.restaurantLat=0;
        this.restaurantLong=0;

        this.clickHandler = this.clickHandler.bind(this);
        this.getData = this.getData.bind(this);
        this.yelpDataSuccess = this.yelpDataSuccess.bind(this);
        this.showUserSelection = this.showUserSelection.bind(this);
        this.functionToRunMap = this.functionToRunMap.bind(this);

        this.clickHandler();
    }

    /** Handles all click handlers for class, called at end of constructor
     * Has information for the category button (representing an individual category/food type choice, and
     * a yes button for a specific restaurant
     * */
    clickHandler() {
        $('.categ-button').click(this.getData);
        // console.log($(this));
        // $('.button-container-food-options').on('click', '.categ-button', this.getData);
        $('#yesButton').click(this.showUserSelection);
        $("#yesButton").click(this.functionToRunMap);
    }

    /** Called when user clicks on the yes button for a particular restaurant
     * Hides the current given page and shows a new page with the current selected restaurant
     * Provides detailed information about restaurant and appends it to the dom3*/
    showUserSelection(){
        // THIS BELOW WAS COMMENTED OUT BECAUSE WE BOTH DID THIS, LOOK BACK AT THE BOTTOM OF location.js FOR THE OTHER HIDE
        // $('.display_restaurant_data_page').addClass('hide');
        $('.full_restaurant_page').removeClass('hide');
        $('.restaurantName').text(this.restaurantName);
        for(var index = 0; index < this.images.length; index++ ) {
            var imageDiv = $('<div>').addClass('item');
            if (index === 0){
                imageDiv.addClass('active')
            }
            var createImage = $('<img>').attr('src', this.images[index]).css('height', 345).css('width', 460).addClass('all-images') ;
            imageDiv.append(createImage)
            $('.carousel-inner').append(imageDiv);
        }

        var phoneNumberDiv = $('<div>').text(this.phoneNumber);
        var priceRatingDiv = $('<div>').text(this.priceRating);
        var reviewCountDiv = $('<div>').text('Review Count: ' + this.reviewCount);
        var ratingDiv = $('<div>').text('Rating: ' + this.rating);

        $('.restaurant_info_final_selection').append(phoneNumberDiv, priceRatingDiv,reviewCountDiv, ratingDiv);

    }

    getData(event){
        // console.log('hi',event.target.innerText, event.target.value);
    /** Makes the actual ajax call to the Yelp API, a proxy server is used for the url, may need to run MAMP
     * Takes location and term information depending on buttons and input given
     * */
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
        $.ajax(ajaxConfig);
    }

    /** Function to be called upon receiving a server response, dynamically adds info to the DOM,
     * stores information about a restaraunt in constructor */
    yelpDataSuccess (response) {
        this.restaurantName = response.name;
        this.priceRating = response.price;
        this.phoneNumber = response.phone;
        this.reviewCount = response.review_count;
        this.rating = response.rating;
        this.images = response.photos;
        this.restaurantLat=response.coordinates.latitude;
        this.restaurantLong=response.coordinates.longitude;



        $('.display_category_options_page').remove();
        $('.display_restaurant_data_page').removeClass('hide');

        $('#restaurantName').text(this.restaurantName);



        $('#foodImages').append($('<img>').attr('src', response.image_url).addClass('main-image'));

        var priceRatingDiv = $('<div>').text(this.priceRating);
        var reviewCountDiv = $('<div>').text('Review Count: ' + this.reviewCount);
        var ratingDiv = $('<div>').text('Rating: ' + this.rating);

        $('.restaurant_info').append(priceRatingDiv,reviewCountDiv, ratingDiv);

    }

    functionToRunMap(){
        var linkToMap = new MapData(this.restaurantLat, this.restaurantLong);
        $(".display_restaurant_data_page").hide();
        $(".full_restaurant_page").removeClass("hide");
        linkToMap.displayMap();
    }

}

