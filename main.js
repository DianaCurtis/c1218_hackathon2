$(document).ready(initApp);

var LocData, placeSearch, autocomplete;
function initApp() {
    LocData = new LocDataTemplate();
}

window.addEventListener('load',function(){
    if(document.getElementById('cityInput')){
        google.load('maps', '3', {
            other_params:'key=AIzaSyD908sFyUGE0oBT_tp6VDN9kjzkwFDGQQo&libraries=places',
            callback:initAutocomplete
        });    
    }
},false);

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('cityInput'), {types: ['(cities)'], componentRestrictions: {country: "us"}}
    );

  // Avoid paying for data that you don't need by restricting the set of place fields that are returned to just the address components.
  autocomplete.setFields(['address_component']);

  // When the user selects an address from the drop-down, populate the address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
};
