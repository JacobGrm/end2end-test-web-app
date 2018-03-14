/**
 * Created by 204071207 on 12/14/15.
 */

// Docs -> https://github.com/PredixDev/PredixMobileSDK/wiki/Notify#local-notifications

// Format 1
var notificationModified;
var callbackData;

// Format 2
var notificationModified_1;
var callbackData_1;
var callbackArg;

function localNotificationScript_alert(data){

    callbackData = data;
    notificationModified = "SET";
};


function localNotificationScript_alert_1(arg, data){

    callbackArg    = arg;
    callbackData_1 = data;
    notificationModified_1 = "SET_1";
};


var localNotifications_callBack_async = localNotifications_callBack_async || {};
localNotifications_callBack_async.subns = (function() {


    function createLocalNotification_alert(milisec, callback){

        var d = new Date();
        d.setSeconds(d.getSeconds()+milisec);
        var n = d.toISOString();

        var inputData = {

            "script" : "localNotificationScript_alert",
            "date": n,
            "prompt" : "Time is up",
            "additional" : "value123"
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



    function createLocalNotification_alert_1(milisec, callback){

        var d = new Date();
        d.setSeconds(d.getSeconds()+milisec);
        var n = d.toISOString();

        var inputData = {

            "script" : "localNotificationScript_alert_1('another_parameter', {})",
            "date" : n,
            "prompt" : "Time is up 1",
            "additional" : "value456"
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



    describe('Notify Service: Local notifications - verify script set with ' +
            'notification called(localNotifications_callBack_async.js)::',function(){


            var originalTimeout;
            beforeAll(function() {

                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
            });

        describe("Input Format 1", function(){


            it('Create local notification',function(done){

                createLocalNotification_alert(2,done);
            });


            it('Verify notification created and callback script executed',function(done){

                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        return notificationModified === "SET";
                    },
                    function() {
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                        done();
                    },
                    jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                    1000   //interval
                );
            }, IOS_ONLY+MAC_ONLY+ANDR_ONLY);

            it("Notification should invoke script with valid data DE37558 Android",function(){

                expect(notificationModified).toEqual("SET");

                expect(callbackData.script).toEqual("localNotificationScript_alert");
                expect(callbackData.prompt).toEqual("Time is up");
                expect(callbackData.additional).toEqual("value123");
                expect(typeof callbackData.date).toEqual("string", "date not found in dictionary");
                expect(typeof callbackData.notificationId).toEqual("string", "notificationId not found in dictionary DE37558 Android");

            }, IOS_ONLY+MAC_ONLY+ANDR_ONLY);

        });

        describe("Input Format 2", function(){

            it('Create local notification',function(done){

                createLocalNotification_alert_1(2,done);
            });


            it('Verify notification created and callback script executed',function(done){

                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        return notificationModified_1 === "SET_1";
                    },
                    function() {
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                        done();
                    },
                    jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                    1000   //interval
                );
            }, IOS_ONLY+MAC_ONLY+ANDR_ONLY);

            it("Notification should invoke script with valid data DE37558 Android",function(){

                expect(notificationModified_1).toEqual("SET_1");

                expect(callbackArg).toEqual("another_parameter");

                expect(callbackData_1.script).toEqual("localNotificationScript_alert_1('another_parameter', {})");
                expect(callbackData_1.prompt).toEqual("Time is up 1");
                expect(callbackData_1.additional).toEqual("value456");
                expect(typeof callbackData_1.date).toEqual("string", "date not found in dictionary");
                expect(typeof callbackData_1.notificationId).toEqual("string", "notificationId not found in dictionary. DE37558 Android");

            }, IOS_ONLY+MAC_ONLY+ANDR_ONLY);

        });

            afterAll(function() {

                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });

        });

})();





