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

        describe("Attempt to activate filter with name not registered in native code::", function(){

            it("Add filter that does not exist in xcode",function(done){

                var data = {
                    "filter": "MyFilterNotThere",
                    "parameters":
                            {"filterTest":docParamValue}
                };

                addPushReplicationFilter(data, done);

            });

            it("Verify adding non-exising filter returns 404", function () {

                expect(g_httpStatus).toEqual(400, "non-exising filter registration does not return 400");
            });


        });


        describe("Given: 2 filters created in native code; Then: replace one filter with another",function(){

            it("Add filter",function(done){

                var data = {
                    "filter": "MyFilter",
                    "parameters":
                    {"filterTest":docParamValue}
                };

                addPushReplicationFilter(data, done);

            });

            // This filter permits replication only for docs that have 'filterTest' with
            // value that does not match docParamValue
            it("Replace first filter with new one",function(done){

                var data1 = {
                    "filter": "MyFilterExcludeDocs",
                    "parameters":
                    {"filterTest":docParamValue}
                };

                addPushReplicationFilter(data1, done);

            });

            // check if replication is Idle
            it("Get replication config",function(done){

                getReplicationConfiguration(done);
            });

            it("Poll while waiting for replication status to be Idle",function(done){

                poll(
                    function() {

                        getReplicationConfiguration(pollingCallback);
                        var res="";
                        if(g_httpResponse.length > 0) {

                            res = JSON.parse(g_httpResponse);
                        }
                        return res.push.status == "Idle";
                    },
                    function() {

                        expect("Idle").toEqual(JSON.parse(g_httpResponse).push.status);
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

            it("Get document",function(done){

                getDocumentsAsync(commandDocName,done);
            });

            it("Add document that matches valid filter to be allowed replication",function(done){

                var doc = JSON.parse(g_httpResponse);
                doc["~status"]="pending";
                doc["filterTest"]=docParamValueModifed;

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

            it("Verify this document was not blocked by filter - should be processed by command processor", function(){

                expect("success").toEqual(JSON.parse(g_httpResponse)["~status"],"Command should have 'sucess' status");
            });

            it("Requiest Replication configuration",function(done){

                getReplicationConfiguration(done);

            });

            it("Verify filter closures associated with the push replication output included in filter details",function(){

                var res = JSON.parse(g_httpResponse);
                console.log("closures associated with the push replication:"+g_httpResponse);

                expect(res["push"].filter.indexOf("MyFilter")).not.toEqual(-1);
                expect(res["push"].filter.indexOf("MyFilterExcludeDocs")).not.toEqual(-1);
            });

        });

        // Reset timeout to original value
        afterAll(function(done) {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            addPushReplicationFilter({"filter": ""}, done); // remove filter
        });

    });

})();

