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
        this.currentBuis = null;
        this.allBuisnesses = null;
        this.mainImage = '';
        this.business_id = '';
        this.numberOfRestaurantsLeft = 0;

        this.clickHandler = this.clickHandler.bind(this);
        this.getData = this.getData.bind(this);
        this.yelpDataSuccess = this.yelpDataSuccess.bind(this);
        this.showUserSelection = this.showUserSelection.bind(this);
        this.functionToRunMap = this.functionToRunMap.bind(this);
        this.updateUserSelection = this.updateUserSelection.bind(this);
        this.getfullRestaurantData = this.getfullRestaurantData.bind(this);
        this.showCategories = this.showCategories.bind(this);

        this.clickHandler();
    }

    /** Handles all click handlers for class, called at end of constructor
     * Has information for the category button (representing an individual category/food type choice, and
     * a yes button for a specific restaurant
     * */
    clickHandler() {
        $('.categ-button').click((event) => {
            // console.log('this is EVENT: ', event);
            $('.spinner').removeClass('hide');
            this.getData(event);
            $(event.currentTarget).css('pointer-events', 'none');
            // console.log('console log');
        });
        // console.log($(this));
        // $('.button-container-food-options').on('click', '.categ-button', this.getData);
        $('#yesButton').click((event) => {
            // debugger;
            $('.spinner').removeClass('hide');
            this.showUserSelection();
            this.functionToRunMap();
            $(event.currentTarget).attr('disabled', true);
        });
        $('#noButton').click(this.updateUserSelection);
        $('.go-back').click(this.showCategories);
    }

    /** Called when user clicks on the yes button for a particular restaurant
     * Hides the current given page and shows a new page with the current selected restaurant
     * Provides detailed information about restaurant and appends it to the dom3*/
    showUserSelection(){
        $('.full_restaurant_page').show();
        // THIS BELOW WAS COMMENTED OUT BECAUSE WE BOTH DID THIS, LOOK BACK AT THE BOTTOM OF location.js FOR THE OTHER HIDE
        // $('.display_restaurant_data_page').addClass('hide');
        console.log('this curent bus: ', this.currentBuis.url)
        $('.full_restaurant_page').removeClass('hide');
        for(var index = 0; index < this.images.length; index++ ) {
            var imageDiv = $('<div>').addClass('item');
            if (index === 0){
                imageDiv.addClass('active')
            }
            var createImage = $('<img>').attr('src', this.images[index]).css('max-height', 250).css('max-width', 460).addClass('all-images') ;
            imageDiv.append(createImage);
            $('.carousel-inner').append(imageDiv);
        }
        $("#myCarousel").carousel("cycle");

        /** Creating the structure of the information below the map */
        $('.restaurantName').text(this.restaurantName);
        /** start by creating a div to contain the star info */
        var starRatingDiv = $("<div>").addClass("star_rating");
        /** then create the two divs related to the star ratings */
        var ratingDiv = $('<div>').addClass("stars").text(this.rating + " stars");
        var reviewCountDiv = $('<div>').addClass("review_count").text(this.reviewCount + " reviews");
        /** then create the div to hold the price and the phone number */
        var phoneDollarDiv = $("<div>").addClass("phone_dollar");
        /** then create the divs to add to a container related to the price and phone number */
        var phoneNumberDiv = $('<div>').addClass("phone_number");
        var phoneNumberLink = $('<a>').attr("href",`tel:${this.phoneNumber}`).text(this.phoneNumber);
        phoneNumberDiv.append(phoneNumberLink);
        var priceRatingDiv = $('<div>').addClass("price_rating").text(this.priceRating);
        /** Creates Yelp Icon with Link to Yelp */
        var yelpIconCreation = 	$('<img>').attr('src', 'images/yelpIcon.png').addClass('yelpIcon')
        var yelpLink = $('<a>').attr('href', this.currentBuis.url).addClass('yelpLink').attr('target', '_blank');
        var yelpContainer = yelpLink.append(yelpIconCreation);
        /** then start to append the proper divs in their correct places */
        starRatingDiv.append(reviewCountDiv);
        phoneDollarDiv.append(priceRatingDiv, phoneNumberDiv);
        $('.restaurant_info_final_selection').empty().append(starRatingDiv, phoneDollarDiv, yelpContainer);
        this.createStars();
    }

    getData(event){
        $('.display_restaurant_data_page').show();
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
                radius: 15000,
                top: false
            },
            success: this.yelpDataSuccess
        }
        $.ajax(ajaxConfig);
    }

    /** Function to be called upon receiving a server response, dynamically adds info to the DOM,
     * stores information about a restaraunt in constructor */
    yelpDataSuccess (response) {
        // console.log(response.businesses[0]);
        this.allBuisnesses = response;
        // console.log(this.allBuisnesses);

        // console.log(this.allBuisnesses.businesses.length);
        this.numberOfRestaurantsLeft = this.allBuisnesses.businesses.length;
        // console.log(this.numberOfRestaurantsLeft);
        this.currentBuis = this.allBuisnesses.businesses.shift();
        this.allBuisnesses.businesses.push(this.currentBuis);
        // console.log(this.allBuisnesses.businesses[0]);

        // console.log(this.currentBuis);

        this.renderBusiness();
    }

    updateUserSelection() {
        // console.log('In Update');
        // console.log(this.allBuisnesses);
        // console.log(this.allBuisnesses.businesses.length);
        // this.numberOfRestaurantsLeft = this.allBuisnesses.businesses.length;
        this.numberOfRestaurantsLeft -= 1;
        // console.log(this.numberOfRestaurantsLeft);
        if (this.numberOfRestaurantsLeft < 1) {
            this.numberOfRestaurantsLeft = this.allBuisnesses.businesses.length;
        }

        this.currentBuis = this.allBuisnesses.businesses.shift();
        this.allBuisnesses.businesses.push(this.currentBuis);
        // console.log(this.allBuisnesses);
        // console.log(this.currentBuis);

        this.renderBusiness();

    }

    sendfullRestaurantData() {
        var ajaxConfig = {
            // url: 'https://danielpaschal.com/lfzproxies/yelpproxy.php',
            url: 'http://localhost:8888/c1218_hackathon2/server/business_detail.php',
            method: 'GET',
            dataType: 'json',
            headers: {
                'apikey': '-oCFKpv8HndKWcXaU0uRS03PEI9muDUSEq5cX6W2rgNY9i2nPagmxiEXgJRJ_1y96vpJ2dEe3tBKzVBWzMez0OQPVgF0WUKFpPLRNvLpFfETwJNTXxkd-XOE6rZPXHYx',
            },
            data:{
                business_id: this.business_id
            },
            success: this.getfullRestaurantData
        }
        $.ajax(ajaxConfig);
    }

    getfullRestaurantData(response) {
        // console.log('Full Restaurant Data');
        // console.log(response.photos);
        this.images = response.photos;
    }

    renderBusiness () {
        $('.footer').show();

        this.restaurantName = this.currentBuis.name;
        this.priceRating = this.currentBuis.price;
        this.phoneNumber = this.currentBuis.phone;
        this.reviewCount = this.currentBuis.review_count;
        this.rating = this.currentBuis.rating;
        this.business_id = this.currentBuis.id;
        this.mainImage = this.currentBuis.image_url;
        this.restaurantLat = this.currentBuis.coordinates.latitude;
        this.restaurantLong = this.currentBuis.coordinates.longitude;

        this.sendfullRestaurantData();

        // $('.display_category_options_page').remove();
        $('.display_category_options_page').hide();

        $('.display_restaurant_data_page').removeClass('hide');
        /** We add the main restaurant image to the DOM */
        $('#foodImages').empty().append($('<img>').attr('src', this.mainImage).addClass('main-image'));
        /** We add the restaurant name to the DOM */
        $('#restaurantName').text(this.restaurantName);


        var numberOfRestaurantsLeftSpan = $('<span>').text(this.numberOfRestaurantsLeft).addClass('numberOfRestaurants');
        /** Creating the structure of the inforamtion below the restaurant name */
        /** start by creating a div to contain the start info */
        var starRatingDiv = $("<div>").addClass("star_rating");
        /** then create the two divs related to the star ratings */
        var ratingDiv = $('<div>').addClass("stars").text(this.rating + " stars");
        var reviewCountDiv = $('<div>').addClass("review_count").text(this.reviewCount + " reviews");
        /** then create the div related to the price */
        var priceRatingDiv = $('<div>').addClass("price_rating").text(this.priceRating);
        /** then start to append the proper divs in their correct places */
        $('#foodImages').prepend(numberOfRestaurantsLeftSpan);

        starRatingDiv.append(reviewCountDiv);


        $('.restaurant_info').empty().append(starRatingDiv, priceRatingDiv);

        this.createStars();

    }

    functionToRunMap(){
        // debugger;
        var linkToMap = new MapData(this.restaurantLat, this.restaurantLong);
        $(".display_restaurant_data_page").hide();
        $(".full_restaurant_page").removeClass("hide");
        linkToMap.displayMap();
    }

    createStars() {
        if(this.rating % 1 != 0) {
            var halfStarImage = $('<img>').attr('src', 'images/half-star.png').css('height', '7vmin');
            $('.star_rating').prepend(halfStarImage);
        }

        for (var index = 0; index < Math.floor(this.rating); index++) {

            var starImage = $('<img>').attr('src', 'images/star.png').css('height', '7vmin');
            $('.star_rating').prepend(starImage);
        }
    }

    showCategories() {
        // debugger;
        $('.display_category_options_page').show();
        $('.display_restaurant_data_page').hide();
        $('.spinner').addClass('hide');
        $('.categ-button').css('pointer-events', '');

        $('.full_restaurant_page').hide();
        $('.carousel-inner').empty();
        $('#yesButton').attr('disabled', false);
        $('.footer').hide();

        // $('#map').empty();

        // $('#map > *').remove();
        // this.functionToRunMap();

    }
}

