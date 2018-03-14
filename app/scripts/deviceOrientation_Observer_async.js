/**
 * Created by 204071207 on 11/23/15.
 */

/*

    User story US61772:
    https://rally1.rallydev.com/#/58777513391u/detail/userstory/81078324856?fdp=true

    Pre-requisites:

    Android:

    1.

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

   2.

        Add this code to enable alerts/confirmations used in this test

        Right after: webView.setWebViewClient(new ServiceRouterWebViewClient());

         webView.setWebChromeClient(new WebChromeClient(){
             @Override
                 public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                 return super.onJsAlert(view, url, message, result);
             }
         });

 */

    var device_orientation_observer;
    var observer_data;
    var orientationString = ["Portrait","Landscape"];

    function orientationObserver(data){

        console.log("Call to orientationObserver(): "+JSON.stringify(data));
        observer_data = data;
        device_orientation_observer = "Modified by orientationObserver";
    };


var deviceOrientation_Observer_async = deviceOrientation_Observer_async || {};
deviceOrientation_Observer_async.subns = (function() {

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


    describe('Test device orientation observer(deviceOrientation_Observer_async.js)::', function () {

        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        });

        it("API call to register Orientation Observer", function (done) {

            registerOrientationObserver(done);

        },ANDR_ONLY);

        it("Verify registering orientation observer did not fail", function () {

            expect(g_httpStatus).toEqual(200, "Failed to register observer DE25867 Android");

        },ANDR_ONLY);

        it("Manually Change device orientation",function(done){

            var action = confirm("Change device orientation and tap OK");;

            poll(
                function() {
                    return device_orientation_observer == "Modified by orientationObserver";
                },
                function() {

                    expect(device_orientation_observer).toBe("Modified by orientationObserver");
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                1000   //interval
            );

        },ANDR_ONLY);

        it("Verify orientation observer was called",function(){

            expect(device_orientation_observer).toEqual("Modified by orientationObserver");
            expect(orientationString.includes(observer_data.orientation)).toBe(true);

        },ANDR_ONLY);

        it("Unregister orientation observer",function(done){

            deleteOrientationObserver(done);

        },ANDR_ONLY);

        it("Manually Change device orientation after observer deleted",function(done){

            device_orientation_observer = undefined;
            var action = confirm("Change device orientation and tap OK");;

            poll(
                function() {
                    return action === true;
                },
                function() {

                    expect(action).toBe(true);
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                1000   //interval
            );

        },ANDR_ONLY);

        it("Verify orientation observer was NOT called",function(){

            expect(device_orientation_observer).toEqual(undefined);

        },ANDR_ONLY);

        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });


})();