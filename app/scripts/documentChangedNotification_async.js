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

var documentChangedNotification_async = documentChangedNotification_async || {};
documentChangedNotification_async.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();
    var docId_noDoc = "qa_doc_" + generateUniqueId();
    var docId_2 = "qa_doc_" + generateUniqueId();
    var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId;


    function _helperCreateNotificationDocChangedListener(notificationName, scriptValue, id, callback){

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


        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":notifyService+"events/"+notificationName+id
                ,"data":data
                ,"json":isJson(data)
            },callback
        );

    };

    //Example Case 3:
    //Request-> http://pmapi/notify/events/SomeNotification
    //POST data: { "script" : "myFunction({}, {notificationName});" }
    //Result call -> myFunction(["foo", "bar"], "SomeNotification");

    function createDocumentChangedNotificationListener(id, callback){

        _helperCreateNotificationDocChangedListener(DOCUMENT_CHANGED_NOTIFICATION, "documentChangedNotificationProcessor({}, {notificationName});", id, callback);

    };


    function getDocumentChangedNotificationListener(doc, callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":notifyService+"events/"+DOCUMENT_CHANGED_NOTIFICATION+"/"+doc
            },callback
        );
    };

    //function getRegisteredNotifcationListeners(name, callback) {
    //
    //    if(typeof name === 'undefined')
    //        name = "";
    //    else
    //        name = "/"+name;
    //
    //    _setUpHttpRequestAsync(
    //        {
    //            "method":"GET"
    //            ,"url":notifyService+"events"+name
    //        },callback
    //    );
    //};

    function unsubscribeDocumentChangedNotification(doc,callback) {

        if(typeof doc === 'undefined')
            doc = "";
        else
            doc = "/"+doc;

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                ,"url":notifyService+"events/"+DOCUMENT_CHANGED_NOTIFICATION+doc
            },callback
        );
    };


    describe("Register listener for monitoring specific document changes (documentChangedNotification_async.js)::",function(){

        var qa_data = "qa_"+randomNumber(100,1000);
        beforeAll(function(done) {

            console.log("BeforeAll with createCbDocumentAsync()....");

            var data = {
                "type": "qa_doc",
                "qa_data": qa_data,
                "~userid": g_user,
                "channels": ["entity_jacob_ge_com"],
            };

            createCbDocumentAsync(docId, data, done);

        });

        it("Register listener",function(done){

            createDocumentChangedNotificationListener(docId, done);

        });

        it("Register listener for monitoring specific document changes returns status 201",function() {

            expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");
        });

        it("Get all registered notification listeners",function(done){

            getRegisteredNotifcationListeners("", done);

        });

        it("Verify listener for 'docId' is listed",function(){

            var res = JSON.parse(g_httpResponse);
            expect(res[notificationPath].indexOf("documentChangedNotificationProcessor")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

            var isCreated = Object.keys(res).length > 0;
            expect(isCreated).toEqual(true, "At least 1 listener should be listed");
        });

        it("Get specific listener for docId",function(done){

            getDocumentChangedNotificationListener(docId, done);
        });

        it("Verify call for specific listener was succefull", function(){

            expect(g_httpStatus).toEqual(200,"Expect status 200 when getting documentChangedNotification listener");
        });

        describe("Modify document being watched::",function(){

            beforeAll(function(done){

                getDocumentsAsync(docId,done);
            });

            it("Modify document being watched for changes",function(done) {

                var doc = JSON.parse(g_httpResponse);
                expect(doc.qa_data).toEqual(qa_data, "Document should not be modified yet");

                //Modify document payload
                doc.qa_data = randomNumber(100,1000);

                //Push this document to be updated in CDB
                createCbDocumentAsync(docId,doc,done);
            });

        });


        describe("Verify modified document and poll for notification to be fired",function(){

            beforeAll(function(done){

                getDocumentsAsync(docId,done);

            });

            it("Document should be modified", function(done){

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
                        done();
                    },
                    10000, //timeout
                    1000   //interval
                );

            });

            it("Verify document update notification was fired and check dictionary fileds",function(){

                expect(notificationDictionary.documentID).toEqual(docId,"Variable should be initialized by fired notification");
                expect(notificationDictionary.fromReplication).toEqual(false,"Notification fired not from replication");

                expect(typeof notificationDictionary.revisionID).toEqual("string", "revisionId field not in dictionary (DE7722 Electron)");
                expect(typeof notificationDictionary.isCurrentRevision).toEqual("boolean", "isCurrentRevision field not in dictionary");
                expect(typeof notificationDictionary.inConflict).toEqual("boolean", "inConflict field not in dictionary");

                expect(documentChangedNotificationParam).toEqual(notificationPath, "Notification name was not passed to callback");

            });

        });


        describe("Attempt to register document change listener when there is no document (documentChangedNotification_async.js)::",function(){

            qa_data = "qa_"+randomNumber(100,1000);
            beforeAll(function(done){

                createDocumentChangedNotificationListener(docId_noDoc, done);

            });

            it("Register listener attempt should fail if document does not exist",function(){

                // expect 400, even though the request is technically well-formed according to the requirement of the spec, but the target document does not exist (this is ambiguous with a non-well-formed request at the protocol level, however for this release we retain the ambiguity.)
                expect(g_httpStatus).toEqual(400, "Should not be a success if document not there");
            });
        });

        describe("Attempt to register document change listener when no document id provided(documentChangedNotification_async.js)::",function(){

            beforeAll(function(done){

                createDocumentChangedNotificationListener("",done);

            });

            it("Register listener attempt should fail if document does not exist",function(){

                expect(g_httpStatus).toEqual(400, "Should not be a success if document id not provided");
            });
        });

        describe("Register second document for Notification to be fired when document changed (documentChangedNotification_async.js)::",function(){

            var qa_data_2 = "qa_"+randomNumber(100,1000);
            beforeAll(function(done) {

                var data = {
                    "type": "qa_doc",
                    "qa_data": qa_data_2,
                    "~userid": g_user,
                    "channels": ["entity_jacob_ge_com"],
                };
                createCbDocumentAsync(docId_2, data, done);

            });

            it("Register listener for monitoring second document changes",function(done){

                createDocumentChangedNotificationListener(docId_2,done);
            });

            it("Registering listener returns status 201", function(){

                expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");
            });

            it("Get document for modification", function(done){

                getDocumentsAsync(docId_2,done);
            });

            it("Modify second document being watched",function(done){

                var doc2 = JSON.parse(g_httpResponse);
                expect(doc2.qa_data).toEqual(qa_data_2,"Document should not be modified yet");

                //Modify document payload
                doc2.qa_data = randomNumber(100,1000);

                //Push this document to be updated in CDB
                createCbDocumentAsync(docId_2,doc2,done);
            });

            it("Read modified document",function(done){

                getDocumentsAsync(docId_2,done);
            });

            it("Verify second modified document and poll for notification to be fired",function(done){

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
                        done();
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

            beforeAll(function(done) {

                notificationDictionary = {}; // reset variable

                console.log("Reset 'notificationDictionary' object to: "+Object.keys(notificationDictionary).length);
                createDocumentChangedNotificationListener(docId, done);

            });

            it("Delete document change listener",function(done){

                unsubscribeDocumentChangedNotification(docId, done);
            });

            it("Status 200 expected when unsubscribe document change listener",function(done){

                expect(g_httpStatus).toEqual(200, "Status 200 expected when unsubscribe document change listener");
                getDocumentChangedNotificationListener(docId,done);
            });

            it("Verify documentChangedNotification listener is not in a subscribed list",function(done){

                expect(g_httpStatus).toEqual(404,"Expect status 404 on unsubscribed documentChangedNotification listener");
                // get all listeners
                getRegisteredNotifcationListeners("",done);
            });

            it("Unsubscribed 'document changed notfication' listener should not be listed when asked for all listeners",function(){

                var res = JSON.parse(g_httpResponse);
                expect(res[notificationPath]).toEqual(undefined, "Unsubscribed 'document changed notfication' listener should not be listed");
            });

            it("Get unsubscribed document", function(done){

                getDocumentsAsync(docId,done);
            });

            it("Modify document unsubscribed from being watched by creating new document revision", function(done){

                var doc = JSON.parse(g_httpResponse);
                createCbDocumentAsync(docId,doc,done);
            });

            it("Verify notification was not fired",function(done){

                expect(g_httpStatus).toEqual(201,"Create doc should return status 201");

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
                        done();
                    },
                    5000, //timeout
                    1000   //interval
                );
            });

            it("Verify document update notification was not fired by checking dictionary fileds",function(){

                expect(Object.keys(notificationDictionary).length).toEqual(0,"Object should not be initialized if notification was not fired");
            });
        });
    });

})();