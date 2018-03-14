/**
 * Created by 204071207 on 1/27/17.
 */

/*
 US59488 Allow filtered push replication

 */


var filteredPushReplicationDeleteFilter_async = filteredPushReplicationDeleteFilter_async || {};
filteredPushReplicationDeleteFilter_async.subns = (function() {


    var command_route = "/test_cmdp/";
    var commandDocName = "qa_command_" + generateUniqueId();
    var now = new Date();
    var docParamValue = "xmlf 345";

    function pollingCallback(){

        console.log("pollingCallback: "+g_httpResponse);
    }


    /*** TESTS ****/


    describe("Push replication filter can be deleted(filteredPushReplicationDeleteFilter_async.js)::", function(){

        // May need more timeout value to allow command to be processed
        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        });

        describe("After filter removed all docs should be replicated::", function(){

            it("Add filter",function(done){

                var data = {
                    "filter": "MyFilter",
                    "parameters":
                    {"filterTest":"Some value"}
                };

                addPushReplicationFilter(data, done);

            });

            it("Get replication config",function(done){

                getReplicationConfiguration(done);
            });

            it("Verify filter is present",function(){

                var res = JSON.parse(g_httpResponse);
                expect(res.push.filter).not.toEqual(undefined, "Filter should not be removed from configuration");
            });


            it("Remove filter",function(done){

                addPushReplicationFilter({"filter": ""}, done); // remove filter
            });


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

            it("Verify filter removed",function(){

                var res = JSON.parse(g_httpResponse);
                expect(res.push.filter).toEqual(undefined, "Filter not removed from configuration");
            });

            it("Create document with field that does not match removed filter",function(done){

                var documentData = {
                    "type": "command",
                    "~userid": g_user,
                    "channels": ["entity_jacob_ge_com"],
                    "filterTest": docParamValue.split('').reverse().join(''),
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

            it("Command should have 'sucess' status after being processed by command processor",function(){

                expect('success').toEqual(JSON.parse(g_httpResponse)['~status'],"Command should have 'sucess' status after being processed. Android DE20473");

            });

        });

        // Reset timeout to original value
        afterAll(function(done) {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            addPushReplicationFilter({"filter": ""}, done); // remove filter
        });

    });

})();
