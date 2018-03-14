/**
 * Created by 204071207 on 1/27/17.
 */

/*

 US59488 Allow filtered push replication

 */


var filteredPushReplicationMultipleFilters_async = filteredPushReplicationMultipleFilters_async || {};
filteredPushReplicationMultipleFilters_async.subns = (function() {


    var command_route = "/test_cmdp/";
    var commandDocName = "qa_command_" + generateUniqueId();
    var commandDocName1 = "qa_command_to_block" + generateUniqueId();
    var now = new Date();
    var docParamValue = "This Is Test";
    var docParamValueModifed = "This Is Test" + generateUniqueId();

    function pollingCallback(){

        console.log("pollingCallback: "+g_httpResponse);
    }

    /*** TESTS ****/


    describe("Filtered push replication (filteredPushReplicationMultipleFilters_async.js)::", function(){

        // May need more timeout value to allow command to be processed
        var originalTimeout;
        beforeAll(function(done) {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

            var documentData = {
                "type": "command",
                "~userid": g_user,
                "channels": ["entity_jacob_ge_com"],
                "~status": "pending",
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

            createCbDocumentAsync(commandDocName, documentData, done);
        });

        describe("Registering the same filter name with modified property will change filter funcionality::", function(){

            it("Add filter",function(done){

                var data = {
                    "filter": "MyFilter",
                    "parameters":
                    {"filterTest":docParamValue}
                };

                addPushReplicationFilter(data, done);

            });

            it("Modify filter parameters and register it again",function(done){

                var data1 = {
                    "filter": "MyFilter",
                    "parameters":
                    {"filterTest":docParamValueModifed}
                };

                addPushReplicationFilter(data1, done);

            });

            it("Verify adding modified filter went w/o errors", function () {

                expect(g_httpStatus).toEqual(200, "adding modified filter did not return 200");
            });


            it("Create new document revision to start replication",function(done){

                getDocumentsAsync(commandDocName,done);
            });

            it("Add (modify) document to match filter after modification",function(done){

                var doc = JSON.parse(g_httpResponse);
                doc["~status"]="pending";
                doc["filterTest"]=docParamValueModifed;

                createCbDocumentAsync(commandDocName, doc, done);

            });

            it("Get document and poll for 'status' field",function(done){

                getDocumentsAsync(commandDocName,done);
            });

            it("Wait to allow command to be processed",function(done){

                poll(
                    function() {

                        getDocumentsAsync(commandDocName,pollingCallback);
                        var res = JSON.parse(g_httpResponse);
                        return res["~status"] == "success";

                    },
                    function() {

                        expect('success').toEqual(JSON.parse(g_httpResponse)['~status']);
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

            it("Verify modified filter works and this document was not blocked by filter", function(){

                expect('success').toEqual(JSON.parse(g_httpResponse)['~status'],"Command should have 'sucess' status after being processed");
            });


            it("Create document that matches filter before it was modified now should be blocked",function(done){

                var documentData = {
                    "type": "command",
                    "~userid": g_user,
                    "channels": ["entity_jacob_ge_com"],
                    "~status": "pending",
                    "filterTest":docParamValue,
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

                console.log("Document should be blocked: "+commandDocName1);
                createCbDocumentAsync(commandDocName1, documentData, done);
            });

            it("Wait to allow command to be processed by command processor if it's going to",function(done){

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

                getDocumentsAsync(commandDocName1,done);
            });

            it("Verify this document was blocked by filter - should not be processed by command processor", function(){

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

