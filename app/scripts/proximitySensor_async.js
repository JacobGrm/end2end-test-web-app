/**
 * Created by 204071207 on 11/23/15.
 */

/*

    User story US61772:
    https://rally1.rallydev.com/#/58777513391u/detail/userstory/81078324856?fdp=true

    Pre-requisites:

    Android:

    Have this method in containter's app MainActivity.java

     private void registerCustomServices()
     {
         PredixMobileConfiguration.additionalBootServicesToRegister = new ArrayList<>();
         PredixMobileConfiguration.additionalBootServicesToRegister.add(ProximitySensorService.class);
         PredixMobileConfiguration.additionalBootServicesToRegister.add(OrientationDetectionService.class);

         // Add more custom services here if needed
         PredixMobileConfiguration.additionalBootServicesToRegister.add(OpenURLService.class);
     }


    Call registerCustomServices() inside initiatePredixMobile()
    after if (instance.isRunning())

 */

var proximitySensor_async = proximitySensor_async || {};
proximitySensor_async.subns = (function() {


    function proximityObserver(data){

        console.log("Call to proximityObserver(): "+data);
        proximityObserverNotification = "Modified by proximityObserver";
    };


    function registerProximityObserver(callback) {

        var data = {

            "script" : "proximityObserver"
        };


        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":deviceProximity
                , "data": data
                , "json": isJson(data)
            }, callback
        );

    };

    function deleteProximityObserver(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                ,"url":deviceProximity
            },callback
        );
    };

    function getDeviceProximityStatus(callback) {


        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":deviceProximity

            },callback
        );

    };


    describe('Get current device proximity monitoring state (proximitySensor_async.js)::', function () {

        it("API call to get current device proximity monitoring state", function (done) {

            getDeviceProximityStatus(done);

        },ANDR_ONLY);


        it("Read response for current device proximity monitoring state", function () {

            console.log("getDeviceProximityStatus() return: "+g_httpResponse);
            expect(g_httpStatus).toEqual(200);

            var resp = JSON.parse(g_httpResponse);
            expect(typeof resp.isClose).toEqual("boolean");

            // tests are running with device on a desk far from any objects.
            expect(resp.isClose).toBe(false);

        },ANDR_ONLY);

        it("API call to  register device proximity oserver", function (done) {

            registerProximityObserver(done);

        },ANDR_ONLY);

        it("Verify registering proximity oserver did not fail", function () {

            expect(g_httpStatus).toEqual(200, "Failed to register observer");

        },ANDR_ONLY);

        it("Unregister proximity oserver",function(done){

            deleteProximityObserver(done);

        },ANDR_ONLY);

        it("Verify un-registering proximity observer did not fail", function () {

            expect(g_httpStatus).toEqual(200, "Failed to unregister proximity observer");

        },ANDR_ONLY);

    });

})();