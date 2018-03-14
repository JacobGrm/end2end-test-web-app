/**
 * Created by 204071207 on 1/13/16.
 */


var commandProcessor_negative_async = commandProcessor_negative_async || {};
commandProcessor_negative_async.subns = (function() {


    var command_route_bad = "/BAD_CMDP_TEST/";
    var cmdId = "CMD_TEST_NEG_" + generateUniqueId();

    var initialDocumentId = "DOC_INITIAL_" + generateUniqueId();
    var docModificationByCommandProcessor = generateDocumentUniqueModification(randomNumber(10,100));

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


    function sendCommandToModifyDocument(commandId, docId, route, callback) {

        var cmd = {
            _id: commandId,
            type: "command",
            "~userid": "jacob_ge_com",
            channels: ["entity_jacob_ge_com","role-user"],
            "~status": "pending",
            request: {
                uri: route + "process",
                method: "PUT",
                headers: {},
                body: {
                    docID: docId,
                    change: docModificationByCommandProcessor
                }
            }
        };

        createCbDocumentAsync(commandId, cmd, callback);

    }


    /*** TESTS ****/


    describe("Push command to the local couchDb and verify error when wrong route used (commandProcessor_negative_async.js)::", function(){


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


        it("Send command with bad route",function(done){

            sendCommandToModifyDocument(cmdId,initialDocumentId, command_route_bad, done);
        });


        it("Polling for command status. Command should have 'error' status ", function (done) {

            poll(
                function () {

                    getDocumentsAsync(cmdId, pollingCallback);
                    var ret = JSON.parse(g_httpResponse);
                    console.log("Polling for command status...." + ret['~status']);
                    return ret['~status'] == 'error';
                },
                function () {

                    expect('error').toEqual(JSON.parse(g_httpResponse)['~status'], "Command should have 'error' status");
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


        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

})();




