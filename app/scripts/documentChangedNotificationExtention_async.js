/**
 * Created by 204071207 on 4/26/16.
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


var docChangedNotificationExt_async = docChangedNotificationExt_async || {};
docChangedNotificationExt_async.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();
    var docId1 = "qa_doc1_" + generateUniqueId();
    var docId2 = "qa_doc2_" + generateUniqueId();

    //var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId;

    function helperCreateNotificationListener(notificationName, scriptValue, id, callback){

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

    function createNotificationListener(id, scriptValue, callback){

        helperCreateNotificationListener(DOCUMENT_CHANGED_NOTIFICATION, scriptValue, id, callback);

    };


    function getNotificationListener(doc, callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":notifyService+"events/"+DOCUMENT_CHANGED_NOTIFICATION+"/"+doc
            },callback
        );
    };

    function getRegisteredNotifcationListeners(name, callback) {

        if(typeof name === 'undefined')
            name = "";
        else
            name = "/"+name;

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":notifyService+"events"+name
            },callback
        );
    };


    //Example Case 1:
    //Request-> http://pmapi/notify/events/SomeNotification
    //POST data: { "script" : "myFunction" }
    //Result call -> myFunction(["foo", "bar"]);

    describe("Nofitication-1: Notification fired when document changed (documentChangedNotificationExtention_async.js)::",function(){

        var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId;

        var qa_data = "qa_"+randomNumber(100,1000);
        beforeAll(function(done) {

            var data = {
                "type": "qa_doc",
                "qa_data": qa_data,
                "~userid": g_user,
                "channels": ["entity_jacob_ge_com"],
            };
            createCbDocumentAsync(docId, data, done);
        });

        it("Nofitication-1: Register listener for monitoring changes for specific document",function(done){

            expect(g_httpStatus).toEqual(201,"Document create should return 201 status");
            createNotificationListener(docId, "notificationProcessor_1",done);
        });

        it("Nofitication-1: Verify status returned is 201",function(done){

            poll(
                function() {

                    expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");
                    console.log("Print out g_httpStatus: "+g_httpStatus);
                    return g_httpStatus===201;
                },
                function() {

                    console.log("Conditions 1 met...");
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


        it("Nofitication-1: Get all registered notification listeners",function(done){

            var temp; // undefined
            getRegisteredNotifcationListeners(temp,done);
        });

        it("Nofitication-1: Verify listener for 'docId' is listed",function(){

            var res = JSON.parse(g_httpResponse);
            expect(res[notificationPath].indexOf("notificationProcessor_1")).not.toEqual(-1, "No subscribed document changed notfication listeners found");
        });

        it("Nofitication-1: Get specific listener for docId",function(done){

            getNotificationListener(docId,done);

        });

        it("Notification-1: Verify calls return status 200 but no data (DE22417 Electron)",function(){

            expect(g_httpStatus).toEqual(200,"Expect status 200 when getting getNotificationListener listener");

            console.log("getNotificationListener() call g_httpResponse: "+g_httpResponse);

            // see documentation here: https://github.com/PredixDev/PredixMobileSDK/wiki/Notify#method-get
            expect(g_httpResponse.length).toEqual(0, "getNotificationListener() call g_httpResponse should return no data");
        });

        it("Nofitication-1: Get document for modification",function(done){

            getDocumentsAsync(docId,done);
        });

        it("Nofitication-1: Modify document being watched",function(done){

            var doc = JSON.parse(g_httpResponse);
            expect(doc.qa_data).toEqual(qa_data,"Document should not be modified yet");

            //Modify document payload
            doc.qa_data = randomNumber(100,1000);

            //Push this document to be updated in CDB
            createCbDocumentAsync(docId,doc,done);
        });

        it("Nofitication-1: Fetch modified document",function(done){

            getDocumentsAsync(docId,done);
        });

        it("Nofitication-1: Verify modified document and poll for notification to be fired",function(done){

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
                    done();
                },
                10000, //timeout
                1000   //interval
            );

        });

        it("Nofitication-1: Verify document update notification was fired and check dictionary fileds",function(){

            expect(notificationData_1.documentID).toEqual(docId,"Variable should be initialized by fired notification");
            expect(notificationData_1.fromReplication).toEqual(false,"Notification fired not from replication");

            expect(typeof notificationData_1.revisionID).toEqual("string", "revisionId field not in dictionary or is not of string type (DE7722 Electron)");
            expect(typeof notificationData_1.isCurrentRevision).toEqual("boolean", "isCurrentRevision field not in dictionary");
            expect(typeof notificationData_1.inConflict).toEqual("boolean", "inConflict field not in dictionary");

        });

    });


    //Example Case 2:
    //Request-> http://pmapi/notify/events/SomeNotification
    //POST data: { "script" : "myFunction({}, "static_parameter");" }
    //Result call -> myFunction(["foo", "bar"], "static_parameter");

    describe("Nofitication-2: Notification fired when document changed (documentChangedNotificationExtention_async.js)::",function(){

        var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId1;
        var qa_data = "qa_"+randomNumber(100,1000);
        beforeAll(function(done) {

            var data = {
                "type": "qa_doc",
                "qa_data": qa_data,
                "~userid": g_user,
                "channels": ["entity_jacob_ge_com"],
            };
            createCbDocumentAsync(docId1, data, done);

        });

        it("Nofitication-2: Register listener for monitoring changes for specific document ",function(done){

            createNotificationListener(docId1, "notificationProcessor_2({}, 'static_parameter_12345');", done);
        });

        it("Nofitication-2: Get all registered notification listeners",function(done){

            expect(g_httpStatus).toEqual(201, "Expect status 201 when registering listener");
            var temp; // undefined
            getRegisteredNotifcationListeners(temp,done);
        });

        it("Nofitication-2: Verify listener for 'docId1' is listed ",function(){


            var res = JSON.parse(g_httpResponse);
            expect(res[notificationPath].indexOf("notificationProcessor_2")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

        });

        it("Nofitication-2: Get specific listener for docId1",function(done){

            getNotificationListener(docId1,done);
        });

        it("Notification-2: Verify calls return status 200 but no data (DE22417 Electron)",function(){

            expect(g_httpStatus).toEqual(200,"Expect status 200 when getting getNotificationListener listener");

            // see documentation here: https://github.com/PredixDev/PredixMobileSDK/wiki/Notify#method-get
            expect(g_httpResponse.length).toEqual(0, "getNotificationListener() call g_httpResponse should return no data");

        });

        it("Nofitication-2: Get document for modification",function(done){

            getDocumentsAsync(docId1,done);
        });

        it("Nofitication-2: Modify document being watched",function(done){

            var doc = JSON.parse(g_httpResponse);
            expect(doc.qa_data).toEqual(qa_data,"Document should not be modified yet");

            //Modify document payload
            doc.qa_data = randomNumber(100,1000);

            //Push this document to be updated in CDB
            createCbDocumentAsync(docId1,doc, done);
        });

        it("Nofitication-2: Fetch modified document",function(done){

            getDocumentsAsync(docId1,done);
        });

        it("Nofitication-2: Verify modified document and poll for notification to be fired",function(done){

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
                    done();
                },
                10000, //timeout
                1000   //interval
            );

        });

        it("Nofitication-2: Verify document update notification was fired and check dictionary fileds",function(){

            expect(notificationData_2.documentID).toEqual(docId1,"Variable should be initialized by fired notification");
            expect(notificationData_2.fromReplication).toEqual(false,"Notification fired not from replication");

            expect(typeof notificationData_2.revisionID).toEqual("string", "revisionId field not in dictionary or is not of string type (DE7722 Electron)");
            expect(typeof notificationData_2.isCurrentRevision).toEqual("boolean", "isCurrentRevision field not in dictionary");
            expect(typeof notificationData_2.inConflict).toEqual("boolean", "inConflict field not in dictionary");

            expect(parameter2).toEqual("static_parameter_12345", "static parameter was not passed");

        });

    });


    //Example Case 4:
    //Request-> http://pmapi/notify/events/SomeNotification
    //POST data: { "script" : "myFunction({notificationName});" }
    //Result call -> myFunction("SomeNotification");

    describe("Nofitication-3: Notification fired when document changed (documentChangedNotificationExtention_async.js)::",function(){

        var notificationPath = DOCUMENT_CHANGED_NOTIFICATION+"/"+docId2;
        var qa_data = "qa_"+randomNumber(100,1000);
        beforeAll(function(done) {

            var data = {
                "type": "qa_doc",
                "qa_data": qa_data,
                "~userid": g_user,
                "channels": ["entity_jacob_ge_com"],
            };
            createCbDocumentAsync(docId2, data, done);

        });

        it("Nofitication-3: Register listener for monitoring changes for specific document ",function(done){

            createNotificationListener(docId2, "notificationProcessor_3({notificationName});",done);
        });

        it("Nofitication-3: Get all registered notification listeners",function(done){

            expect(g_httpStatus).toEqual(201, "Expect status 201 when registering listener");
            var temp; // undefined
            getRegisteredNotifcationListeners(temp,done);
        });


        it("Nofitication-3: Verify listener for 'docId2' is listed ",function(){


            var res = JSON.parse(g_httpResponse);
            expect(res[notificationPath].indexOf("notificationProcessor_3")).not.toEqual(-1, "No subscribed document changed notfication listeners found");

        });

        it("Nofitication-3: Get specific listener for docId2",function(done){

            getNotificationListener(docId2,done);

        });

        it("Notification-3: Verify calls return status 200 but no data (DE22417 Electron)",function(){

            expect(g_httpStatus).toEqual(200,"Expect status 200 when getting getNotificationListener listener");

            // see documentation here: https://github.com/PredixDev/PredixMobileSDK/wiki/Notify#method-get
            expect(g_httpResponse.length).toEqual(0, "getNotificationListener() call g_httpResponse should return no data");

        });

        it("Nofitication-3: Get document for modification",function(done){

            getDocumentsAsync(docId2,done);
        });


        it("Nofitication-3: Modify document being watched",function(done){

            var doc = JSON.parse(g_httpResponse);
            expect(doc.qa_data).toEqual(qa_data,"Document should not be modified yet");

            //Modify document payload
            doc.qa_data = randomNumber(100,1000);

            //Push this document to be updated in CDB
            createCbDocumentAsync(docId2,doc, done);
        });

        it("Nofitication-3: Fetch modified document",function(done){

            getDocumentsAsync(docId2,done);
        });

        it("Nofitication-3: Verify modified document and poll for notification to be fired",function(done){

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
                    done();
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

