/**
 * Created by 204071207 on 10/16/17.
 */


var databaseChangednotificationDictionary = {};
var databaseChangedNotificationParam = null;


function databaseChangedNotificationProcessor(data, notificationName){

    console.log("Database changed notification called....");

    databaseChangednotificationDictionary=data;
    databaseChangedNotificationParam=notificationName;
};

var databaseChangedNotification = databaseChangedNotification || {};
databaseChangedNotification.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();
    var docId_1 = "qa_doc_" + generateUniqueId();


    function createDatabaseChangedNotificationListener(notificationName, scriptName, callback){

        var data = {
            "script":scriptName
        };

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":notifyService+"events/"+notificationName
                ,"data":data
                ,"json":isJson(data)
            },callback
        );

    };

    function getDatabaseChangedNotificationListener(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":notifyService+"events/"+DATABASE_CHANGED_NOTIFICATION
            },callback
        );
    };

    function unsubscribeDatabaseChangedNotification(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                ,"url":notifyService+"events/"+DATABASE_CHANGED_NOTIFICATION
            },callback
        );
    };



    describe("Testing DatabaseChangedNotification posted notification (databaseChangedNotification_async.js)::",function(){

        describe("Registering listener should return status 201 and listener is listed",function(){

            it("Register listener for DatabaseChangedNotification",function(done){

                createDatabaseChangedNotificationListener(
                    DATABASE_CHANGED_NOTIFICATION,
                    "databaseChangedNotificationProcessor({}, {notificationName});",
                    done);
            });

            it("Verify status 201",function() {

                expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");
            });

            it("Get this listener",function(done){

                getDatabaseChangedNotificationListener(done);
            });

            it("Verify call to get listener was succefull", function(){

                expect(g_httpStatus).toEqual(200);
            });

            it("Get all registered notification listeners",function(done){

                getRegisteredNotifcationListeners("", done);

            });

            it("Verify listener is listed",function(){

                var res = JSON.parse(g_httpResponse);
                expect(res[DATABASE_CHANGED_NOTIFICATION].indexOf("databaseChangedNotificationProcessor")).not.toEqual(-1, "No subscribed database changed notfication listeners found");

                var isCreated = Object.keys(res).length > 0;
                expect(isCreated).toEqual(true, "At least 1 listener should be listed");
            });

        });

        describe("Adding document to database should fire notification",function(){

            it("Create documents",function(done){

                var documents = {

                    "docs": [
                        {
                            "_id": docId
                        },
                        {
                            "_id": docId_1
                        }
                    ]
                };

                createDocumentsBulkAsync(documents, done);
            });

            it("Wait for notification to be fired",function(done){

                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        return databaseChangedNotificationParam===DATABASE_CHANGED_NOTIFICATION;
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


            it("Verify dictionary parameters (DE51427 Android)",function(){

                expect(Array.isArray(databaseChangednotificationDictionary.changes)).toEqual(true);
                expect(databaseChangednotificationDictionary.changes.length).toEqual(2, "2 documents were created");

                expect(databaseChangednotificationDictionary.changes[0].documentID).toEqual(docId,"Variable should be initialized by fired notification");
                expect(typeof databaseChangednotificationDictionary.changes[0].fromReplication).toEqual("boolean");
                expect(typeof databaseChangednotificationDictionary.changes[0].revisionID).toEqual("string");
                expect(typeof databaseChangednotificationDictionary.changes[0].isCurrentRevision).toEqual("boolean", "isCurrentRevision field not in dictionary");
                expect(typeof databaseChangednotificationDictionary.changes[0].inConflict).toEqual("boolean", "inConflict field not in dictionary");

                expect(databaseChangedNotificationParam).toEqual(DATABASE_CHANGED_NOTIFICATION, "Notification name was not passed to callback");

            });

        });

        describe("Document modification should fire notification",function(){

            // Reset variables
            beforeAll(function(){

                databaseChangedNotificationParam = null;
                databaseChangednotificationDictionary = {};
            });

            it("Modify document",function(done){

                var inputDic = {
                    "key": "some Value"
                };
                modifyDocumentPUT(docId_1,inputDic,done);
            });

            it("Wait for notification to be fired",function(done){

                expect(g_httpStatus).toEqual(200);

                poll(
                    function() {

                        return databaseChangedNotificationParam===DATABASE_CHANGED_NOTIFICATION;
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


            it("Verify dictionary parameters (DE51427)",function(){

                expect(Array.isArray(databaseChangednotificationDictionary.changes)).toEqual(true);
                expect(databaseChangednotificationDictionary.changes.length).toEqual(1, "Only 1 document was modified");

                expect(databaseChangednotificationDictionary.changes[0].documentID).toEqual(docId_1,"Variable should be initialized by fired notification");
                expect(typeof databaseChangednotificationDictionary.changes[0].fromReplication).toEqual("boolean");
                expect(typeof databaseChangednotificationDictionary.changes[0].revisionID).toEqual("string");
                expect(typeof databaseChangednotificationDictionary.changes[0].isCurrentRevision).toEqual("boolean", "isCurrentRevision field not in dictionary");
                expect(typeof databaseChangednotificationDictionary.changes[0].inConflict).toEqual("boolean", "inConflict field not in dictionary");

                expect(databaseChangedNotificationParam).toEqual(DATABASE_CHANGED_NOTIFICATION, "Notification name was not passed to callback");

            });

        });


        describe("Deleting listener should stop firing notifications",function(){

            // Reset variables
            beforeAll(function(){

                databaseChangedNotificationParam = null;
                databaseChangednotificationDictionary = {};
            });

            it("Delete database changed listener",function(done){

                unsubscribeDatabaseChangedNotification(done);
            });

            it("Status 200 expected when delete listener",function(done){

                expect(g_httpStatus).toEqual(200, "Status 200 expected when unsubscribe listener");
                getRegisteredNotifcationListeners("", done);
            });

            it("Verify listener not listed",function(){

                var res = JSON.parse(g_httpResponse);
                expect(Object.keys(res).length).toEqual(0, "No listeners should be found");
            });

            it("Modify document again",function(done){

                var inputDic1 = {
                    "key": "some value"
                };
                modifyDocumentPUT(docId,inputDic1,done);
            });

            it("Wait for notification to be fired",function(done){

                expect(g_httpStatus).toEqual(200);
                setTimeout(done, 3000);
            });

            it("Verify dictionary parameters",function(){

                expect(Object.keys(databaseChangednotificationDictionary).length).toEqual(0);
                expect(databaseChangedNotificationParam).toBeNull();
            });

        });

    });

})();
