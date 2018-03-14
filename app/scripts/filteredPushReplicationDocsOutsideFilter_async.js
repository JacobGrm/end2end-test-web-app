/**
 * Created by 204071207 on 1/27/17.
 */

/*
 US59488 Allow filtered push replication

 */


var filteredPushReplicationDocsOutsideFilter_async = filteredPushReplicationDocsOutsideFilter_async || {};
filteredPushReplicationDocsOutsideFilter_async.subns = (function() {


    var command_route = "/test_cmdp/";
    var commandDocName = "qa_command_" + generateUniqueId();
    var now = new Date();
    var docParamValue = "xmlf 345";

    /*** TESTS ****/


    describe("Docs outside of filter (not having matched property) are not replicated (filteredPushReplicationDocsOutsideFilter_async.js)::", function(){

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

        describe("Given: Filter with property 'filterTest' active; Then: Docs without property 'filterTest' should not be replicated::", function(){

            it("Add filter",function(done){

                var data = {
                    "filter": "MyFilter",
                    "parameters":
                    {"filterTest":docParamValue}
                };

                addPushReplicationFilter(data, done);

            });

            it("Get document",function(done){

                getDocumentsAsync(commandDocName,done);
            });


            it("Create document revision without field specified in filter",function(done){

                var doc = JSON.parse(g_httpResponse);
                doc["~status"]="pending";
                expect(typeof doc["filterTest"]).toEqual("undefined");

                createCbDocumentAsync(commandDocName, doc, done);

            });

            it("Wait to allow command to be processed",function(done){

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

            it("Command should have 'pending' status (not processed by command processor)", function(){

                expect('pending').toEqual(JSON.parse(g_httpResponse)['~status'],"Command should have 'pending' status");
            });

        });

        // Reset timeout to original value
        afterAll(function(done) {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            addPushReplicationFilter({"filter": ""}, done); // remove filter
        });

    });

})();
