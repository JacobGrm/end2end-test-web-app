/**
 * Created by 204071207 on 12/7/15.
 */


var targetNotificationObject1;
var targetNotificationObject2;
var targetNotificationObject3;

var targetStaticParam;
var targetNotificationName;
var targetNotificationName1;

var reachabilityData;


function dbDownloadNotificationProcessor(data){

    console.log("Calling dbDownloadNotificationProcessor with data: "+data);
    targetNotificationObject1 = data;
};

function dbDownloadNotificationProcessor_staticParam(data, param){


    targetStaticParam = param;
    targetNotificationObject2=data;
};

function dbDownloadNotificationProcessor_notificationName(data, name){

    targetNotificationName = name;
    targetNotificationObject3=data;

};

function dbDownloadNotificationProcessor_notificationNameOnly(name){

    targetNotificationName1 = name;
};


/**** In order to see it called WIFI should be dropped manually ****/
function reachabilityNotificationProcessor(data){

    reachabilityData=data;
    console.log("Reachablitliy callback: ", data)
};

var notifyService_async = notifyService_async || {};
notifyService_async.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();

    var param_value = "qa_value_" + generateUniqueId();


    function _helperCreateNotificationListener(notificationName, scriptValue, callback){

        var data = {

            "script":scriptValue
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

    function createNotificationDbDownloadListener(callback){

        _helperCreateNotificationListener(DATABASE_DOWNLOAD_NOTIFICATION, "dbDownloadNotificationProcessor", callback);

    };


    function createNotificationDbDownloadListener_staticParameter(callback){

        _helperCreateNotificationListener(DATABASE_DOWNLOAD_NOTIFICATION, "dbDownloadNotificationProcessor_staticParam({},'"+param_value+"');", callback);

    };

    function createNotificationDbDownloadListener_notificationName(callback){

        _helperCreateNotificationListener(DATABASE_DOWNLOAD_NOTIFICATION, "dbDownloadNotificationProcessor_notificationName({},{notificationName});", callback);

    };


    function createNotificationDbDownloadListener_notificationNameOnly(callback){

        _helperCreateNotificationListener(DATABASE_DOWNLOAD_NOTIFICATION, "dbDownloadNotificationProcessor_notificationNameOnly({notificationName});", callback);

    };



    function createNotificationReachabilityWatcherListener(callback){

        _helperCreateNotificationListener(REACHABILITY_WATCHER_NOTIFICATION, "reachabilityNotificationProcessor", callback);

    };


    function getNotifcationListener(name, callback) {

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


    function unsubscribeNotifcationListener(name, callback) {

        if(typeof name === 'undefined')
            name = "";
        else
            name = "/"+name;

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                ,"url":notifyService+"events"+name
            },callback
        );
    };


    describe('Subscribe to and unsubscribe from SDK posted Notifications (notifyService_async.js)::',function(){


        describe('Notification Listener registered without parameters passed::', function() {

            beforeAll(function(done) {

                createNotificationDbDownloadListener(done);
            });

            it('Verify notification listener created successfully', function () {

                expect(g_httpStatus).toEqual(201);
                expect(typeof targetNotificationObject1).toEqual("undefined");
            });

            it('Create document to trigger db download notification', function (done) {

                var data = {
                    "key1": "value1",
                    "key2": "value2"
                };

                createCbDocumentAsync(docId, data, done);
            });

            it('Creating document should trigger notification', function (done) {


                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        console.log("Polling for targetNotificationObject1: "+ targetNotificationObject1);
                        return typeof targetNotificationObject1 != "undefined";
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

            it("Verify notificatin was triggered", function(){

                expect(targetNotificationObject1.completedChangesCount).not.toBeUndefined();
            });

            it('Verify notification event was processed', function () {

                expect(targetNotificationObject1.completedChangesCount).not.toEqual("undefined");
                expect(targetNotificationObject1.currentStatus).not.toEqual("undefined");
                expect(targetNotificationObject1.totalChangesCount).not.toEqual("undefined");
                expect(targetNotificationObject1.type).not.toEqual("undefined");
            });

        });


        describe('Notification Listener with static parameter passed::', function() {

            beforeAll(function(done) {

                createNotificationDbDownloadListener_staticParameter(done);
            });

            it('static parameter: Verify notification listener created successfully', function () {

                expect(g_httpStatus).toEqual(201);
                expect(typeof targetStaticParam).toEqual("undefined");
            });

            it('static parameter: Create document to trigger db download notification', function (done) {

                docId = "qa_doc_" + generateUniqueId();
                var data = {
                    "key1": "value1",
                    "key2": "value2"
                };

                createCbDocumentAsync(docId, data, done);
            });

            it('static parameter: Creating document should trigger notification', function (done) {


                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        return targetStaticParam === param_value;
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

            it("Verify notification listener with static parameter was called",function(){

                expect(targetStaticParam).toEqual(param_value);

            });

            it('Verify notification event with static parameter was processed', function () {

                expect(targetStaticParam).toEqual(param_value);

                expect(targetNotificationObject2.completedChangesCount).not.toEqual("undefined");
                expect(targetNotificationObject2.currentStatus).not.toEqual("undefined");
                expect(targetNotificationObject2.totalChangesCount).not.toEqual("undefined");
                expect(targetNotificationObject2.type).not.toEqual("undefined");
            });

        });

        describe('Notification Listener with notification name parameter passed::', function() {

            beforeAll(function(done) {

                createNotificationDbDownloadListener_notificationName(done);
            });

            it('Notification name parameter: Verify notification listener created successfully', function () {

                expect(g_httpStatus).toEqual(201);
                expect(typeof targetNotificationName).toEqual("undefined");
            });

            it('Notification name parameter: Create document to trigger db download notification', function (done) {

                docId = "qa_doc_" + generateUniqueId();
                var data = {
                    "key1": "value1",
                    "key2": "value2"
                };

                createCbDocumentAsync(docId, data, done);
            });

            it('Notification name parameter: Creating document should trigger notification',function(done){


                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        return targetNotificationName === DATABASE_DOWNLOAD_NOTIFICATION;
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

            it("Verify notification triggred", function(){

                expect(targetNotificationName).toEqual(DATABASE_DOWNLOAD_NOTIFICATION);

            });

            it('Verify notification event with notification name parameter was processed',function(){

                expect(targetNotificationName).toEqual(DATABASE_DOWNLOAD_NOTIFICATION);

                expect(targetNotificationObject3.completedChangesCount).not.toEqual("undefined");
                expect(targetNotificationObject3.currentStatus).not.toEqual("undefined");
                expect(targetNotificationObject3.totalChangesCount).not.toEqual("undefined");
                expect(targetNotificationObject3.type).not.toEqual("undefined");
            });

        });


        describe('Notification Listener with notification name only::', function() {

            beforeAll(function(done) {

                createNotificationDbDownloadListener_notificationNameOnly(done);
            });

            it('Notification name only: Verify notification listener created successfully', function () {

                expect(g_httpStatus).toEqual(201);
                expect(typeof targetNotificationName1).toEqual("undefined");
            });

            it('Notification name only: Create document to trigger db download notification', function (done) {

                docId = "qa_doc_" + generateUniqueId();
                var data = {
                    "key1": "value1",
                    "key2": "value2"
                };

                createCbDocumentAsync(docId, data, done);
            });

            it('Notification name only: Creating document should trigger notification',function(done){

                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        return targetNotificationName1 === DATABASE_DOWNLOAD_NOTIFICATION;
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

            it('Verify notification event with notification name parameter was processed',function(){

                expect(targetNotificationName1).toEqual(DATABASE_DOWNLOAD_NOTIFICATION);

            });

        });

        describe('Notification Listener Handling::', function() {


            it('Requiest Not subcribed notification', function (done) {

                getNotifcationListener("NOTIFICATION_NOT_THERE", done);
            });

            it('Not subcribed notification returns status code 404', function () {

                expect(g_httpStatus).toEqual(404);
            });

            it('Create notification 1', function (done) {

                createNotificationDbDownloadListener(done);
            });

            it('Create notification 2', function (done) {

                createNotificationReachabilityWatcherListener(done);
            });

            it('Request notification 1', function (done) {

                getNotifcationListener(DATABASE_DOWNLOAD_NOTIFICATION, done);
            });

            it('For subscribed notification GET status code will be 200', function () {

                expect(g_httpStatus).toEqual(200);
            });

            it('Request notification 2', function (done) {

                getNotifcationListener(REACHABILITY_WATCHER_NOTIFICATION, done);
            });

            it('For subscribed notification GET status code will be 200', function () {

                expect(g_httpStatus).toEqual(200);
            });

            it('Get all currently subscribed notifications', function (done) {

                // get them all
                getNotifcationListener("", done);
            });

            it('Data JSON dictionary for all currently subscribed notifications. ' +
                'The key of the dictionary will be the notification names, the values will be the ' +
                'javascript function called', function () {


                expect(g_httpStatus).toEqual(200);

                expect(g_httpResponse.indexOf(DATABASE_DOWNLOAD_NOTIFICATION)).not.toEqual(-1);
                expect(g_httpResponse.indexOf(REACHABILITY_WATCHER_NOTIFICATION)).not.toEqual(-1);

                expect(g_httpResponse.indexOf("dbDownloadNotificationProcessor")).not.toEqual(-1);
                expect(g_httpResponse.indexOf("reachabilityNotificationProcessor")).not.toEqual(-1);

            });

            it('Unsubscribe from specific notification', function (done) {

                unsubscribeNotifcationListener(DATABASE_DOWNLOAD_NOTIFICATION, done);
            });

            it('Requist for unsubscribed notification', function (done) {

                getNotifcationListener(DATABASE_DOWNLOAD_NOTIFICATION, done);
            });

            it('Requist for unsubscribed notification should return 404 status', function () {

                expect(g_httpStatus).toEqual(404);
            });

            it('Request notification to make sure its there before unsubcribe all', function (done) {

                getNotifcationListener(REACHABILITY_WATCHER_NOTIFICATION, done);
            });

            it('Verify notification is there', function () {

                expect(g_httpStatus).toEqual(200);
            });

            it('Unsubscribe from all currently subscribed notifications',function(done){

                unsubscribeNotifcationListener("", done);
            });

            it('Attempt to request one of subscribed notifications',function(done){

                getNotifcationListener(REACHABILITY_WATCHER_NOTIFICATION, done);
            });

            it('Verify notification is not found (unsubcribed)', function(){

                expect(g_httpStatus).toEqual(404);
            });

        });

    });

})();


