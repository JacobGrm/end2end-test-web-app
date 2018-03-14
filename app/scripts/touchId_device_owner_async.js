/**
 * Created by 204071207 on 2/8/16.
 */


    function userOwnsDeviceTest(prompt,callback) {

        var apiUrl = encodeURI(touchIdService + "/validate?prompt=" + prompt);

        _setUpHttpRequestAsync(
            {
                "method": "GET"
                , "url": apiUrl
            },callback
        );
    };


    /**** TESTS *****/

    describe('Determine if current user is device owner (touchId_device_owner_async.js)::', function () {

        it("API call for prompt user for fingerprint",function(done){


            //userOwnsDeviceTest("Provide%20your%20fingerprint",done);
            userOwnsDeviceTest("Provide your fingerprint",done);

        });

        it("Wait for user to apply fingerprint", function(done){

            var res;
            poll(
                function() {
                    res = JSON.parse(g_httpResponse);
                    return res.supported === "true";
                },
                function() {
                    expect(res.supported).toEqual("true", "Biometric identification should be supported");
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                10000, //timeout
                1000   //interval
            );

        });

        it('Calling this service will prompt the user to provide their fingerprint', function () {

            var dic = JSON.parse(g_httpResponse);
            expect(dic.supported).toEqual('true', 'Biometric identification should be supported');
            expect(dic.owner).not.toEqual('undefined');

            var reason = dic["fail-reason"];

            if(dic.owner === 'false'){

                console.log('User identification failed - Failed reason: '+reason);
                expect(reason).not.toEqual(undefined, 'Fail-reason should be provided');

            }else{

                console.log('User identification succeded - No Failed reason: '+reason);
                expect(reason).toEqual(undefined, 'Fail-reason should NOT be provided when user identified');
            }

        });

    });

