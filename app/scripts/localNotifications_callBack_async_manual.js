/**
 * Created by 204071207 on 12/14/15.
 */

// Docs -> https://github.com/PredixDev/PredixMobileSDK/wiki/Notify#local-notifications


/*

    !!!! Usage -> After executing script, in order for alert to pop up, move app to the background !!!!!!

 */


    function createLocalNotification_prompt(sec, callback){

        var current = Date.now();
        var d = new Date(current);
        d.setSeconds(d.getSeconds()+sec);
        var n = d.toISOString();

        var inputData = {

            "date": n,
            "prompt" : "Reminder!"
        };


        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":notifyServiceLocal
                ,"data":inputData
                ,"json":isJson(inputData)
            },callback
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


    describe('Notify Service: Local notifications - verify script set with notification called(localNotifications_callBack_async_manual.js)::',function(){


        it('Create local notification',function(done){

            createLocalNotification_prompt(25,done);
        });

        it('Verify notification created with status 201',function() {

            expect(g_httpStatus).toEqual(201);
        });

        it('Send a request to read local notifications', function(done){

            getLocalNotifcations(done);

        });

        it('Get an array of dictionaries for all registered notifications for the app (DE16381 Android)',function(){

            var obj = JSON.parse(g_httpResponse);
            var localNotificationId = obj[0].notificationId;
            expect(typeof localNotificationId).toEqual("string");

        });


    });






