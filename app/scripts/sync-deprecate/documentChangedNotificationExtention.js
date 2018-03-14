/**
 * Created by 204071207 on 4/26/16.
 */


/**
 * Created by 204071207 on 1/27/16.
 */

var notificationData_1 = {};
var notificationData_2 = {};

var parameter2 = null;
var parameter3 = null;

function notificationProcessor_1(data){

    notificationData_1=data;
};

function notificationProcessor_2(data, myparam){

    notificationData_2=data;
    parameter2=myparam;
};


function notificationProcessor_3(my_param){

    parameter3=my_param;
};


var notification1 = notification1 || {};
notification1.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();
    var docId1 = "qa_doc1_" + generateUniqueId();
    var docId2 = "qa_doc2_" + generateUniqueId();

    function helperCreateNotificationListener(notificationName, scriptValue, id){

        var input_id = id;

        if(typeof id !== 'undefined') {
            id = "/" + id;
        }else{
            id="";
        }

        var data = {
            "script":scriptValue
            , documentID: input_id
        };


        _setUpHttpRequest(
            {
                "method":"POST"
                ,"url":notifyService+"events/"+notificationName+id
                ,"data":data
                ,"json":isJson(data)
            }
        );

    };

    function createNotificationListener(id, callbackName){

        helperCreateNotificationListener(DOCUMENT_CHANGED_NOTIFICATION, callbackName, id);

    };


    function getNotificationListener(doc) {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":notifyService+"events/"+DOCUMENT_CHANGED_NOTIFICATION+"/"+doc
            }
        );
    };

    function getRegisteredNotifcationListeners(name) {

        if(typeof name === 'undefined')
            name = "";
        else
            name = "/"+name;

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":notifyService+"events"+name
            }
        );
    };


        //Example Case 1:
        //Request-> http://pmapi/notify/events/SomeNotification
        //POST data: { "script" : "myFunction" }
        //Result call -> myFunction(["foo", "bar"]);

        describe("Nofitication-1: Notification fired when document changed (documentChangedNotificationExtention.js)::",function(){

            var qa_data = "qa_"+randomNumber(100,1000);
            beforeAll(function() {

                var data = {
                    "type": "qa_doc",
                    "qa_data": qa_data,
                    "~userid": g_user,
                    "channels": ["entity_jacob_ge_com"],
                };
                createCbDocument(docId, data);

            });

            it("Nofitication-1: Register listener for monitoring changes for specific document ",function(){

                createNotificationListener(docId, "notificationProcessor_1");
                expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");

                var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId;

                //Get all registered notification listeners and verify listener for 'docId' is listed
                getRegisteredNotifcationListeners();
                var res = JSON.parse(g_httpResponse);
                console.log("Print out res[notificationPath]: "+res[notificationPath]);
                expect(res[notificationPath].indexOf("notificationProcessor_1")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

                //Get specific listener for docId
                getNotificationListener(docId);
                expect(g_httpStatus).toEqual(200,"Expect status 200 when getting getNotificationListener listener");

                var isCreated = Object.keys(res).length > 0;
                expect(isCreated).toEqual(true, "At least 1 listener should be listed");
                expect(res[notificationPath].indexOf("notificationProcessor_1")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

            });

            it("Nofitication-1: Modify document being watched",function(){

                getDocuments(docId);
                var doc = JSON.parse(g_httpResponse);
                expect(doc.qa_data).toEqual(qa_data,"Document should not be modified yet");

                //Modify document payload
                doc.qa_data = randomNumber(100,1000);

                //Push this document to be updated in CDB
                createCbDocument(docId,doc);
                expect(g_httpStatus).toEqual(201);
            });

            it("Nofitication-1: Verify modified document and poll for notification to be fired",function(done){

                getDocuments(docId);
                var doc = JSON.parse(g_httpResponse);
                expect(doc.qa_data).not.toEqual(qa_data);

                poll(
                    function() {

                        return notificationData_1.documentID===docId;
                    },
                    function() {
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                    },
                    10000, //timeout
                    1000   //interval
                );

            });

            it("Nofitication-1: Verify document update notification was fired and check dictionary fileds",function(){

                expect(notificationData_1.documentID).toEqual(docId,"Variable should be initialized by fired notification");
                expect(notificationData_1.fromReplication).toEqual(false,"Notification fired not from replication");

                expect(typeof notificationData_1.revisionID).toEqual("string", "revisionId field not in dictionary");
                expect(typeof notificationData_1.isCurrentRevision).toEqual("boolean", "isCurrentRevision field not in dictionary");
                expect(typeof notificationData_1.inConflict).toEqual("boolean", "inConflict field not in dictionary");

            });

        });


    //Example Case 2:
    //Request-> http://pmapi/notify/events/SomeNotification
    //POST data: { "script" : "myFunction({}, "static_parameter");" }
    //Result call -> myFunction(["foo", "bar"], "static_parameter");

    describe("Nofitication-2: Notification fired when document changed (documentChangedNotificationExtention.js)::",function(){

        var qa_data = "qa_"+randomNumber(100,1000);
        beforeAll(function() {

            var data = {
                "type": "qa_doc",
                "qa_data": qa_data,
                "~userid": g_user,
                "channels": ["entity_jacob_ge_com"],
            };
            createCbDocument(docId1, data);

        });

        it("Nofitication-2: Register listener for monitoring changes for specific document ",function(){


            createNotificationListener(docId1, "notificationProcessor_2({}, 'static_parameter_12345');");
            expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");

            var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId1;

            //Get all registered notification listeners and verify listener for 'docId1' is listed
            getRegisteredNotifcationListeners();
            var res = JSON.parse(g_httpResponse);
            expect(res[notificationPath].indexOf("notificationProcessor_2")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

            //Get specific listener for docId1
            getNotificationListener(docId1);
            expect(g_httpStatus).toEqual(200,"Expect status 200 when getting documentChangedNotification listener");
            //expect(Object.keys(res).length).toEqual(1, "Only 1 listener should be listed");
            expect(res[notificationPath].indexOf("notificationProcessor_2")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

        });

        it("Nofitication-2: Modify document being watched",function(){

            getDocuments(docId1);
            var doc = JSON.parse(g_httpResponse);
            expect(doc.qa_data).toEqual(qa_data,"Document should not be modified yet");

            //Modify document payload
            doc.qa_data = randomNumber(100,1000);

            //Push this document to be updated in CDB
            createCbDocument(docId1,doc);
            expect(g_httpStatus).toEqual(201);
        });

        it("Nofitication-2: Verify modified document and poll for notification to be fired",function(done){

            getDocuments(docId1);
            var doc = JSON.parse(g_httpResponse);
            expect(doc.qa_data).not.toEqual(qa_data);

            poll(
                function() {

                    return notificationData_2.documentID===docId1;
                },
                function() {
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                },
                10000, //timeout
                1000   //interval
            );

        });

        it("Nofitication-2: Verify document update notification was fired and check dictionary fileds",function(){

            expect(notificationData_2.documentID).toEqual(docId1,"Variable should be initialized by fired notification");
            expect(notificationData_2.fromReplication).toEqual(false,"Notification fired not from replication");

            expect(typeof notificationData_2.revisionID).toEqual("string", "revisionId field not in dictionary");
            expect(typeof notificationData_2.isCurrentRevision).toEqual("boolean", "isCurrentRevision field not in dictionary");
            expect(typeof notificationData_2.inConflict).toEqual("boolean", "inConflict field not in dictionary");

            expect(parameter2).toEqual("static_parameter_12345", "static parameter was not passed");

        });

    });


    //Example Case 4:
    //Request-> http://pmapi/notify/events/SomeNotification
    //POST data: { "script" : "myFunction({notificationName});" }
    //Result call -> myFunction("SomeNotification");

    describe("Nofitication-3: Notification fired when document changed (documentChangedNotificationExtention.js)::",function(){

        var qa_data = "qa_"+randomNumber(100,1000);
        beforeAll(function() {

            var data = {
                "type": "qa_doc",
                "qa_data": qa_data,
                "~userid": g_user,
                "channels": ["entity_jacob_ge_com"],
            };
            createCbDocument(docId2, data);

        });

        it("Nofitication-3: Register listener for monitoring changes for specific document ",function(){


            createNotificationListener(docId2, "notificationProcessor_3({notificationName});");
            expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");

            var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId2;

            //Get all registered notification listeners and verify listener for 'docId2' is listed
            getRegisteredNotifcationListeners();
            var res = JSON.parse(g_httpResponse);
            expect(res[notificationPath].indexOf("notificationProcessor_3")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

            //Get specific listener for docId2
            getNotificationListener(docId2);
            expect(g_httpStatus).toEqual(200,"Expect status 200 when getting documentChangedNotification listener");
            //expect(Object.keys(res).length).toEqual(1, "Only 1 listener should be listed");
            expect(res[notificationPath].indexOf("notificationProcessor_3")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

        });

        it("Nofitication-3: Modify document being watched",function(){

            getDocuments(docId2);
            var doc = JSON.parse(g_httpResponse);
            expect(doc.qa_data).toEqual(qa_data,"Document should not be modified yet");

            //Modify document payload
            doc.qa_data = randomNumber(100,1000);

            //Push this document to be updated in CDB
            createCbDocument(docId2,doc);
            expect(g_httpStatus).toEqual(201);
        });

        it("Nofitication-3: Verify modified document and poll for notification to be fired",function(done){

            getDocuments(docId2);
            var doc = JSON.parse(g_httpResponse);
            expect(doc.qa_data).not.toEqual(qa_data);

            poll(
                function() {

                    return parameter3===DOCUMENT_CHANGED_NOTIFICATION+"/"+docId2;
                },
                function() {
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                },
                10000, //timeout
                1000   //interval
            );

        });

        it("Nofitication-3: Verify document update notification was fired and check dictionary fileds",function(){

            expect(parameter3).toEqual(DOCUMENT_CHANGED_NOTIFICATION+"/"+docId2, "Notification name was not passed to callback");

        });

    });

})();

