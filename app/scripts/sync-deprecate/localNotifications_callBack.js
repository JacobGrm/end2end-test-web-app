/**
 * Created by 204071207 on 12/14/15.
 */

var notificationModified;
function localNotificationScript_alert(data){

    notificationModified = "SET";
};


var localNotifications_callBack = localNotifications_callBack || {};
localNotifications_callBack.subns = (function() {

    function createLocalNotification_alert(milisec){

        var d = new Date();
        d.setSeconds(d.getSeconds()+milisec);
        var n = d.toISOString();

        var data = {

            "script" : "localNotificationScript_alert",
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

    describe('Notify Service: Local notifications - verify script set with ' +
            'notification called(locaNotifications_callBack.js)::',function(){


            var originalTimeout;
            beforeAll(function() {

                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
            });

            it('Create local notification and set alert in callback script',function(done){

                createLocalNotification_alert(1);
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
                    },
                    jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                    1000   //interval
                );
            }, IOS_ONLY);

            it("Notification should invoke script",function(){

                expect(notificationModified).toEqual("SET");
            }, IOS_ONLY);

            afterAll(function() {

                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });

        });

})();





