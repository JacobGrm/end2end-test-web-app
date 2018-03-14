/**
 * Created by 204071207 on 1/27/16.
 */

var notificationDictionary = {};
var documentChangedNotificationParam = null;

function documentChangedNotificationProcessor(data, notificationName){

    console.log("DOCUMENT CHANGED NOTIFICATION CALLED....");
    
    notificationDictionary=data;
    documentChangedNotificationParam=notificationName;
};

var documentChangedNotification = documentChangedNotification || {};
documentChangedNotification.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();
    var docId_noDoc = "qa_doc_" + generateUniqueId();
    var docId_2 = "qa_doc_" + generateUniqueId();

    function _helperCreateNotificationDocChangedListener(notificationName, scriptValue, id){

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

    //Example Case 3:
    //Request-> http://pmapi/notify/events/SomeNotification
    //POST data: { "script" : "myFunction({}, {notificationName});" }
    //Result call -> myFunction(["foo", "bar"], "SomeNotification");

    function createDocumentChangedNotificationListener(id){

        _helperCreateNotificationDocChangedListener(DOCUMENT_CHANGED_NOTIFICATION, "documentChangedNotificationProcessor({}, {notificationName});", id);

    };


    function getDocumentChangedNotificationListener(doc) {

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

    function unsubscribeDocumentChangedNotification(doc) {

        if(typeof doc === 'undefined')
            doc = "";
        else
            doc = "/"+doc;

        _setUpHttpRequest(
            {
                "method":"DELETE"
                ,"url":notifyService+"events/"+DOCUMENT_CHANGED_NOTIFICATION+doc
            }
        );
    };

    describe("Notification of document changes (documentChangedNotification.js)::",function(){

        describe("Notification fired when document changed (documentChangedNotification.js)::",function(){

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

            it("Register listener for monitoring specific document changes",function(){

                createDocumentChangedNotificationListener(docId);
                expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");

                var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId;

                //Get all registered notification listeners and verify listener for 'docId' is listed
                getRegisteredNotifcationListeners();
                var res = JSON.parse(g_httpResponse);
                expect(res[notificationPath].indexOf("documentChangedNotificationProcessor")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

                //Get specific listener for docId
                getDocumentChangedNotificationListener(docId);
                expect(g_httpStatus).toEqual(200,"Expect status 200 when getting documentChangedNotification listener");

                var isCreated = Object.keys(res).length > 0;
                expect(isCreated).toEqual(true, "At least 1 listener should be listed");
                expect(res[notificationPath].indexOf("documentChangedNotificationProcessor")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

            });

            it("Modify document being watched",function(){

                getDocuments(docId);
                var doc = JSON.parse(g_httpResponse);
                expect(doc.qa_data).toEqual(qa_data,"Document should not be modified yet");

                //Modify document payload
                doc.qa_data = randomNumber(100,1000);

                //Push this document to be updated in CDB
                createCbDocument(docId,doc);
                expect(g_httpStatus).toEqual(201);
            });

            it("Verify modified document and poll for notification to be fired",function(done){

                getDocuments(docId);
                var doc = JSON.parse(g_httpResponse);
                expect(doc.qa_data).not.toEqual(qa_data);

                poll(
                    function() {

                        return notificationDictionary.documentID===docId;
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

            it("Verify document update notification was fired and check dictionary fileds",function(){

                expect(notificationDictionary.documentID).toEqual(docId,"Variable should be initialized by fired notification");
                expect(notificationDictionary.fromReplication).toEqual(false,"Notification fired not from replication");

                expect(typeof notificationDictionary.revisionID).toEqual("string", "revisionId field not in dictionary");
                expect(typeof notificationDictionary.isCurrentRevision).toEqual("boolean", "isCurrentRevision field not in dictionary");
                expect(typeof notificationDictionary.inConflict).toEqual("boolean", "inConflict field not in dictionary");

                expect(documentChangedNotificationParam).toEqual(DOCUMENT_CHANGED_NOTIFICATION+"/"+docId, "Notification name was not passed to callback");

            });

        });


        describe("Attempt to register document change listener when there is no document (documentChangedNotification.js)::",function(){

            var qa_data = "qa_"+randomNumber(100,1000);

            it("Register listener attempt should fail if document does not exist",function(){

                createDocumentChangedNotificationListener(docId_noDoc);
                // expect 400, even though the request is technically well-formed according to the requirement of the spec, but the target document does not exist (this is ambiguous with a non-well-formed request at the protocol level, however for this release we retain the ambiguity.)
                expect(g_httpStatus).toEqual(400, "Should not be a success if document not there");
            });
        });

        describe("Attempt to register document change listener when no document id provided(documentChangedNotification.js)::",function(){

            it("Register listener attempt should fail if document does not exist",function(){

                createDocumentChangedNotificationListener();
                expect(g_httpStatus).toEqual(400, "Should not be a success if document id not provided");
            });
        });

        describe("Register second document for Notification to be fired when document changed (documentChangedNotification.js)::",function(){

            var qa_data_2 = "qa_"+randomNumber(100,1000);
            beforeAll(function() {

                var data = {
                    "type": "qa_doc",
                    "qa_data": qa_data_2,
                    "~userid": g_user,
                    "channels": ["entity_jacob_ge_com"],
                };
                createCbDocument(docId_2, data);

            });

            it("Register listener for monitoring second document changes (DE26681 ios)",function(){

                createDocumentChangedNotificationListener(docId_2);
                expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");
            });

            it("Modify second document being watched",function(){

                getDocuments(docId_2);
                var doc2 = JSON.parse(g_httpResponse);
                expect(doc2.qa_data).toEqual(qa_data_2,"Document should not be modified yet");

                //Modify document payload
                doc2.qa_data = randomNumber(100,1000);

                //Push this document to be updated in CDB
                createCbDocument(docId_2,doc2);
                expect(g_httpStatus).toEqual(201);
            });

            it("Verify second modified document and poll for notification to be fired",function(done){

                getDocuments(docId_2);
                var doc1 = JSON.parse(g_httpResponse);
                expect(doc1.qa_data).not.toEqual(qa_data_2);

                poll(
                    function() {

                        return notificationDictionary.documentID===docId_2;
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

            it("Verify update notification was fired for second document",function(){

                expect(notificationDictionary.documentID).toEqual(docId_2,"Variable should be initialized by fired notification");
            });

        });


        describe("Delete registered documentChangedNotification and verify it's not active after being deleted::",function(){

            beforeAll(function() {

                notificationDictionary = {}; // reset variable

                console.log("Reset 'notificationDictionary' object to: "+Object.keys(notificationDictionary).length);
                createDocumentChangedNotificationListener(docId);

            });

            it("Delete documentChangedNotification and verify it's not in a subscribed list",function(){

                unsubscribeDocumentChangedNotification(docId);
                expect(g_httpStatus).toEqual(200, "Status 200 expected when unsubscribe document change listener");

                getDocumentChangedNotificationListener(docId);
                expect(g_httpStatus).toEqual(404,"Expect status 404 on unsubscribed documentChangedNotification listener");

                var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId;
                getRegisteredNotifcationListeners();

                var res = JSON.parse(g_httpResponse);
                expect(res[notificationPath]).toEqual(undefined, "Unsubscribed 'document changed notfication' listener should not be listed");
            });

            it("Modify document unsubscribed from being watched by creating new document revision",function(done){

                getDocuments(docId);
                var doc = JSON.parse(g_httpResponse);

                createCbDocument(docId,doc);
                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        return Object.keys(notificationDictionary).length === 0;
                    },
                    function() {
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                    },
                    5000, //timeout
                    1000   //interval
                );
            });

            it("Verify document update notification was not fired and check dictionary fileds",function(){

                expect(Object.keys(notificationDictionary).length).toEqual(0,"Object should not be initialized if notification was not fired");
            });
        });
    });

})();