/**
 * Created by 204071207 on 1/27/17.
 */

/*

 US59488 Allow filtered push replication

 */


var filteredPushReplicationReconcileRevisions_async = filteredPushReplicationReconcileRevisions_async || {};
filteredPushReplicationReconcileRevisions_async.subns = (function() {


    var command_route = "/test_cmdp/";
    var commandDocName = "qa_command_" + generateUniqueId();
    var now = new Date();
    var docParamValue = "This Is Test";
    var docParamValueModifed = "This Is Test" + generateUniqueId();


    function pollingCallback(){

        console.log("pollingCallback: "+g_httpResponse);
    }


    describe("Create test where document has 4 revisions on client and 1 revision on end point" +
        "to make sure couchdb handles revision reconciliation (filteredPushReplicationReconcileRevisions_async.js)::", function(){

        // May need more timeout value to allow command to be processed
        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

        });


        it("Create document that will be replicated to the backend",function(done){

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

        it("Verify end-point replication happened. Command should have 'sucess' status after being processed by command processor", function(){

            expect('success').toEqual(JSON.parse(g_httpResponse)['~status'],"Command should have 'sucess' status after being processed");
        });

        it("Verify number of revisions on client is 2",function(){

            var tmp = JSON.parse(g_httpResponse);
            expect(tmp["_rev"][0]).toEqual("2");

        });

        it("Add filter that will block all future doc revisions on a backend", function(done){

            var data = {
                "filter": "MyFilter",
                "parameters":
                {"filterTest":docParamValue}
            };

            addPushReplicationFilter(data, done);

        });

        it("Get client doc",function(done){

            getDocumentsAsync(commandDocName,done);
        });

        it("Add (modify) document to filter out push replications. That will create 3-rd client revision",function(done){

            var doc = JSON.parse(g_httpResponse);
            doc["~status"]="pending";
            doc["filterTest"]=docParamValueModifed;

            createCbDocumentAsync(commandDocName, doc, done);

        });

        it("Get client doc",function(done){

            getDocumentsAsync(commandDocName,done);
        });

        it("Add (modify) document to filter out push replications. That will create 4-th client revision",function(done){

            var doc = JSON.parse(g_httpResponse);
            doc["~status"]="pending";
            doc["filterTest"]=docParamValueModifed;

            createCbDocumentAsync(commandDocName, doc, done);

        });

        it("Get client doc",function(done){

            getDocumentsAsync(commandDocName,done);
        });

        it("Verify client has 4 doc revitions",function(){

            var tmp = JSON.parse(g_httpResponse);
            expect(tmp["_rev"][0]).toEqual("4");
        });

        it("Remove filter to allow replication for this doc",function(done){

            addPushReplicationFilter({"filter": ""}, done); // remove filter

        });

        it("Get client doc",function(done){

            getDocumentsAsync(commandDocName,done);
        });

        it("Add document revision to trigger replications.",function(done){

            var doc = JSON.parse(g_httpResponse);
            doc["~status"]="pending";
            doc["filterTest"]=docParamValueModifed;

            createCbDocumentAsync(commandDocName, doc, done);

        });

        it("Get client doc just to see couchdb did not crash on attempt to reconcile different" +
            "number of revisions on client (4) and endpoint (1)",function(done){

            getDocumentsAsync(commandDocName,done);
        });

        it("Status should be 200", function () {

            expect(g_httpStatus).toEqual(200);
        });

        // Reset timeout to original value
        afterAll(function(done) {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            addPushReplicationFilter({"filter": ""}, done); // remove filter
        });

    });

})();
