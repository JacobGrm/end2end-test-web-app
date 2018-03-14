/**
 * Created by 204071207 on 1/13/16.
 */

/**
    Pre-requisits: Run Following from the command line

     Check out "timing-graph-processor” branch from the following project:
     https://github.build.ge.com/predix-mobile/predixmobile-services/tree/timing-graph-processor/micro-services/test-command-processor

    $ cf apps
    Getting apps in org Predix-Mobile / space grimberg as Jacob.Grimberg@ge.com...
        OK

    name                                                    requested state   instances   memory   disk   urls
    qa-test-command-processor                               started           1/1         512M     1G     qa-test-command-processor.grc-apps.svc.ice.ge.com

    $ pm add-route /test_cmdp/ qa-test-command-processor.grc-apps.svc.ice.ge.com
        [INFO] PMRouterConfig: config document not found in server: router-configuration-1 ; using default empty document.
        OK
    SFO1204071207I:px-end2end-test-web-app 204071207$ pm routes

    route: ^/test_cmdp/ 	 https://qa-test-command-processor.grc-apps.svc.ice.ge.com

        total routes: 1
    OK
**/

var commandProcessor = commandProcessor || {};
commandProcessor.subns = (function() {

    var command_route = "/test_cmdp/";
    var commandDocName = "qa_command_" + generateUniqueId();
    var now = new Date();

    function pushDocument(data, docID){

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


    describe("Push command to the local couchDb and verify it was processed by the command processor (commandProcessor.js)::", function(){


        // May need more timeout value to allow command to be processed
        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        });


        it("Create a command to be processed by registered command processor", function(done){

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

            pushDocument(documentData, commandDocName);
            expect(201).toEqual(g_httpStatus,"The status code should not be a failure");
            getDocuments(commandDocName);
            var ret = JSON.parse(g_httpResponse);
            expect('pending').toEqual(ret['~status'],"Initially command should have 'pending' status");

            poll(
                function() {

                    getDocuments(commandDocName);
                    var ret = JSON.parse(g_httpResponse);
                    return ret['~status']=='success';
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

        it("Polling for command status. Command should have 'sucess' status after being processed by command processor",function(){

            expect('success').toEqual(JSON.parse(g_httpResponse)['~status'],"Command should have 'sucess' status after being processed");
        });


        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

})();


