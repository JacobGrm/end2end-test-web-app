/**
 * Created by 204071207 on 5/25/16.
 */


/*
    This script tests 2 things:

    1. Concurent request
    2. Presence of view of type "app" that should be created by the container app

     */

var concurrentRequestTest = concurrentRequestTest || {};
concurrentRequestTest.subns = (function() {

    var requestsCount = 20;

    var issuedRequests = [];
    var requestErrors = [];


    function _sendAsyncRequest(url, counter) {

        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            var status = xhr.status;
            if (status >= 200 && status <= 299) {

                console.log("Sucess: ", xhr.response);
                issuedRequests.push(counter);

            } else {

                console.error("Error: ", status);
                requestErrors.push(counter);
            }
        };

        xhr.send();
    };


    describe('Send asynch requests (concurrentRequest_async.js)::', function() {


        it("Send multiple requests and poll till all done", function (done) {

            expect(requestErrors.length).toEqual(0, "requestErrors should be 0");
            expect(issuedRequests.length).toEqual(0, "issuedRequests.len should be 0");

            for(var i=0;i<requestsCount;i++)
            {
                _sendAsyncRequest(WEB_PROTOCOL+'pmapi/db/pm/type/app',i);
            }

            poll(
                function() {

                    return issuedRequests.length === requestsCount;
                },
                function() {
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Polling error....");
                    done();
                },
                30000, //timeout
                1000   //interval
            );

        });

        it("Check for errors and verify sucess return status", function(){

            expect(issuedRequests.length).toEqual(requestsCount, "requestsCount is wrong");
            expect(requestErrors.length).toEqual(0, "requestErrors is not zero");
        })

    });

})();
