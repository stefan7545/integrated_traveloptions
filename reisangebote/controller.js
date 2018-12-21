var intercept;
var tripSelection;

async function generateTravelSolutions(leg) {
    return new Promise(async resolve => {
        let result1 = getGeocodePosition(leg, leg.origin.place, "origin");
        let result2 = getGeocodePosition(leg, leg.destination.place, "destination");
        await result1 + await result2;

        tripSelection = new TripSelections();

        let wait1 = generateAndAddToSelection(leg, function (res) {
            return new Fussweg(res)
        }, "WALKING");
        let wait2 = generateAndAddToSelection(leg, function (res) {
            return new Privatwagen(res)
        }, "DRIVING");
        let wait3 = generateCombinedTripSolutionsWithBahn(leg, "WALKING");
        Promise.all([wait1, wait2, wait3])
            .then(function(){
                resolve(tripSelection);
            })
    })
}

function getGeocodePosition(leg, address, direc) {
    return new Promise(function (resolve, reject) {
        console.log(leg + "    " + address + "      " + direc);
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === 'OK') {
                leg[direc].geoCode = results[0].geometry.location;
                resolve(1);
            } else {
                reject(Error('Geocode was not successful for the following reason: ' + status));
            }
        });
    });
}

function generateAndAddToSelection(leg, method, travelMode) {
    return new Promise(resolve => {
        return requestDirectionsAPIRoute(leg, travelMode)
            .then(function (result) {
                tripSelection.addSelection(method(result), travelMode);
                resolve(1);
            })
    })
}

function requestDirectionsAPIRoute(leg, travelMode) {
    return calculateDirectionsAPIRoute(
        leg["origin"]["place"],
        leg["destination"]["place"],
        new Date(leg["destination"]["dateTime"]),
        travelMode);
}

function generateCombinedTripSolutionsWithBahn(leg, externalTravelMode) {
    new Promise(resolve => {
        let aTime = leg.destination.dateTime;
        let startpoint = {lat: leg.origin.geoCode.lat(), lng: leg.origin.geoCode.lng()};
        let endpoint = {lat: leg.destination.geoCode.lat(), lng: leg.destination.geoCode.lng()};

        carResolveMethod = function (result) {
            return new Privatwagen(result)
        };
        fusswegResolveMethod = function (result) {
            return new Fussweg(result)
        };
        let fussweg1 = generateWaysToNextTrainStation(startpoint, aTime, "WALKING", fusswegResolveMethod);
        let fussweg2 = generateWaysToNextTrainStation(endpoint, aTime, "WALKING", fusswegResolveMethod);
        let car1 = generateWaysToNextTrainStation(startpoint, aTime, "DRIVING", carResolveMethod);
        let car2 = generateWaysToNextTrainStation(endpoint, aTime, "DRIVING", carResolveMethod);
        Promise.all([fussweg1, fussweg2, car1, car2])
            .then(function (result) {
                fussweg1 = result[0];
                fussweg2 = result[1];
                car1 = result[2];
                car2 = result[3];
                let trainArrivalTime = new Date(aTime);
                trainArrivalTime.setMinutes(trainArrivalTime.getMinutes() - (fussweg2.getLegInfo("duration").value / 60));
                calculateDirectionsAPIRoute(
                    fussweg1.getLegInfo("end_location"),
                    fussweg2.getLegInfo("end_location"),
                    trainArrivalTime,
                    "TRANSIT"
                )
                    .then(function (tripWay) {
                        let beginningTripSelection = new TripSelections();
                        beginningTripSelection.addSelection(fussweg1, "WALKING");
                        beginningTripSelection.addSelection(car1, "DRIVING");
                        let endTripSelection = new TripSelections();
                        endTripSelection.addSelection(fussweg2, "WALKING");
                        endTripSelection.addSelection(car2, "DRIVING");
                        let combinedTrip = new CombinedTrip();
                        combinedTrip.addTrip(beginningTripSelection, "SELECTION");
                        combinedTrip.addTrip(new Bahn(tripWay), "TRANSIT");
                        combinedTrip.addTrip(endTripSelection, "SELECTION");
                        tripSelection.addSelection(combinedTrip, "COMBINED");
                        resolve(1);
                    });
            });
    })
}