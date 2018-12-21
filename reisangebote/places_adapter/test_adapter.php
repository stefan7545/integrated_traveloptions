<!DOCTYPE html>
<html>
<head>
    <title>Place Searches</title>
    <script>
        // This example requires the Places library. Include the libraries=places
        // parameter when you first load the API. For example:
        // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


    </script>
</head>
<body>
<div id="map"></div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="../initAPIs/initAPIs.js"></script>
<script src="places_adapter.js"></script>
<script src="../directions_adapter/directions_adapter.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAjEnwFyOFVJjAd3Mpj97F6iVd4L3_yRMo&libraries=places"></script>
<script src="../trips/Trip.js"></script>
<script src="../trips/trip_possibilities/Fussweg.js"></script>
<script src="../trips/trip_possibilities/Bahn.js"></script>
<script src="../trips/CombinedTrip.js"></script>
<script>
    initPlaceService().then(function () {
        generateCombinedTripWithBahn("WALKING");
    });
</script>
</body>
</html>