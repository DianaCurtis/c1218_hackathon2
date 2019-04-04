/** The class for all all the code regarding the use of the Yelp API*/

class YelpData{
    /**Represents an and individual Yelp API Call
    * Takes in a city, as well as latitude and longitude coordinates
    * @constructor
    * @param this.city {string} the name of the city that is passed in as a parameter
    * @param this.latitude {number} the latitude that is passed in as a parameter (the users lattitude)
    * @param this.longitude {number} the longitude that is passed in as a parameter (the users longitude)
    * this.restaurantName {string} the name of the restaurant that we receive from the yelp API
    * this.priceRating {number} the amount of dollar signs relating to the price of the food
    * this.phoneNumber {string} the phone number from the Yelp API (11 digits)
    * this.reviewCount {number} the number of reviews on the restaurant
    * this.rating {number} the amount of stars that the restaurant has
    * this.images {string} the URLs of three images
    * this.restaurantLat {number} the latitude of the restaurant
    * this.restaurantLong {number} the longitude of the restaurant
    * this.currentBuis {string} the current business that is on the screen on the selection page
    * this.allBuisnesses {object} this object keeps all businesses that are pulled from the Yelp API
    * this.mainImage {string} this is the main image that is passed in from the Yelp API
    * this.business_id {number} this ID makes it easier to send a second request for more detailed information
    * this.numberOfRestaurantsLeft {number} this number is displayed on the restaurant card to keep the user appraised of the amount of results returned from the API
    * */
    constructor(city, latitude, longitude) {
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.restaurantName = '';
        this.priceRating = 0;
        this.phoneNumber = 0;
        this.reviewCount = 0;
        this.rating = 0;
        this.images = '';
        this.restaurantLat = 0;
        this.restaurantLong = 0;
        this.currentBuis = null;
        this.allBuisnesses = null;
        this.mainImage = '';
        this.business_id = '';
        this.numberOfRestaurantsLeft = 0;
        this.clickHandler = this.clickHandler.bind(this);
        this.getData = this.getData.bind(this);
        this.yelpDataSuccess = this.yelpDataSuccess.bind(this);
        this.showUserSelection = this.showUserSelection.bind(this);
        this.runMap = this.runMap.bind(this);
        this.updateUserSelection = this.updateUserSelection.bind(this);
        this.getfullRestaurantData = this.getfullRestaurantData.bind(this);
        this.showCategories = this.showCategories.bind(this);
        this.getRestaurantReviewsData = this.getRestaurantReviewsData.bind(this);
        this.PreloadImage = this.PreloadImage.bind(this);
        this.OnImageLoaded = this.OnImageLoaded.bind(this);
        // this.clickHandler();
    }

    /** Handles all click handlers for class, called at end of constructor
     * Has information for the category button (representing an individual category/food type choice, and
     * The yes button handles when the user selects a restaurant and wants to learn more information about that restaurant.
     * The no button handles when the usere selects no on the snapshot page and then serves another restaurant as an option for the user.
     * */
    clickHandler() {
        $('.categ-button').click((event) => {
            $('.spinner').removeClass('hide');
            this.getData(event);
            $(event.currentTarget).addClass('disableClick');
        });
        $('#yesButton').click((event) => {
            $('.spinner').removeClass('hide');
            this.showUserSelection();
            this.runMap();

            this.sendfullRestaurantData();
            this.getRestaurantReviews();

            $(event.currentTarget).attr('disabled', true);
        });
        $('#noButton').click(this.updateUserSelection);
        $('.footer').click(this.showCategories);
        $('.logo_container').click(function(){
            window.location = '/';
        })
    }

    /** Called when user clicks on the yes button for a particular restaurant
     * Hides the current given page and shows a new page with the current selected restaurant
     * Provides detailed information about restaurant and appends it to the DOM
     */
    showUserSelection() {
        $('#myCarousel').carousel('pause').removeData();
        $('.full_restaurant_page').removeClass('hide');
        $('#myCarousel').carousel('cycle');

        /** Creating the structure of the information below the map */
        $('.restaurantName').text(this.restaurantName);
        /** start by creating a div to contain the star info */
        var starRatingDiv = $("<div>").addClass("star_rating");
        /** then create the two divs related to the star ratings */
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
        this.createStars(this.rating);
    }

