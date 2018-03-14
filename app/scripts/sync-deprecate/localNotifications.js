/**
 * Created by 204071207 on 12/14/15.
 */



var localNotifications = localNotifications || {};
localNotifications.subns = (function() {

    var targetLocalNotification;
    var localNotificationId;

    function localNotificationScript(data){

        console.log('LOCAL NOTIFICATION CALLED: '+new Date());
        targetLocalNotification = "Modified by Local Notification";
    };


    function createLocalNotification(milisec){

        var d = new Date();
        d.setSeconds(d.getSeconds()+milisec);
        var n = d.toISOString();

        var data = {

            "script" : "localNotificationScript",
            "date": n,
            "prompt" : "Time is up",
            "additional" : "value"
        };


        _setUpHttpRequest(
            {
                "method":"POST"
                ,"url":notifyServiceLocal
                ,"data":data
                ,"json":isJson(data)
            }
        );

    };

    function getLocalNotifcations() {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":notifyServiceLocal
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
                ,"url":notifyServiceLocal+notificationId
            }
        );
    };


    describe('Notify Service Allows subscription to and unsubscription ' +
        'to Local Notifications(locaNotifications.js)::',function(){

        describe('Local notifications::',function(){

            it('Create local notification',function(){

                createLocalNotification(1);
                expect(g_httpStatus).toEqual(201);
            });

            it('User can get array of dictionaries for all registered notifications for the app',function(){

                createLocalNotification(5);
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

})();







