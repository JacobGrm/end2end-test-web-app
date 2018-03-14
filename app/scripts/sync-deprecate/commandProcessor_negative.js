/**
 * Created by 204071207 on 1/13/16.
 */


var commandProcessor_negative = function(){

    var command_route_bad = "/processor_down/";  //command processor does not exist or down
    var commandDocName_neg = "qa_command_" + generateUniqueId();
    var now = new Date();

    function pushDocument_neg(data, docID){

        _setUpHttpRequest(
            {
                "method": "PUT"
                , "url": LOCAL_COUCHDB_LOW_LEVEL_DB + docID
                , "data": data
                , "json": isJson(data)
            }
        );
    };


    /*** TESTS ****/

    describe("Push command to the local couchDb and verify it's status if it was not processed " +
                    "by the command processor (commandProcessor_negative.js)::", function(){


        // May need more timeout value to allow command to be processed
        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        });

        it("Create a command to be processed by NOT registered OR DOWN command processor", function(done){

            var documentData_neg = {
                "type": "command",
                "~userid": g_user,
                "channels": ["entity_jacob_ge_com"],
                "~status": "pending",
                "request": {
                    "uri": command_route_bad,
                    "method": "PUT",
                    "headers": {},
                    "body": {
                        "counter" : 1,
                        "result": [
                            {
                                "TS_CL_PUSH": now.getTime()
                            }
                        ]
                    }
                }
            };

            pushDocument_neg(documentData_neg, commandDocName_neg);
            expect(201).toEqual(g_httpStatus,"The status code should not be a failure");
            getDocuments(commandDocName_neg);
            var ret = JSON.parse(g_httpResponse);
            expect('pending').toEqual(ret['~status'],"Initially command should have 'pending' status");

            poll(
                function() {

                    getDocuments(commandDocName_neg);
                    var ret = JSON.parse(g_httpResponse);
                    return ret['~status']=='error';
                },
                function() {
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                },
                jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                1000   //interval
            );

        });

        it("Polling for command status. Command should have 'error' status after not being processed",function(){

            expect('error').toEqual(JSON.parse(g_httpResponse)['~status'],"Command should have 'error' status after not being processed");
        });

        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

}();


