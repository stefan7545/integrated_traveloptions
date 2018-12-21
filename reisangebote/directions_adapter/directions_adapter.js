// var directionsService;
// var directionsValue;
//
// function initMap() {
//     directionsService = new google.maps.DirectionsService;
// }

function calculateDirectionsAPIRoute(origin, destination, travelTime, travelMode) {
    return new Promise(resolve => {
        let travelTimeInSec = travelTime.getTime() / 60;
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: travelMode,
            transitOptions: {
                arrivalTime: travelTime
            }
        }, function (response, status) {
            if (status === 'OK') {
                directionsValue = response;
                resolve(response);
            } else {
                resolve(Error('Directions request failed due to ' + status));
            }
        });
    });
}