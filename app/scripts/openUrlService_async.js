/**
 * Created by 204071207 on 1/19/16.
 */

/*

 OpenURL is an optional service and needs to be enabled by the container developer with a line like:
 PredixMobilityConfiguration.additionalBootServicesToRegister = [OpenURLService.self]
 Before the call to PredixMobilityConfiguration.loadConfiguration()

NOTE: In order to enable this feature in IOS you have to un-comment
following line of code in AppDelegate.swift

// Add optional and custom services to the system if required
PredixMobilityConfiguration.additionalBootServicesToRegister = [OpenURLService.self]

// For Android
 PredixMobileConfiguration.additionalBootServicesToRegister = new ArrayList<Class>();
 PredixMobileConfiguration.additionalBootServicesToRegister.add(OpenURLService.class);

 add this in MainActivity.java before instance.start() call

*/

var openUrlService_async = openUrlService_async || {};
openUrlService_async.subns = (function() {


    function openUrlRequest(url, callback){

        var data = {

            "url" : url
        };


        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":openUrlService
                ,"data":data
                ,"json":isJson(data)
            },callback
        );

    };

    /*** TESTS ****/

    describe("Open URL on device external to app (openUrlService_async.js)::",function(){

        it("Open url",function(done){

            //openUrlRequest("http://www.ge.com",done);
            // OR
            openUrlRequest("mailto://someone@example.com?Subject=Hello%20again",done);

        });

        it("Verify status 200 (DE53495 PMJ)",function(){

            expect(g_httpStatus).toEqual(200);
        });

    });

})();

