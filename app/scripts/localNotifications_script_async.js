/**
 * Created by 204071207 on 12/14/15.
 */

// Docs -> https://github.com/PredixDev/PredixMobileSDK/wiki/Notify#local-notifications

var myPrompt;
var myScriptName;
var myDate;
var myNotificationId;

function myLocalNotificationScript(dictionary){

    myPrompt = dictionary.prompt;
    myScriptName = dictionary.script;
    myNotificationId = dictionary.notificationId;
    myDate = dictionary.date;
};

var localNotification_script = localNotification_script || {};
localNotification_script.subns = (function() {

    function createLocalNotification_prompt(sec, callback){

        var current = Date.now();
        var d = new Date(current);
        d.setSeconds(d.getSeconds()+sec);
        var n = d.toISOString();

        var inputData = {

            "date": n,
            "prompt" : "Reminder!",
            "script" : "myLocalNotificationScript"
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


    describe('Notify Service: Local notifications - verify notification fired(localNotifications_script_async.js)::',function(){


        it('Create local notification',function(done){

            createLocalNotification_prompt(2,done);
        });

        it('Verify notification created with status 201',function(done) {

            expect(g_httpStatus).toEqual(201);

            poll(
                function() {

                    return typeof myPrompt != "undefined";
                },
                function() {
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Polling error....");
                    done();
                },
                30000, //timeout
                1000   //interval
            );
        });

        it("Verify notification was fired and script params are valid (DE22470 Electron, DE22648 Android)", function(){

            expect(myPrompt).toEqual("Reminder!", "myPrompt field not set. Nofification was not fired");
            expect(myScriptName).toEqual("myLocalNotificationScript", "myScriptName field not set. Nofification was not fired");
            expect(typeof myDate).not.toEqual("undefined", "myDate field not set. Nofification was not fired");

            // An additional element notificationId will be added to the payload dictionary
            expect(typeof myNotificationId).not.toEqual("undefined", "notificationId field not set. Nofification was not fired");
        })

    });

})();




