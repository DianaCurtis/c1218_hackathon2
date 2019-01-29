$(document).ready(initApp);

var LocData;
var yelpData;
function initApp() {
    console.log('starting..');
    yelpData = new YelpData($('.categ-button'))
    // LocData();

    LocData = new LocDataTemplate();
}