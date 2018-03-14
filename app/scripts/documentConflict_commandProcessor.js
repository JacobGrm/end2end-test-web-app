/**
 * Created by 204071207 on 1/13/16.
 */


/*

    After test executed run thins PM CLI command to check for conflicts.

    Example:

     $ pm conflicts

     ┌─────┬────────────────────────────────────────┬───────────────┬────────────────────────────────────────────────────────────┐
     │ No  │ id                                     │ rev count     │ conflicted revisions                                       │
     ├─────┼────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────────────┤
     │ 1   │ qa_command_d3a649e2-f7e5-4c48-a686-4a… │ 2             │ {"rev":"5-e22c589ebcbd53f89428da551d3e65ee"}               │
     ├─────┼────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────────────┤
     │     │                                        │               │ {"rev":"2-38e7c233ca39ce86e6b62eaf42ec8f91"}               │
     ├─────┼────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────────────┤
     │ 2   │ testcmd3                               │ 2             │ {"rev":"1-aa5ba70d976fd7a64fe1bd1b3572e725"}               │
     ├─────┼────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────────────┤
     │     │                                        │               │ {"rev":"1-651a5a8e7e3a4876e5fe33f59def9143"}               │
     ├─────┼────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────────────┤
     │ 3   │ qa_command_ac6a6561-209f-425b-bc26-a6… │ 2             │ {"rev":"5-db8f4dbae38c06f060f3113fdd61bbf1"}               │
     ├─────┼────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────────────┤
     │     │                                        │               │ {"rev":"2-b96fa9ac48470bfe04b8be88bbcd8e4e"}               │
     ├─────┼────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────────────┤
     │     │                                        │               │                                                            │
     ├─────┼────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────────────┤
     │     │ Total conflicted revisions             │ 6             │                                                            │
     └─────┴────────────────────────────────────────┴───────────────┴────────────────────────────────────────────────────────────┘
     OK


     */



//var documentConflict_commandProcessor = documentConflict_commandProcessor || {};
//documentConflict_commandProcessor.subns = (function() {

    var command_route = "/CMDP_CONFLICTS/";
    var user_name = "";

    var now = new Date();

    var currentFieldCount = 0;


    function count(obj) { return Object.keys(obj).length; }

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


    /*** TESTS ****/


    describe("Create multiple document revisions (documentConflict_commandProcessor.js)::", function(){

        it("Get logged in user name",function(done){

            getCurrentUserName(done);

        });

        it("Initilize user name variable",function(){

            user_name = g_httpResponse;
            console.log("Current user: "+user_name);
            expect(user_name.length).not.toEqual(0);
        });



        it("Start sending commands",function(){

            function sendCommandToModifyDocument(commandId,cnt) {

                var cmd = {
                    _id: commandId,
                    type: "command",
                    "~userid": user_name,
                    channels: ["entity_jacob_ge_com", "entity_jacob2_ge_com", "entity_jacob3_ge_com", "entity_jacob4_ge_com","role-user"],
                    "~status": "pending",
                    request: {
                        uri: command_route + "process",
                        method: "PUT",
                        headers: {},
                        body: {
                            docID: g_initialDocumentId,
                            //change: generateDocumentUniqueModification(currentFieldCount=randomNumber(10,100))
                            change: {
                                who : user_name,
                                count : cnt
                            }
                        }
                    }
                };

                console.log("Initial docId: "+g_initialDocumentId);
                console.log('about to call createCbDocumentAsync: '+ commandId+', command: ',cmd);
                createCbDocumentAsync(commandId, cmd, pollingCallback);

            }

            var index = 0;
            var isRunning = true;
            var timerID = setInterval(function() {
                if(index >= g_commandsSendCount || !isRunning) {
                    console.log('stopping the timer... inside setInterval.');
                    isRunning = false;
                    stopTimer();
                    return;
                }
                var cmdId = "CMD_CONFLICT_" +index +'_docid_' + g_initialDocumentId + "_" + generateUniqueId();
                console.log("Sending command by user: "+user_name+ ", CommandId: "+cmdId);
                sendCommandToModifyDocument(cmdId,index);
                ++index;
            }, 500);

            function stopTimer() {
                console.log('Stopping the timer now...');
                clearInterval(timerID);
            }

        });

    });


//})();


