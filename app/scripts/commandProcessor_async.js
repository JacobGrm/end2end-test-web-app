/**
 * Created by 204071207 on 1/13/16.
 */

/**


 To deploy command processor:
 https://github.build.ge.com/predix-mobile/CBS-Conflict-Test/tree/master/conflict-cmd-processor

 Modify manifest.yml

    push it to cloud:

 npm install
 cf push -f manifest.yml

 Add route:

    $ pm add-route /CMDP_CONFLICTS/ qa-test-command-processor.grc-apps.svc.ice.ge.com
        [INFO] PMRouterConfig: config document not found in server: router-configuration-1 ; using default empty document.
        OK
    SFO1204071207I:px-end2end-test-web-app 204071207$ pm routes

    route: ^/CMDP_CONFLICTS/ 	 https://qa-test-command-processor.grc-apps.svc.ice.ge.com

        total routes: 1
    OK
**/

var commandProcessorAsync = commandProcessorAsync || {};
commandProcessorAsync.subns = (function() {

    var command_route = "/CMDP_CONFLICTS/";
    var cmdId = "CMD_TEST_" + generateUniqueId();

    var initialDocumentId = "DOC_INITIAL_" + generateUniqueId();
    var docModificationByCommandProcessor = generateDocumentUniqueModification(randomNumber(10,100));
    var localDocChanges;

    function pollingCallback(){

        console.log("pollingCallback: "+g_httpResponse);
    }

    function generateDocumentUniqueModification(numberOfKeys) {

        var jsonObj = {};

        for(var i=0; i<numberOfKeys; i++) {

            jsonObj["changeID_"+randomNumber(100,10000)]=randomNumber(100,10000);

        }

        return jsonObj;

    };


    function sendCommandToModifyDocument(commandId, callback) {

        var cmd = {
            _id: commandId,
            type: "command",
            "~userid": "jacob_ge_com",
            channels: ["entity_jacob_ge_com","role-user"],
            "~status": "pending",
            request: {
                uri: command_route + "process",
                method: "PUT",
                headers: {},
                body: {
                    docID: initialDocumentId,
                    change: docModificationByCommandProcessor
                }
            }
        };

        createCbDocumentAsync(commandId, cmd, callback);

    }


    /*** TESTS ****/


    describe("Push command to the local couchDb and verify it was processed by the command processor (commandProcessor_async.js)::", function(){


        // May need more timeout value to allow command to be processed
        var originalTimeout;
        beforeAll(function(done) {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

            var docData = {
                _id: initialDocumentId,
                channels : ["entity_jacob_ge_com", "role-user"],
                description: "A document for testing; whose sole purpose is to test command processor."
            };

            createCbDocumentAsync(initialDocumentId,docData,done);

        });


        it("Send command",function(done){

            sendCommandToModifyDocument(cmdId,done);
        });


        it("Polling for command status. Command should have 'sucess' status after being processed by command processor", function (done) {

            poll(
                function () {

                    getDocumentsAsync(cmdId, pollingCallback);
                    var ret = JSON.parse(g_httpResponse);
                    console.log("Polling for command status...." + ret['~status']);
                    return ret['~status'] == 'success';
                },
                function () {

                    expect('success').toEqual(JSON.parse(g_httpResponse)['~status'], "Command should have 'sucess' status after being processed");
                    done();
                },
                function () {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                1000   //interval
            );

        });

        it("Modified by command processor document replicated back to client", function (done) {


            poll(
                function () {

                    getDocumentsAsync(initialDocumentId, pollingCallback);
                    localDocChanges = JSON.parse(g_httpResponse);
                    //console.log("Polling for document...." + Object.keys(doc.changes[0]).length);
                    //return Object.keys(localDocChanges.changes[0]).length == Object.keys(docModificationByCommandProcessor).length;
                    return typeof localDocChanges.changes === "object";
                },
                function () {

                    expect(Object.keys(docModificationByCommandProcessor).length).toEqual(Object.keys(localDocChanges.changes[0]).length, "Document should change by command processor");
                    done();
                },
                function () {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                1000   //interval
            );

        });

        it("Verify document modification is a complete match to command request by comparing fields",function(){

            var errValue = 0;
            var errKey = "";
            for (var key in docModificationByCommandProcessor) {
                if (localDocChanges.changes[0].hasOwnProperty(key)) {

                    if (docModificationByCommandProcessor[key] !== localDocChanges.changes[0][key]) {
                        errValue = key;
                    }
                } else {
                    errKey = key;
                }
            }

            expect(errKey.length).toEqual(0, "Replicated from back-end document is missing field" + errKey);
            expect(errValue).toEqual(0, "Replicated from back-end document field value mismatch for" + errValue);

        });

        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

})();


