/**
 * Created by 204071207 on 8/2/17.
 */


var lowDiskSpaceNotificationDictionary = undefined;

function lowDiskSpaceNotificationListener(data){

    console.log("CALLED lowDiskSpaceNotificationListener....");
    console.log("lowDiskSpaceNotificationListener data: ",data);

    lowDiskSpaceNotificationDictionary=data;
};

var lowDiskSpaceNotification_async = lowDiskSpaceNotification_async || {};
lowDiskSpaceNotification_async.subns = (function() {


    function _regiterNotificationListener(notificationName, scriptValue, callback){

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


    describe("Low disk space notification and Low memory notification tests(lowDiskSpaceNotification_async.js)::",function(){

        it("Make API call to register Low disk space notification listener",function(done){

            _regiterNotificationListener(DISK_SPACE_NOTIFICATION,"lowDiskSpaceNotificationListener",done);
        },ANDR_ONLY);

        it("Register listener for monitoring low disk space should returns status 201",function() {

            expect(g_httpStatus).toEqual(201, "Expect to return status 201 when registering listener");
        },ANDR_ONLY);

        it("Get all registered notification listeners",function(done){

            getRegisteredNotifcationListeners("", done);
        },ANDR_ONLY);

        it("Verify listener is listed",function(){

            expect(g_httpStatus).toEqual(200);

            var res = JSON.parse(g_httpResponse);

            expect(res[DISK_SPACE_NOTIFICATION]).toEqual("lowDiskSpaceNotificationListener");
        },ANDR_ONLY);

        it("Get specifice registered notification listener",function(done){

            getRegisteredNotifcationListeners(DISK_SPACE_NOTIFICATION, done);
        },ANDR_ONLY);

        it("Verify call for specific listener was succefull", function(){

            expect(g_httpStatus).toEqual(200);
        },ANDR_ONLY);

        it("Unsubscribe from notfication",function(done){

            unsubscribeFromNotification(DISK_SPACE_NOTIFICATION, done);
        },ANDR_ONLY);

        it("Status 200 expected when unsubscribe from notfication",function(){

            expect(g_httpStatus).toEqual(200);
        },ANDR_ONLY);

        it("Get all registered notification listeners after unsubscribing",function(done){

            getRegisteredNotifcationListeners("", done);
        },ANDR_ONLY);

        it("Verify listener is listed",function(){

            expect(g_httpStatus).toEqual(200);

            var res = JSON.parse(g_httpResponse);

            expect(res[DISK_SPACE_NOTIFICATION]).toEqual(undefined);
        },ANDR_ONLY);

        it("Get specifice registered notification listener after unsubscribing",function(done){

            getRegisteredNotifcationListeners(DISK_SPACE_NOTIFICATION, done);
        },ANDR_ONLY);

        it("Verify notification not found", function(){

            expect(g_httpStatus).toEqual(404);
        },ANDR_ONLY);

    });

})();



