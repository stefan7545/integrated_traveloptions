var placesService;
var result;
var directionsService;
var geocoder;

function initPlaceService() {
    return new Promise(function (resolve, reject) {
        infowindow = new google.maps.InfoWindow();
        geocoder = new google.maps.Geocoder();
        placesService = new google.maps.places.PlacesService(map);
        directionsService = new google.maps.DirectionsService;
        if (infowindow && placesService && directionsService) {
            resolve(1);
        } else {
            reject(Error("something went wrong in initPlaceService"));
        }
    });
}