    /** Makes the actual ajax call to the Yelp API, a proxy server is used for the url, we also run everything through MAMP so that we can make the proper call out to the Yelp servers.
     * Takes location (pulled from the logitude and latitude of the user's device.
     * Takes in a "term" that hard set to the category button on the category selection page
     * */
    getData(event) {
        $('.display_restaurant_data_page').show();
        var foodType = event.target.innerText;
        $('.currentCategory').text(foodType);
        var ajaxConfig = {
            url: 'server/yelp.php',
            method: 'GET',
            dataType: 'json',
            headers: {
                'apikey': yelpCredentials,
            },
            data:{
                location: this.city,
                term: foodType,
                limit: 50,
                radius: 15000,
                top: false
            },
            success: this.yelpDataSuccess,
            error: this.fail
        }
        $.ajax(ajaxConfig);
    }

    /** Function to be called upon receiving a server response, dynamically adds info to the DOM,
     * stores information about a restaraunt in constructor */
    yelpDataSuccess(response) {
        this.allBuisnesses = response;
        this.numberOfRestaurantsLeft = this.allBuisnesses.businesses.length;
        this.currentBuis = this.allBuisnesses.businesses.shift();
        this.allBuisnesses.businesses.push(this.currentBuis);
        this.renderBusiness();
    }

    /** Function to be called while cycling through businesses on the "swipe" page.
    * Once you move past the currently displayed restaurant we add it back to create an endless array.
    * */
    updateUserSelection() {
        this.numberOfRestaurantsLeft -= 1;
        if (this.numberOfRestaurantsLeft < 1) {
            this.numberOfRestaurantsLeft = this.allBuisnesses.businesses.length;
        }
        this.currentBuis = this.allBuisnesses.businesses.shift();
        this.allBuisnesses.businesses.push(this.currentBuis);
        this.renderBusiness();

    }

    /** Makes the actual ajax call to the Yelp API, to grab all of the information regarding the restaurant that the user has selected.
    * Using the business ID we are able to grab more images, the telephone number and other information regardign what is needed to display more information on the full restaurant page.
    * */
    sendfullRestaurantData() {
        var ajaxConfig = {
            url: 'server/business_detail.php',
            method: 'GET',
            dataType: 'json',
            headers: { 
                'apikey': yelpCredentials,
            },
            data:{
                business_id: this.business_id
            },
            success: this.getfullRestaurantData
        }
        $.ajax(ajaxConfig);
    }

    /** Takes the images from the restaurants and sents them as a variable to access them later to be able to display them on the DOM */
    getfullRestaurantData(response) {
        this.images = response.photos;

        for(var index = 0; index < this.images.length; index++) {
            var imageDiv = $('<div>').addClass('item');
            if (index === 0) {
                imageDiv.addClass('active')
            }
            var createImage = $('<img>').attr('src', this.images[index]).addClass('all-images');
            imageDiv.append(createImage);
            $('.carousel-inner').append(imageDiv);
        }
        this.showUserSelection();
    }


    getRestaurantReviews() {
        var ajaxConfigReviews = {
            url: 'server/reviews.php',
            method: 'GET',
            dataType: 'json',
            headers: { 
                'apikey': yelpCredentials,
            },
            data:{
                business_id: this.business_id
            },
            success: this.getRestaurantReviewsData
        }
        $.ajax(ajaxConfigReviews);
    }

    getRestaurantReviewsData(response) {
        $('#reviewContainer').remove();
        var reviewContainerDiv = $('<div>').attr('id', 'reviewContainer');
        $('.full_restaurant_page').append(reviewContainerDiv);
        var reviewTitle = $('<h3>').text('Recent Reviews').addClass('reviewTitle');
        $('#reviewContainer').append(reviewTitle)

        for ( var index = 0; index < response.reviews.length; index++) {
            var starRatingSpan = $("<span>").text(response.reviews[index].rating).addClass("user_star_rating");
            var timestamp = response.reviews[index].time_created.split(' ');
            var timeStampP = $('<span>').text( timestamp[0] ).addClass('timeStamp');
            var userNameDiv = $('<div>').text(' ' + response.reviews[index].user.name).addClass('userName');
            var userImage = $('<img>').attr('src', response.reviews[index].user.image_url).addClass('userImage').attr('value', response.reviews[index].user.profile_url);
            var reviewDiv = $('<div>').text(response.reviews[index].text).addClass('review');
            var reviewRightSide = $('<div>').attr('id', `reviewRightSide${index}`);
            var hLine = $('<hr>').addClass('horLine');
            $('#reviewContainer').append(timeStampP);
            this.createStars(response.reviews[index].rating, 'user');
            $('#reviewContainer').append(reviewRightSide,reviewDiv);
            $(`#reviewRightSide${index}`).append(userImage, userNameDiv);
            $('#reviewContainer').append(hLine);
        }
        $('.userImage').click(function() {
            var profileURL = $(this).attr('value');
            window.open(profileURL);
            $(event.currentTarget).attr('disabled', true);
        })

    }

