/**
 * Created by 204071207 on 1/27/17.
 */

/*

 US59488 Allow filtered push replication

 */


var filteredPushReplicationReplaceFilters_async = filteredPushReplicationReplaceFilters_async || {};
filteredPushReplicationReplaceFilters_async.subns = (function() {


    var command_route = "/test_cmdp/";
    var commandDocName = "qa_command_" + generateUniqueId();
    var now = new Date();
    var docParamValue = "This Is Test";

    function pollingCallback(){

        console.log("pollingCallback: "+g_httpResponse);
    }

    /*** TESTS ****/


    describe("Filtered push replication (filteredPushReplicationReplaceFilters_async.js)::", function(){

        // May need more timeout value to allow command to be processed
        var originalTimeout;
        beforeAll(function(done) {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

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

        describe("Attempt to activate non-existing filter will not delete active one::", function(){

            it("Add filter",function(done){

                var data = {
                    "filter": "MyFilter",
                    "parameters":
                    {"filterTest":docParamValue}
                };

                addPushReplicationFilter(data, done);

            });

            it("Add filter that does not exist in xcode",function(done){

                var data = {
                    "filter": "MyFilterNotThere",
                    "parameters":
                    {"filterTest":"something"}
                };

                addPushReplicationFilter(data, done);

            });

            it("Get document",function(done){

                getDocumentsAsync(commandDocName,done);
            });

            it("Add document that matches valid filter",function(done){

                var doc = JSON.parse(g_httpResponse);
                doc["~status"]="pending";
                doc["filterTest"]=docParamValue;

                createCbDocumentAsync(commandDocName, doc, done);

            });

            it("Get document",function(done){

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

            it("Verify this document was not blocked by filter", function(){

                expect('success').toEqual(JSON.parse(g_httpResponse)['~status'],"Command should have 'sucess' status after being processed");
            });

        });

        // Reset timeout to original value
        afterAll(function(done) {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            addPushReplicationFilter({"filter": ""}, done); // remove filter
        });

    });

})();
