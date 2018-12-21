class Trip {
    constructor(trip, tripMode) {
        if (tripMode == "directions") {
            this._leg = trip.routes[0].legs[0];
        } else {
            this._leg = null;
        }
    }

    getLegInfo(part) {
        try {
            return this._leg[part];
        } catch (err) {
            document.getElementById("demo").innerHTML = err.message;
            return null;
        }
    }
}