    OnImageLoaded (img) {
         $('#foodImages').empty().css('background-image', 'url(' + this.mainImage + ')').css('background-position','center').css('background-size','cover');

    }
    PreloadImage (src) {
        var img = new Image ();
        img.onload =  ()=> {this.OnImageLoaded (this)};
        img.src = src;
    }

    /** This function grabs all of the various pieces of informaiton about the restaurant and then uses this information to display all the necessary information on the DOM. Idividual steps are added in the function below. */
    renderBusiness () {
        $('.footer').removeClass('hide');
        this.restaurantName = this.currentBuis.name;
        this.priceRating = this.currentBuis.price;
        this.phoneNumber = this.currentBuis.phone;
        this.reviewCount = this.currentBuis.review_count;
        this.rating = this.currentBuis.rating;
        this.business_id = this.currentBuis.id;
        this.mainImage = this.currentBuis.image_url;
        this.restaurantLat = this.currentBuis.coordinates.latitude;
        this.restaurantLong = this.currentBuis.coordinates.longitude;

        $('.display_category_options_page').hide();
        $('.display_restaurant_data_page').removeClass('hide');
        /** We add the main restaurant image to the DOM */
        this.PreloadImage (this.mainImage);

        $('#foodImages').empty().css('background-image', 'url(' + './images/preloader.gif' + ')').css('background-position','center').css('background-size','cover');
        // $('#foodImages').empty().append($('<img>').attr('src', this.mainImage).addClass('main-image'));
        /** We add the restaurant name to the DOM */
        $('#restaurantName').text(this.restaurantName);
        var numberOfRestaurantsLeftSpan = $('<span>').text(this.numberOfRestaurantsLeft).addClass('numberOfRestaurants');
        /** Creating the structure of the inforamtion below the restaurant name */
        /** start by creating a div to contain the start info */
        var starRatingDiv = $("<div>").addClass("star_rating");
        /** then create the two divs related to the star ratings */
        var reviewCountDiv = $('<div>').addClass("review_count").text(this.reviewCount + " reviews");
        /** then create the div related to the price */
        var priceRatingDiv = $('<div>').addClass("price_rating").text(this.priceRating);
        /** then start to append the proper divs in their correct places */
        $('#foodImages').prepend(numberOfRestaurantsLeftSpan);
        starRatingDiv.append(reviewCountDiv);
        $('.restaurant_info').empty().append(starRatingDiv, priceRatingDiv);
        this.createStars(this.rating);
    }


    runMap(){
        var linkToMap = new MapData(this.restaurantLat, this.restaurantLong);
        $(".display_restaurant_data_page").hide();
        $(".full_restaurant_page").removeClass("hide");
        linkToMap.displayMap();
    }

    /**Creates stars from star image dependent on API data and appends the star images to the DOM instead of just a number.*/
    createStars(rating, userOrRestaurant) {
        if(userOrRestaurant == 'user') {
            userOrRestaurant = '#reviewContainer';
        } else {
            userOrRestaurant = '.star_rating';
        }

        if(rating % 1 != 0) {
            var halfStarImage = $('<img>').attr('src', 'images/half-star.png');
            if(userOrRestaurant == 'user') {
                $(userOrRestaurant).append(halfStarImage);
            } else {
                $(userOrRestaurant).prepend(halfStarImage);
            }
        }

        for (var index = 0; index < Math.floor(rating); index++) {
            var starImage = $('<img>').attr('src', 'images/star.png');
            if(userOrRestaurant == '#reviewContainer') {
                $(userOrRestaurant).append(starImage);
            } else {
                $(userOrRestaurant).prepend(starImage);
            }
        }
    }

    showCategories() {
        $('.display_category_options_page').show();
        $('.display_restaurant_data_page').addClass('hide');
        $('.spinner').addClass('hide');
        $('.categ-button').removeClass('disableClick');
        $('.full_restaurant_page').addClass('hide');
        $('.carousel-inner').empty();
        $('#yesButton').attr('disabled', false);
        $('.footer').addClass('hide');
    }

    fail (response) {
        console.log(response);
        console.log(response.responseText);
    }
}