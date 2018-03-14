/**
 * Created by 204071207 on 1/19/16.
 */

/*

NOTE: In order to enable this feature in IOS you have to uncommnet
following line of code in AppDelegate.swift

// Add optional and custom services to the system if required
PredixMobilityConfiguration.additionalBootServicesToRegister = [OpenURLService.self]

*/

function openUrlRequest(url){

    var data = {

        "url" : url
    };


    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":openUrlService
            ,"data":data
            ,"json":isJson(data)
        }
    );

};

/*** TESTS ****/

describe("Open URL on device external to app",function(){

    it("Open url",function(){

        openUrlRequest("http://www.ge.com");

    });

});
