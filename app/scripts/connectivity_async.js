/**

 US62977
 https://rally1.rallydev.com/#/33932456357u/detail/userstory/46177015814

 */

var connectivity_async = connectivity_async || {};
connectivity_async.subns = (function() {

    function getConnectivityStatus(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":connectivityService
            },callback
        )
    };


    describe("Connectivity Service Returns state of network connectivity and authentication of the device (connectivity_async.js)::", function() {

        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        });

        it("Fetch connectivity status",function(done){

            getConnectivityStatus(done);
        });

        it("Standard HTTP status codes, and response data JSON array of connectivity flags", function () {

            expect(g_httpStatus).toEqual(200);

            // expected format ["Online","Wifi","Authenticated"]
            console.log("Connectivity status: "+g_httpResponse);

            var ret = JSON.parse(g_httpResponse);
            expect(ret instanceof Array).toBe(true, "Format is not Array");

            expect(g_httpResponse.indexOf("Online")).not.toEqual(-1, "Online not found");
            expect(g_httpResponse.indexOf("Authenticated")).not.toEqual(-1, "Authenticated not found");
        });

        it("All platforms except Java provide the connection information (WiFi)",function(){

            var ret = JSON.parse(g_httpResponse);
            expect(g_httpResponse.indexOf("Wifi")).not.toEqual(-1, "Wifi not found"); // PMJ excluded

        },IOS_ONLY+ELCR_ONLY+ANDR_ONLY); // see DE23939 for details

        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

})();
