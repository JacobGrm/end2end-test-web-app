/**
 * Created by 204071207 on 1/27/17.
 */

/*
 US59488 Allow filtered push replication

 1). Xcode to be placed in AppDelegate.swift to enable filter

 ONLY DOCS WITH FIELD THAT MATCHES FILTER WILL BE REPLICATED

        PredixMobilityConfiguration.addPushReplicationFilter(name: "MyFilter") { (properties: [String : Any]?, parameters:[AnyHashable : Any]?) -> (Bool) in

            // if both properties and parameters is not null
            if let properties = properties, let parameters = parameters
            {
                // loop through parameters key/value pairs
                for kv in parameters
                {
                    // To simplify, if the parameter key and value are strings
                    if let key = kv.key as? String, let value = kv.value as? String
                    {
                        // if the properties dictionary has a key/value pair with the same key as the this parameter key and it's also a string
                        if let documentValue = properties[key] as? String
                    {
                        // return true if the value in properties matches the value in parameters
                        if value == documentValue
                    {
                        return true
                    }
                }
                }
                }
            }

            return false
        }


        PredixMobilityConfiguration.addPushReplicationFilter(name: "MyFilterExcludeDocs") { (properties: [String : Any]?, parameters:[AnyHashable : Any]?) -> (Bool) in

            // if both properties and parameters is not null
            if let properties = properties, let parameters = parameters
            {
                // loop through parameters key/value pairs
                for kv in parameters
                {
                    // To simplify, if the parameter key and value are strings
                    if let key = kv.key as? String, let value = kv.value as? String
                    {
                        // if the properties dictionary has a key/value pair with the same key as the this parameter key and it's also a string
                        if let documentValue = properties[key] as? String
                        {
                            Logger.info("Comparing filter value:\n \(value)")
                    Logger.info("Comparing document value:\n \(documentValue)")

                    // return true if the value in properties matches the value in parameters
                    if value != documentValue
                    {
                        Logger.info("Matched filter value:\n \(value)")
                        Logger.info("Matched document value:\n \(documentValue)")

                        return true
                    }
                }
                }
                }
            }

            return false
        }



 2). Android -> MainActivity.java



        private void createPushFilter(String filterName) {

            PushReplicationFilter filter = new PushReplicationFilter() {

            @Override
                public boolean filterFunction(Map<String, Object> document, Map<String, Object> parameters) {

                    if (document == null || parameters == null) {

                        return false;
                    }

                    for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                        String key = entry.getKey();
                        String value = (String) entry.getValue();

                        if(document.get(key)==null) {
                            PredixSDKLogger.warning(this, "not replicating: " + document);
                            return false;
                        }
                        if (!(document.get(key) instanceof String)) {
                            continue;
                        }

                        String docValue = (String)document.get(key);

                        if (docValue.equals(value)) {
                            PredixSDKLogger.warning(this, "finally replicating: " + document);
                            return true;
                        }
                    }

                    return false;
                }

            };

            PredixMobileConfiguration.addNewFilter(filterName, filter);
        }


        private void createPushFilterExclude(String filterName) {

            PushReplicationFilter filter = new PushReplicationFilter() {

            @Override
                public boolean filterFunction(Map<String, Object> document, Map<String, Object> parameters) {

                    if (document == null || parameters == null) {

                        return false;
                    }

                    for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                        String key = entry.getKey();
                        String value = (String) entry.getValue();

                        if(document.get(key)==null) {
                            PredixSDKLogger.warning(this, "not replicating: " + document);
                            return false;
                        }
                        if (!(document.get(key) instanceof String)) {
                            continue;
                        }

                        String docValue = (String)document.get(key);

                        if (!docValue.equals(value)) {
                            PredixSDKLogger.warning(this, "finally replicating: " + document);
                            return true;
                        }
                    }

                    return false;
                }

            };

            PredixMobileConfiguration.addNewFilter(filterName, filter);
        }



        // PLACE THESE CALLS BEFORE instanse.start();

         createPushFilter("MyFilter");
         createPushFilterExclude("MyFilterExcludeDocs");

3). PredixMobileJavaSampleApp

    ReferenceApplication.java -> startPredixMobile(Pane root)

    after call to
    mobileManager.setViewInterface(dependencies);

         createPushFilter("MyFilter");
         createPushFilterExclude("MyFilterExcludeDocs");

         PredixMobileConfiguration.defaultPullReplicationChannels.add("app-FunctionalTestSuite_1_0_0");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-replacement-e2e-app_0_0_2");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-sample-webapp_0_0_1");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-offline-login_0_0_1");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("entity_jacob_ge_com");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-e2e-app-test_0_0_1");

*/




var filteredPushReplication_async = filteredPushReplication_async || {};
filteredPushReplication_async.subns = (function() {


    var command_route = "/test_cmdp/";
    var commandDocName = "qa_command_" + generateUniqueId();
    var now = new Date();
    var docParamValue = "This Is Test";

    function pollingCallback(){

        console.log("pollingCallback: "+g_httpResponse);
    }

    /*** TESTS ****/


    describe("Filtered push replication (filteredPushReplication_async.js)::", function(){

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

            it("Verify adding filter was success", function () {

                expect(g_httpStatus).toEqual(200);
            });

            it("Create document with field that matches filter",function(done){

                var documentData = {
                    "type": "command",
                    "~userid": g_user,
                    "channels": ["entity_jacob_ge_com"],
                    "~status": "pending",
                    "filterTest": docParamValue,
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

            it("Poll while waiting for command to be processed",function(done){

                poll(
                    function() {
                        getDocumentsAsync(commandDocName,pollingCallback);
                        var res = JSON.parse(g_httpResponse);
                        return res['~status']=="success";
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

            it("Check for command status",function(){

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
