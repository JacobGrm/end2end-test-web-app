/**

 US62977
 https://rally1.rallydev.com/#/33932456357u/detail/userstory/46177015814

 */

var connectivity = connectivity || {};
connectivity.subns = (function() {

    function getConnectivityStatus() {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":connectivityService
            }
        );
    };


    describe('Connectivity Service Tests (connectivity.js)::', function() {

        describe('Returns state of network connectivity and authentication of the device::', function() {

            it("Standard HTTP status codes, and response data JSON array of connectivity flags", function () {

                getConnectivityStatus();
                console.log("HttpResponse: "+ g_httpResponse);

                expect(g_httpResponse.indexOf("Wifi")).not.toEqual(-1);
                expect(g_httpResponse.indexOf("Online")).not.toEqual(-1);
                expect(g_httpResponse.indexOf("Authenticated")).not.toEqual(-1);
                expect(g_httpStatus).toEqual(200);

            });
        });

    });

})();
