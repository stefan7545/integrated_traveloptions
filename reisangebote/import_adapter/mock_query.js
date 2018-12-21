function getMockData(callbackFunction) {
    $.ajax({
        url: "import_adapter/mock_data.json",
        type: 'GET',
        async: false,
        cache: false,
        timeout: 30000,
        error: function () {
            return true;
        },
        success: function (result) {
            callbackFunction(result);
        }
    });
}