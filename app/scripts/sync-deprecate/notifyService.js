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

var docId = "qa_doc_" + generateUniqueId();

var param_value = "qa_value_" + generateUniqueId();


function dbDownloadNotificationProcessor(data){

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

function _helperCreateNotificationListener(notificationName, scriptValue){

    var data = {

        "script":scriptValue
    };


    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":notifyService+"/events/"+notificationName
            ,"data":data
            ,"json":isJson(data)
        }
    );

};

function createNotificationDbDownloadListener(){

    _helperCreateNotificationListener(DATABASE_DOWNLOAD_NOTIFICATION, "dbDownloadNotificationProcessor");

};


function createNotificationDbDownloadListener_staticParameter(){

    _helperCreateNotificationListener(DATABASE_DOWNLOAD_NOTIFICATION, "dbDownloadNotificationProcessor_staticParam({},'"+param_value+"');");

};

function createNotificationDbDownloadListener_notificationName(){

    _helperCreateNotificationListener(DATABASE_DOWNLOAD_NOTIFICATION, "dbDownloadNotificationProcessor_notificationName({},{notificationName});");

};


function createNotificationDbDownloadListener_notificationNameOnly(){

    _helperCreateNotificationListener(DATABASE_DOWNLOAD_NOTIFICATION, "dbDownloadNotificationProcessor_notificationNameOnly({notificationName});");

};



function createNotificationReachabilityWatcherListener(){

    _helperCreateNotificationListener(REACHABILITY_WATCHER_NOTIFICATION, "reachabilityNotificationProcessor");

};


function createDocument(id) {

    var data = {
        "key1": "value1",
        "key2": "value2"
    };

    _setUpHttpRequest(

        {
            "method":"PUT"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
            ,"data":data
            ,"json":isJson(data)
        }
    );
};



function getNotifcationListener(name) {

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


function unsubscribeNotifcationListener(name) {

    if(typeof name === 'undefined')
        name = "";
    else
        name = "/"+name;

    _setUpHttpRequest(
        {
            "method":"DELETE"
            ,"url":notifyService+"events"+name
        }
    );
};


describe('Subscribe to and unsubscribe from SDK posted Notifications (notifyService.js)::',function(){


    describe('Notification Listener with registered without parameters passed::', function() {

        it('Create notification listener and trigger notification', function (done) {

            createNotificationDbDownloadListener();
            expect(g_httpStatus).toEqual(201);
            expect(typeof targetNotificationObject1).toEqual("undefined");

            createDocument(docId);
            expect(g_httpStatus).toEqual(201);

            poll(
                function() {

                    return typeof targetNotificationObject1 != "undefined";
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

        it("Verify notificatin was triggered", function(){

            expect(targetNotificationObject1.completedChangesCount).not.toEqual("undefined");

        });

        it('Verify notification event was processed', function () {

            expect(targetNotificationObject1.completedChangesCount).not.toEqual("undefined");
            expect(targetNotificationObject1.currentStatus).not.toEqual("undefined");
            expect(targetNotificationObject1.totalChangesCount).not.toEqual("undefined");
            expect(targetNotificationObject1.type).not.toEqual("undefined");
        });

    });


    describe('Notification Listener with static parameter passed::', function() {

        it('Create notification listener with static parameter and trigger notification', function (done) {

            createNotificationDbDownloadListener_staticParameter();
            expect(g_httpStatus).toEqual(201);
            expect(typeof targetStaticParam).toEqual("undefined");

            docId = "qa_doc_" + randomNumber(100, 1000);
            createDocument(docId);
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

        it('Create notification listener with notification name parameter and trigger notification',function(done){

            createNotificationDbDownloadListener_notificationName();
            expect(g_httpStatus).toEqual(201);
            expect(typeof targetNotificationName).toEqual("undefined");

            docId = "qa_doc_" + randomNumber(100,1000);
            createDocument(docId);
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

        it('Create notification listener',function(done){

            createNotificationDbDownloadListener_notificationNameOnly();
            expect(g_httpStatus).toEqual(201);
            expect(typeof targetNotificationName1).toEqual("undefined");

            docId = "qa_doc_" + randomNumber(100,1000);
            createDocument(docId);
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
                },
                10000, //timeout
                1000   //interval
            );

        });

        it('Verify notification event with notification name parameter was processed',function(){

            expect(targetNotificationName1).toEqual(DATABASE_DOWNLOAD_NOTIFICATION);

        });

    });




    it('Not subcribed notification returns status code 404',function(){

        getNotifcationListener("NOTIFICATION_NOT_THERE");
        expect(g_httpStatus).toEqual(404);

    });

    it('For subscribed notification GET status code will be 200', function(){

        createNotificationDbDownloadListener();
        expect(g_httpStatus).toEqual(201);

        createNotificationReachabilityWatcherListener();
        expect(g_httpStatus).toEqual(201);

        getNotifcationListener(DATABASE_DOWNLOAD_NOTIFICATION);
        expect(g_httpStatus).toEqual(200);
        //expect(g_httpResponse.indexOf(DATABASE_DOWNLOAD_NOTIFICATION)).not.toEqual(-1);

        getNotifcationListener(REACHABILITY_WATCHER_NOTIFICATION);
        expect(g_httpStatus).toEqual(200);
        //expect(g_httpResponse.indexOf(REACHABILITY_WATCHER_NOTIFICATION)).not.toEqual(-1);

    });

    it('Data JSON dictionary for all currently subscribed notifications. ' +
        'The key of the dictionary will be the notification names, the values will be the ' +
        'javascript function called',function(){


        // get them all
        getNotifcationListener();
        expect(g_httpStatus).toEqual(200);

        expect(g_httpResponse.indexOf(DATABASE_DOWNLOAD_NOTIFICATION)).not.toEqual(-1);
        expect(g_httpResponse.indexOf(REACHABILITY_WATCHER_NOTIFICATION)).not.toEqual(-1);

        expect(g_httpResponse.indexOf("dbDownloadNotificationProcessor")).not.toEqual(-1);
        expect(g_httpResponse.indexOf("reachabilityNotificationProcessor")).not.toEqual(-1);

    });

    it('Unsubscribe from specific notification',function(){

        unsubscribeNotifcationListener(DATABASE_DOWNLOAD_NOTIFICATION);

        getNotifcationListener(DATABASE_DOWNLOAD_NOTIFICATION);
        expect(g_httpStatus).toEqual(404);

    });

    it('Unsubscribe from all currently subscribed notifications',function(){

        getNotifcationListener(REACHABILITY_WATCHER_NOTIFICATION);
        expect(g_httpStatus).toEqual(200);

        unsubscribeNotifcationListener();

        getNotifcationListener(REACHABILITY_WATCHER_NOTIFICATION);
        expect(g_httpStatus).toEqual(404);

    });

});





