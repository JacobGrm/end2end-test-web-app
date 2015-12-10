/**
 * Created by 204071207 on 12/7/15.
 */

var notifyService = "http://"+API_HOST+"/notify/";

var beforeText = "Before Notification";
var afterText = "After Notification";
var target = beforeText;
var localNotificationId;

var docId = "qa_doc_" + randomNumber(100,1000);

function notificationProcessor(){

  target = afterText;
};

function notificationProcessor_1(){};

function createNotificationDbDownloadListener(){

    var data = {

        "script":"notificationProcessor"
    };


    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":notifyService+"/events/"+DATABASE_DOWNLOAD_NOTIFICATION
            ,"data":data
            ,"json":isJson(data)
        }
    );

};


function createNotificationReachabilityWatcherListener(){

    var data = {

        "script":"notificationProcessor_1"
    };


    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":notifyService+"/events/"+REACHABILITY_WATCHER_NOTIFICATION
            ,"data":data
            ,"json":isJson(data)
        }
    );

};


function createDocument(id) {

    var data = {
        "key1": "value1",
        "key2": "value2"
    };

    _setUpHttpRequest(

        {
            "method":"PUT"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL + id
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

/*

    LOCAL NOTIFICATIONS

 */

function myFunction(){

    target = "Modified by Local Notification";
};


function createLocalNotification(milisec){

    var d = new Date();
    d.setSeconds(d.getSeconds()+milisec);
    var n = ISODateString(d);

    var data = {

        "script" : "myFunction",
        "date": n,
        "prompt" : "Time is up",
        "additional" : "value"
    };


    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":notifyService+"attime"
            ,"data":data
            ,"json":isJson(data)
        }
    );

};

function getLocalNotifcations() {

    _setUpHttpRequest(
        {
            "method":"GET"
            ,"url":notifyService+"attime"
        }
    );
};


function deleteLocalNotification(notificationId) {

    if(typeof notificationId === 'undefined')
        notificationId = "";
    else
        notificationId = "/"+notificationId;

    _setUpHttpRequest(
        {
            "method":"DELETE"
            ,"url":notifyService+"attime"+notificationId
        }
    );
};


describe('Notify Service Allows subscription to and unsubscription ' +
    'from Notification Event System and Local Notifications(notifyService.js)::',function(){

    describe('Subscribe to and unsubscribe from SDK posted Notifications::',function(){

        it('Create notification listener, trigger notification and verify it was processed',function(){

            createNotificationDbDownloadListener();
            expect(g_httpStatus).toEqual(200);
            expect(target).toEqual(beforeText);

            createDocument(docId);
            for(var i=0; i<10; i++){

                if(target===afterText)
                    break;
                sleep(100);
            }

            expect(target).toEqual(afterText);
        });

        it('Not subcribed notification returns status code 404',function(){

            getNotifcationListener("NOTIFICATION_NOT_THERE");
            expect(g_httpStatus).toEqual(404);

        });

        it('For subsribed notification GET status code will be 200', function(){

            createNotificationReachabilityWatcherListener();
            expect(g_httpStatus).toEqual(200);

            getNotifcationListener(DATABASE_DOWNLOAD_NOTIFICATION);
            expect(g_httpStatus).toEqual(200);

            getNotifcationListener(REACHABILITY_WATCHER_NOTIFICATION);
            expect(g_httpStatus).toEqual(200);

        });

        it('Data JSON dictionary for all currently subscribed notifications. ' +
            'The key of the dictionary will be the notification names, the values will be the ' +
            'javascript function called',function(){


            // get them all
            getNotifcationListener();
            expect(g_httpStatus).toEqual(200);

            expect(g_httpResponse.indexOf(DATABASE_DOWNLOAD_NOTIFICATION)).not.toEqual(-1);
            expect(g_httpResponse.indexOf(REACHABILITY_WATCHER_NOTIFICATION)).not.toEqual(-1);

            expect(g_httpResponse.indexOf("notificationProcessor")).not.toEqual(-1);
            expect(g_httpResponse.indexOf("notificationProcessor_1")).not.toEqual(-1);

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


    describe('Local notifications::',function(){

        it('Create local notification (DE16709)',function(){

            createLocalNotification(6000);
            sleep(6000);
            expect(g_httpStatus).toEqual(200);
            expect(target).toEqual("Modified by Local Notification");

        });

        it('User can get array of dictionaries for all registered notifications for the app',function(){

            createLocalNotification(5); //IOS will delete expired local nofications. Have to create a fresh one
            getLocalNotifcations();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.length).toBeGreaterThan(0);
            localNotificationId = obj[0].notificationId;
            expect(typeof localNotificationId).not.toEqual("undefined");

        });

        it('Delete the specified notificationId local notification',function(){

            createLocalNotification(5);
            getLocalNotifcations();
            var obj = JSON.parse(g_httpResponse);
            localNotificationId = obj[obj.length-1].notificationId; //last created

            deleteLocalNotification(localNotificationId);
            expect(g_httpStatus).toEqual(200);
            expect(g_httpResponse.indexOf(localNotificationId)).toEqual(-1);

        });

        it('Delete all local notifications for this app',function(){

            var numberOfLocalNotifications = 2;
            for(var i=0; i<numberOfLocalNotifications; i++)
                createLocalNotification(5);

            getLocalNotifcations();
            var obj = JSON.parse(g_httpResponse);
            var test = (obj.length >= numberOfLocalNotifications);
            expect(test).toEqual(true);

            deleteLocalNotification();
            getLocalNotifcations();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.length).toEqual(0);

        });


    });

});





