/**
 * Created by 204071207 on 5/31/17.
 */

/**

 Native code has to be there to create the view:

 IOS:

    PredixMobilityConfiguration.appendDataViewDefinition("myview/querytest",
        version: "1",
        mapFunction: { (properties, emit) -> () in
    guard let type = properties["type"] as? String
    else {
            return
        }
        emit(type, properties["category"])
    })


 Android (MainActivity.java):

     private void createCustomCategoryView(){

            DBViewDefinition typeView = new DBViewDefinition() {
                @Override
                public void mapFunction(final Map<String, Object> properties, final DBViewEmitter emitter) {
                    if (!properties.containsKey("type")) {
                        return;
                    }
                    String type = (String)properties.get("type");
                    String category = (String)properties.get("category");
                    emitter.emit(type, category);
                }

                @Override
                public String getViewName() {
                    return "myview/querytest";
                }

                @Override
                public String getViewVersion() {
                    return "1";
                }
            };

            PredixMobileConfiguration.appendDataViewDefinition(typeView);
        }


 */


// Questions and TODO:

/**
 *

 // TODO -> If a script parameter is provided, but not a notificationName parameter, the a value of the script parameter is used as the notification name.

 // TODO -> If the script parameter contains parentheses, the notfication name will be the substring of the script parameter up to the open parentheses ( character.

 // TODO The notificationName must be globally unique. Subscribing to two views using the same notificationName will result in the second subscription replacing the first

 */

var notificationScriptData = undefined;
var notificationScriptData1 = undefined;


function myQueryMonitorScript(data){

    notificationScriptData = data;
    console.log("myQueryMonitorScript script called: "+data);
}

function myQueryMonitorScript1(data){

    notificationScriptData1 = data;
    console.log("myQueryMonitorScript1 script called: "+data);
}



