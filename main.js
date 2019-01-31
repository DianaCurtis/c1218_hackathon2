$(document).ready(initApp);

var LocData;
var yelpData;
function initApp() {
    // console.log('starting..');
    // yelpData = new YelpData($('.categ-button'))
    // LocData();
    // debugger;
    $('.footer').hide();
    LocData = new LocDataTemplate();

    // $('.display_category_options_page').addClass('hide');
}