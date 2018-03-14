/**
 * Created by 204071207 on 1/27/17.
 */

/*
    US59488 Allow filtered push replication

 */


var filteredPushReplicationBlocked_async = filteredPushReplicationBlocked_async || {};
filteredPushReplicationBlocked_async.subns = (function() {


    var command_route = "/test_cmdp/";
    var commandDocName = "qa_command_to_block" + generateUniqueId();
    var now = new Date();
    var docParamValue = "abcd 1234";


    /*** TESTS ****/


    describe("Filtered push replication(filteredPushReplicationBlocked_async.js)::", function(){

        // May need more timeout value to allow command to be processed
        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        });

        describe("Only allow docs with property 'filterTest' set to 'docParamValue' to be replicated::", function(){

            it("Add filter",function(done){

                var data = {
                    "filter": "MyFilter",
                    "parameters":
                            {"filterTest":docParamValue}
                };

                addPushReplicationFilter(data, done);

            });

            it("Create document with field that does not match filter",function(done){

                var documentData = {
                    "type": "command",
                    "~userid": g_user,
                    "channels": ["entity_jacob_ge_com"],
                    "~status": "pending",
                    "filterTest": docParamValue.split('').reverse().join(''),
                    "request": {
                        "uri": command_route,
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

                console.log("Command to be blocked: "+commandDocName);

                createCbDocumentAsync(commandDocName, documentData, done);
            });

            it("Allow time enough for command to be processed by command processor",function(done){

                poll(
                    function() {

                        return performance.now()>jasmine.DEFAULT_TIMEOUT_INTERVAL;

                    },
                    function() {

                        expect(performance.now()>jasmine.DEFAULT_TIMEOUT_INTERVAL).toEqual(true);
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

            });

            it("Fetch local document", function(done){

                getDocumentsAsync(commandDocName,done);
            });

            it("Get document status - should not be processed by command processor", function(){

                expect('pending').toEqual(JSON.parse(g_httpResponse)['~status'],"Command should not have 'sucess' status");
            });

        });


        // Reset timeout to original value
        afterAll(function(done) {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            addPushReplicationFilter({"filter": ""}, done); // remove filter
        });

    });

})();