var queryingViews_async = queryingViews_async || {};
queryingViews_async.subns = (function() {

    var dataJSON;
    var viewName = "myview/querytest";

    var docType = "type_"+generateUniqueId();

    var docType1 = "type1_"+generateUniqueId();
    var docCategory = "fruits_"+generateUniqueId();

    var docCategory1 = "meat";

    var documentCount = 0;

    var notification = "myNotification_"+generateUniqueId();
    var notification1 = "myNotification1_"+generateUniqueId();

    var JSON_path = "./res/query_view_data.json";

    //function createDocumentsBulkAsync(data, callback) {
    //
    //    _setUpHttpRequestAsync(
    //
    //        {
    //            "method":"POST"
    //            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + "_bulk_docs"
    //            ,"data":data
    //            ,"json":isJson(data)
    //        },callback
    //    );
    //}


    function loadJSON(callback) {
        var xmlhttp = new XMLHttpRequest();
        var url = JSON_path;

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                dataJSON = JSON.parse(xmlhttp.responseText);
                expect(dataJSON).not.toEqual('undefined'); // to supress jasmine warning
                callback();
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }



    function init() {

        var len = dataJSON.docs.length;
        var docCnt = Math.floor(len/2);

        for(var i = 0; i< len; i++){

            dataJSON.docs[i]._id = "id_" + generateUniqueId();

            if(i < docCnt) {

                dataJSON.docs[i].type = docType;
                dataJSON.docs[i].category = docCategory;
            } else {

                dataJSON.docs[i].type = docType1;
                dataJSON.docs[i].category = docCategory1;
            }
        }

        return docCnt;
    }


    // View name - "myview/querytest"
    function getViewDocuments(inputDict, viewName, callback) {

        //http://pmapi/db/{databaseName}/query/{view}

        if(viewName.length >0)
            viewName = "/"+viewName;

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                //,"url": url
                ,"url": LOCAL_COUCHDB_HIGH_LEVEL + "query" + viewName
                ,"data":inputDict
                ,"json":isJson(inputDict)

            },callback
        );
    };

    function validateView(item){

        expect(item.key).toEqual(docType);
        expect(item.value).toEqual(docCategory);

    };

    function validateView1(item){

        expect(item.key).toEqual(docType1);
        expect(item.value).toEqual(docCategory1);

    };

    function validateView2(item){

        expect((item.key === docType) || (item.key === docType1)).toBe(true);

        if(item.key === docType){

            expect(item.value).toEqual(docCategory);
        }

        if(item.key === docType1){

            expect(item.value).toEqual(docCategory1);
        }
    };

    function deleteViewNotification(callback, name) {

        if(name.length >0)
            name = "/"+name;
        if(typeof name === 'undefined')
            name = "";

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                //,"url":url_no_view_name + name
                ,"url":LOCAL_COUCHDB_HIGH_LEVEL + "query/" + viewName + name
            },callback
        );
    };

    function getNotifcationListener(callback,name) {

        if(typeof name === 'undefined')
            name = "";
        else
            name = "/"+name;

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":notifyService+"events"+name
            }, callback
        );
    };


    describe("Querying Views (queryingViews_async.js)::",function(){

        describe("Pre-requisite: Create muliple documents",function() {

            it("Load JSON", function (done) {

                loadJSON(done);
            });

            it("Modify JSON to make each document's id unique", function () {

                documentCount = init();
                expect(documentCount).toBeGreaterThan(0);

            });


            it("Create multiple documents in bulk", function (done) {

                createDocumentsBulkAsync(dataJSON, done);

            });

            it("Verify documents successfully created", function () {

                expect(g_httpStatus).toEqual(201);
            });

        });

        describe("Query view with API calls containing different input JSONs",function() {

            describe("Input JSON #1",function(){

                var viewRowCount;
                var resultSet;

                var dict = {
                    "keys": [docType]
                }


                it("API call to query a view", function(done){

                    getViewDocuments(dict, viewName, done);
                });

                it("Verify query result set", function(){

                    resultSet = JSON.parse(g_httpResponse);

                    viewRowCount = resultSet.rows.length;
                    expect(viewRowCount).toEqual(documentCount);

                    expect(g_httpStatus).toEqual(200);

                    resultSet.rows.forEach(validateView);

                });

                it("Verify other fields in the resulting output JSON dictionary",function(){

                    expect(typeof resultSet.count).toEqual("number");

                    expect(typeof resultSet.includesDocuments).toEqual("boolean");
                    expect(resultSet.includesDocuments).toBe(false);

                    // test for "includeDocuments" flag
                    expect(typeof resultSet.rows[0].doc).toEqual("undefined");

                    expect(typeof resultSet.offset).toEqual("number");
                    expect(resultSet.offset).toEqual(0); // because skipRows was not provided in input

                });

            });

            describe("Input JSON #2",function(){

                var viewRowCount1;
                var resultSet1;

                var dict1 = {
                    "keys": [docType1],
                    "sortOrder": "descending",
                    "limitRows": 5,
                    "skipRows":2,
                    "includeDocuments": true
                }

                it("API call to query a view", function(done){

                    getViewDocuments(dict1, viewName, done);
                });

                it("Verify query result set", function(){

                    resultSet1 = JSON.parse(g_httpResponse);

                    viewRowCount1 = resultSet1.rows.length;
                    expect(viewRowCount1).toEqual(dict1.limitRows);

                    expect(g_httpStatus).toEqual(200);

                    resultSet1.rows.forEach(validateView1);

                });

                it("Verify the resulting output is be a JSON dictionary containing all documented keys",function(){

                    expect(typeof resultSet1.count).toEqual("number");
                    expect(resultSet1.count).toEqual(dict1.limitRows);

                    expect(viewRowCount1).toEqual(dict1.limitRows);

                    expect(typeof resultSet1.includesDocuments).toEqual("boolean");
                    expect(resultSet1.includesDocuments).toBe(true);

                    // test for "includeDocuments" flag
                    expect(typeof resultSet1.rows[0].doc).toEqual("object");

                    expect(typeof resultSet1.offset).toEqual("number");
                    expect(resultSet1.offset).toEqual(dict1.skipRows);

                });
            });

            describe("Test skipRows JSON option",function(){

                var viewRowCount_skipRows;
                var resultSet_skipRows;

                var dict_skip = {
                    "keys": [docType],
                    "skipRows":3
                }

                it("API call to query a view with skipRows param", function(done){

                    getViewDocuments(dict_skip, viewName, done);
                });

                it("Verify query result set for skipRows", function(){

                    resultSet_skipRows = JSON.parse(g_httpResponse);

                    viewRowCount_skipRows = resultSet_skipRows.rows.length;
                    expect(viewRowCount_skipRows).toEqual(documentCount - dict_skip.skipRows);

                    expect(g_httpStatus).toEqual(200);

                    resultSet_skipRows.rows.forEach(validateView);

                });

                it("Verify other fields in the resulting output JSON dictionary for skipRows",function(){

                    expect(typeof resultSet_skipRows.count).toEqual("number");

                    expect(typeof resultSet_skipRows.includesDocuments).toEqual("boolean");
                    expect(resultSet_skipRows.includesDocuments).toBe(false);

                    // test for "includeDocuments" flag
                    expect(typeof resultSet_skipRows.rows[0].doc).toEqual("undefined");

                    expect(typeof resultSet_skipRows.offset).toEqual("number");
                    expect(resultSet_skipRows.offset).toEqual(dict_skip.skipRows); // because skipRows was not provided in input

                });

            });


            describe("Input JSON has search key that does not exist",function(){

                var viewRowCount_key;
                var resultSet_key;

                var dict_key = {
                    "keys": [docType, "not_there"]
                }


                it("API call to query a view", function(done){

                    getViewDocuments(dict_key, viewName, done);
                });

                it("Verify query result set for JSON with key not found ", function(){

                    resultSet_key = JSON.parse(g_httpResponse);

                    viewRowCount_key = resultSet_key.rows.length;
                    expect(viewRowCount_key).toEqual(documentCount);

                    expect(g_httpStatus).toEqual(200);

                    resultSet_key.rows.forEach(validateView);

                });

                it("Verify other fields in the resulting output JSON dictionary",function(){

                    expect(typeof resultSet_key.count).toEqual("number");

                    expect(typeof resultSet_key.includesDocuments).toEqual("boolean");
                    expect(resultSet_key.includesDocuments).toBe(false);

                    // test for "includeDocuments" flag
                    expect(typeof resultSet_key.rows[0].doc).toEqual("undefined");

                    expect(typeof resultSet_key.offset).toEqual("number");
                    expect(resultSet_key.offset).toEqual(0); // because skipRows was not provided in input

                });

            });

            describe("Input JSON has multiple search keys",function(){

                var viewRowCount_keys;
                var resultSet_keys;

                var dict_key = {
                    "keys": [docType, docType1]
                }


                it("API call to query a view", function(done){

                    getViewDocuments(dict_key, viewName, done);
                });

                it("Verify query result set for JSON with multiple keys", function(){

                    resultSet_keys = JSON.parse(g_httpResponse);

                    viewRowCount_keys = resultSet_keys.rows.length;
                    expect(viewRowCount_keys).toEqual(dataJSON.docs.length);

                    expect(g_httpStatus).toEqual(200);

                    resultSet_keys.rows.forEach(validateView2);

                });

                it("Verify other fields in the resulting output JSON dictionary for multiple key input",function(){

                    expect(typeof resultSet_keys.count).toEqual("number");

                    expect(typeof resultSet_keys.includesDocuments).toEqual("boolean");
                    expect(resultSet_keys.includesDocuments).toBe(false);

                    // test for "includeDocuments" flag
                    expect(typeof resultSet_keys.rows[0].doc).toEqual("undefined");

                    expect(typeof resultSet_keys.offset).toEqual("number");
                    expect(resultSet_keys.offset).toEqual(0); // because skipRows was not provided in input

                });

            });


        });

        describe("Bad requests",function(){

            it("Issue API when {view} path component specified does not exist",function(done){

                getViewDocuments({"keys": [docType]}, "no_view", done);
            });

            it("Verify returned 404 status If the {view} path component specified does not exist (DE53052 Android)",function(){

                expect(g_httpStatus).toEqual(404, "Status is not 404");
            });

            it("If no {view} path component is in the URL, then a 400, bad request is returned",function(done){

                getViewDocuments({"keys": [docType]}, "", done);
            });

            it("Verify returned 400 status for incomplete API call (DE50284 Android)",function(){

                expect(g_httpStatus).toEqual(400, "400 bad request should be returned");
            });

            it("No JSON dictionary is POSTed, or the JSON dictionary cannot be parsed",function(done){

                getViewDocuments({}, viewName, done);
            });

            it("Verify the results will be the entire data set for the view",function(){

                var res = JSON.parse(g_httpResponse);
                expect(res.rows.length).toBeGreaterThan(dataJSON.docs.length);
            });

        });


        describe("Input JSON with script and notificationName fields",function(){

            var resultSet_notifications;
            var doc_to_modify = null;

            var dict_notify = {
                "keys": [docType1],
                "includeDocuments": true,
                "script": "myQueryMonitorScript",
                "notificationName": notification
            }

            var dict_notify_1 = {
                "keys": [docType1],
                "includeDocuments": true,
                "script": "myQueryMonitorScript1",
                "notificationName": notification1
            }


            describe("Register 2 notifications",function(){

                it("API call to query a view #1 with notification #1", function(done){

                    getViewDocuments(dict_notify,viewName,done);
                });

                it("API call to query a view #2 with notification #2", function(done){

                    getViewDocuments(dict_notify_1,viewName,done);
                });


                it("Modify one of the documents that belongs to view #1 and view #2",function(done){

                    resultSet_notifications = JSON.parse(g_httpResponse);
                    doc_to_modify = resultSet_notifications.rows[0].id;

                    var inputDic = {
                                        "type": docType1,
                                        "category": docCategory1,
                                        "newField": "someValue"
                                    };

                    modifyDocumentPUT(doc_to_modify,inputDic,done);
                });

                it("Verify notification script called after view #1 was modified",function(done){

                    expect(g_httpStatus).toEqual(200);

                    poll(
                        function() {

                            return (typeof notificationScriptData === "object");
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

                it("Verify 2 notifications were fired (DE50171 Android)",function(){

                    expect(typeof notificationScriptData.rows.length).toEqual("number");
                    expect(typeof notificationScriptData1.rows.length).toEqual("number");
                });

                it("Get list of registered notification listeners",function(done){

                    getNotifcationListener(done);
                });

                it("Read notification listeners",function(){

                    var res = JSON.parse(g_httpResponse);
                    expect(res[notification]).toEqual("myQueryMonitorScript");
                    expect(res[notification1]).toEqual("myQueryMonitorScript1");
                });
            });


            describe("Delete notifications",function(){

                beforeAll(function(done) {

                    // reset
                    notificationScriptData = undefined;
                    notificationScriptData1 = undefined;
                    done();
                });

                it("Delete notification #1 to stop monitoring view #1",function(done){

                    deleteViewNotification(done, notification);
                });

                it("Verify delete call success (DE50162 Android)", function () {

                    expect(g_httpStatus).toEqual(200);
                });

                it("Modify one of the documents that belongs to view #1 and view #2 after one notification deleted",function(done){

                    expect(notificationScriptData).not.toBeDefined();
                    expect(notificationScriptData1).not.toBeDefined();

                    var inputDic = {
                        "type": docType1,
                        "category": docCategory1,
                        "newField": "someValue"
                    };

                    modifyDocumentPUT(doc_to_modify,inputDic,done);
                });

                it("Verify notification script #2 still active after doc in view #2 was modified",function(done){

                    expect(g_httpStatus).toEqual(200);

                    poll(
                        function() {

                            console.log("Polling for notificationScriptData1: "+notificationScriptData1);
                            return (typeof notificationScriptData1 === "object");
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

                it("Verify notification script #1 was not called (DE53094 Android)",function(){

                    expect(notificationScriptData).not.toBeDefined();
                    expect(notificationScriptData1).toBeDefined();

                    expect(typeof notificationScriptData1.rows.length).toEqual("number");

                });

                it("Get active notifications",function(done){

                    getNotifcationListener(done);
                });

                it("Verify deleted notification not listed (DE53094 Android)",function(){

                    var res = JSON.parse(g_httpResponse);
                    expect(typeof res[notification]).toEqual(undefined, "DE39615 IOS");
                    expect(res[notification1]).toEqual("myQueryMonitorScript1");
                });

                it("Delete all notification created for this view",function(done){

                    // reset
                    notificationScriptData = undefined;
                    notificationScriptData1 = undefined;

                    deleteViewNotification(done,"");
                });

                it("Modify one of the documents after all notifications deleted",function(done){

                    expect(notificationScriptData).not.toBeDefined();
                    expect(notificationScriptData1).not.toBeDefined();

                    var inputDic = {
                        "type": docType1,
                        "category": docCategory1,
                        "newField": "someValue"
                    };

                    modifyDocumentPUT(doc_to_modify,inputDic,done);
                });


                it("Verify notification scripts were not called",function(){

                    expect(notificationScriptData).not.toBeDefined();
                    expect(notificationScriptData1).not.toBeDefined();
                });

                it("Get active notifications after all notifications were deleted",function(done){

                    getNotifcationListener(done);
                });

                it("Verify no deleted notification listed",function(){

                    var res = JSON.parse(g_httpResponse);
                    expect(typeof res[notification]).toEqual(undefined, "DE39615 IOS");
                    expect(typeof res[notification1]).toEqual(undefined, "DE39615 IOS");
                });

            });

        });

    });

})();