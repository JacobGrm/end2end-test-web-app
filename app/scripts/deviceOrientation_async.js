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

var deviceOrientation_async = deviceOrientation_async || {};
deviceOrientation_async.subns = (function() {


    function orientationObserver(data){

        console.log("Call to orientationObserver(): "+data);
        orientationObserverNotification = "Modified by orientationObserver";
    };


    function registerOrientationObserver(callback) {

        var data = {

            "script" : "orientationObserver"
        };


        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":deviceOrientation
                , "data": data
                , "json": isJson(data)
            }, callback
        );

    };

    function deleteOrientationObserver(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                ,"url":deviceOrientation
            },callback
        );
    };

    function getDeviceOrientation(callback) {


        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":deviceOrientation

            },callback
        );

    };


    describe('Get current device orientation (deviceOrientation_async.js)::', function () {

        it("API call to get current device orientation", function (done) {

            getDeviceOrientation(done);

        },ANDR_ONLY);


        it("Read response for current device orientation", function () {

            console.log("getDeviceOrientation() return: "+g_httpResponse);
            expect(g_httpStatus).toEqual(200);

            var resp = JSON.parse(g_httpResponse);
            expect(typeof resp.orientation).toEqual("string");
            expect(resp.orientation).toEqual("Portrait","Orientation is not set to 'Portrait' DE25650 Android");

        },ANDR_ONLY);

        it("API call to  register Orientation Observer", function (done) {

            registerOrientationObserver(done);

        },ANDR_ONLY);

        it("Verify registering orientation observer did not fail", function () {

            expect(g_httpStatus).toEqual(200, "Failed to register observer");

        },ANDR_ONLY);

        it("Unregister orientation observer",function(done){

            deleteOrientationObserver(done);

        },ANDR_ONLY);

        it("Verify un-registering orientation observer did not fail", function () {

            expect(g_httpStatus).toEqual(200, "Failed to unregister observer");

        },ANDR_ONLY);

    });


})();