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

    var device_proximity_observer;
    var proximity_observer_data;

    function proximityObserver(data){

        console.log("Call to proximityObserver(): "+JSON.stringify(data));
        proximity_observer_data = data;
        device_proximity_observer = "Modified by proximityObserver";
    };

    function second_proximityObserver(data){

        console.log("Call to second_proximityObserver(): "+JSON.stringify(data));
        proximity_observer_data = data;
        device_proximity_observer = "Modified by second_proximityObserver";
    };


var proximitySensor_Observer_async = proximitySensor_Observer_async || {};
proximitySensor_Observer_async.subns = (function() {

    function registerProximityObserver(observerName, callback) {

        var data = {

            "script" : observerName
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


    describe('Test device proximity monitoring observer (proximitySensor_Observer_async.js)::', function () {

        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        });

        it("API call to  register device proximity oserver", function (done) {

            registerProximityObserver("proximityObserver", done);

        },ANDR_ONLY);

        it("Manually change distance to device proximity sensor",function(done){

            var action = confirm("Move your hand close to device proximity sensor and tap OK");;

            poll(
                function() {
                    return device_proximity_observer == "Modified by proximityObserver";
                },
                function() {

                    expect(device_proximity_observer).toBe("Modified by proximityObserver");
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

        it("Verify proximity observer was called",function(){

            expect(device_proximity_observer).toEqual("Modified by proximityObserver");
            expect(typeof proximity_observer_data.isClose).toEqual("boolean");

        },ANDR_ONLY);

        // second
        it("API call to register another device proximity oserver", function (done) {

            registerProximityObserver("second_proximityObserver", done);

        },ANDR_ONLY);

        it("Verify registering proximity oserver did not fail", function () {

            expect(g_httpStatus).toEqual(200, "Failed to register observer");

        },ANDR_ONLY);

        it("Manually change distance to device proximity sensor",function(done){

            var action = confirm("Move your hand close to device proximity sensor and tap OK");;

            poll(
                function() {
                    return device_proximity_observer == "Modified by second_proximityObserver";
                },
                function() {

                    console.log("Testing another proximity observer: "+device_proximity_observer);
                    expect(device_proximity_observer).toBe("Modified by second_proximityObserver");
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

        it("Verify proximity observer was called",function(){

            expect(device_proximity_observer).toEqual("Modified by second_proximityObserver");
            expect(typeof proximity_observer_data.isClose).toEqual("boolean");

        },ANDR_ONLY);

        it("Unregister proximity oserver",function(done){

            deleteProximityObserver(done);

        },ANDR_ONLY);

        it("Manually change distance to device proximity sensor after observer deleted",function(done){

            device_proximity_observer = undefined;
            proximity_observer_data = undefined;
            var action = confirm("Move your hand close to device proximity sensor and tap OK");;

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

        it("Verify proximity observer was NOT called",function(){

            expect(proximity_observer_data).toEqual(undefined);
            expect(device_proximity_observer).toEqual(undefined);

        },ANDR_ONLY);

        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

})();