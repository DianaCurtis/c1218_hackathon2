class YelpData{

    constructor(categoryButton){
        this.categoryButton = categoryButton;
        this.categoryButton.click((this.getData).bind(this));

    }

    getData(){
        var ajaxConfig = {
            // url: 'https://danielpaschal.com/lfzproxies/yelpproxy.php',
            url: 'http://localhost:8888/c1218_hackathon2/server/yelp.php',
            method: 'GET',
            dataType: 'json',
            headers: {
                'apikey': '-oCFKpv8HndKWcXaU0uRS03PEI9muDUSEq5cX6W2rgNY9i2nPagmxiEXgJRJ_1y96vpJ2dEe3tBKzVBWzMez0OQPVgF0WUKFpPLRNvLpFfETwJNTXxkd-XOE6rZPXHYx',
            },
            data:{
                location: 'irvine',
                term: this.categoryButton.val(),
                limit: 50,
            },
            success: function (response) {
                console.log('got a response')
                console.log(response);
            }
        }
        console.log('term was: ', this.categoryButton.val());
        $.ajax(ajaxConfig);
        console.log('term was2: ', ajaxConfig.data.term);

    }





}

