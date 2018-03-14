/**
 * Created by 204071207 on 12/14/15.
 */



var _localNotifications_async = _localNotifications_async || {};
_localNotifications_async.subns = (function() {

    var targetLocalNotification;
    var localNotificationId;

    function localNotificationScript(data){

        console.log('LOCAL NOTIFICATION CALLED: '+new Date());
        targetLocalNotification = "Modified by Local Notification";
    };


    function createLocalNotification(milisec, callback){

        var d = new Date();
        d.setSeconds(d.getSeconds()+milisec);
        var n = d.toISOString();

        var data = {

            "script" : "localNotificationScript",
            "date": n,
            "prompt" : "Time is up",
            "additional" : "value"
        };


        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":notifyServiceLocal
                ,"data":data
                ,"json":isJson(data)
            }, callback
        );

    };

    function getLocalNotifcations(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":notifyServiceLocal
            },callback
        );
    };


    function deleteLocalNotification(notificationId, callback) {

        if(typeof notificationId === 'undefined')
            notificationId = "";
        else
            notificationId = "/"+notificationId;

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                ,"url":notifyServiceLocal+notificationId
            },callback
        );
    };


    describe('Notify Service Allows subscription to and unsubscription to Local Notifications(localNotifications_async.js)::',function(){

        describe('Register local notification::',function(){

            beforeAll(function(done) {

                resetGlobalVar();
                createLocalNotification(1,done);
            });

            it('Verify status after local notification created (DE53504 PMJ)',function(){

                expect(g_httpStatus).toEqual(201);

            });

        });


        describe('Get all registered local notifications::',function(){

            beforeAll(function(done) {

                resetGlobalVar();
                createLocalNotification(5,done);
            });

            it('Send a request to read local notifications', function(done){

                expect(typeof localNotificationId).toEqual("undefined");
                getLocalNotifcations(done);

            });

            it('Get an array of dictionaries for all registered notifications for the app (DE16381 Android, DE50532 Android)',function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj.length).toBeGreaterThan(0, "Bad response ");
                localNotificationId = obj[0].notificationId;
                expect(typeof localNotificationId).toEqual("string");

            });

        });

        describe('Delete specified notificationId local notification::',function() {

            beforeAll(function (done) {

                resetGlobalVar();
                createLocalNotification(5, done);
            });

            it('Send a request to read all local notifications', function(done){

                expect(g_httpStatus).toEqual(201);
                getLocalNotifcations(done);

            });

            it('Read last created notification id (DE16381 Android, DE50532 Android)', function(){

                var obj = JSON.parse(g_httpResponse);
                localNotificationId = obj[obj.length-1].notificationId; //last created
                expect(typeof localNotificationId).toEqual("string");
            });

            it('Delete specific local notification (DE22632 Android)', function(done){

                deleteLocalNotification(localNotificationId, done);
            });

            it('Verify specific local notification was deleted', function(){

                expect(g_httpStatus).toEqual(200, "DE22632 Android");
                expect(g_httpResponse.indexOf(localNotificationId)).toEqual(-1);
            });

        });

        describe('Delete Delete all local notifications for this app', function(){

            var numberOfLocalNotifications;

            beforeAll(function (done) {

                numberOfLocalNotifications = 5;
                for(var i=0; i<numberOfLocalNotifications; i++) {

                    console.log("Count: "+i);
                    createLocalNotification(5);
                }
                getLocalNotifcations(done);
            });

            it('Verify existing registered local notifications (DE16381 Android)', function(){

                var obj = JSON.parse(g_httpResponse);
                var test = (obj.length >= numberOfLocalNotifications);
                expect(test).toEqual(true);
            });

            it('Delete all local notifications', function(done){

                deleteLocalNotification();
                expect(g_httpStatus).toEqual(200);
                getLocalNotifcations(done);
            });

            it("Poll for conditions", function(done){

                poll(
                    function() {

                        var obj = JSON.parse(g_httpResponse);
                        return obj.length == 0;
                    },
                    function() {
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                    },
                    jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                    1000   //interval
                );

            });

            it('Verify all notification deleted (DE16381 Android)', function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj.length).toEqual(0);
            });


        });

    });

})();







