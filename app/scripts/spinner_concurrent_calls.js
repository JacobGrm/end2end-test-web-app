/**
 * Created by 204071207 on 5/25/16.
 */


/*
    Test windowService_async.js is randomly crashing
    This test reproduces crash

     */

var spinner_concurrent_calls = spinner_concurrent_calls || {};
spinner_concurrent_calls.subns = (function() {

    var requestsCount = 30;

    var issuedRequests = [];
    var requestErrors = [];

    function _sendAsyncRequest(url, counter) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', windowService+"spinner?"+url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            var status = xhr.status;
            if (status >= 200 && status <= 299) {

                console.log("CALLING API: "+windowService+"spinner?"+url);
                issuedRequests.push(counter);

            } else {

                console.error("Error: ", status);
                requestErrors.push(counter);
            }
        };

        xhr.send();
    };



    describe('Send asynch requests for spinner to test racing conditions (spinner_concurrent_calls.js)::', function() {

        it("Send multiple requests and poll till all done", function (done) {

            expect(requestErrors.length).toEqual(0, "requestErrors should be 0");
            expect(issuedRequests.length).toEqual(0, "issuedRequests.len should be 0");

            for(var i=0;i<requestsCount;i++)
            {
                _sendAsyncRequest("state=on&msg=Message Added",i);
                _sendAsyncRequest("state=off",i);
                _sendAsyncRequest("state=off",i);
            }

            poll(
                function() {

                    console.log("ISSUED REQEUEST NUMBER: "+issuedRequests.length);
                    return issuedRequests.length === requestsCount*3;
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

            expect(issuedRequests.length).toEqual(requestsCount*3, "requestsCount is wrong");
            expect(requestErrors.length).toEqual(0, "requestErrors is not zero");
        });

        afterAll(function() {

            _sendAsyncRequest("state=off",0);
        });

    });

})();
