/**

 US62980
 https://rally1.rallydev.com/#/33932456357u/detail/userstory/46177019293

 */

var loggingServiceTest = loggingServiceTest || {};
loggingServiceTest.subns = (function() {

    var data_trace = {
        "level": "trace",
        "log": "This is message for trace"
    };

    var data_debug = {
        "level": "debug",
        "log": "This is message for debug"
    };

    var data_info = {
        "level": "info",
        "log": "This is message for info"
    };

    var data_warn = {
        "level": "warn",
        "log": "This is message for warning"
    };

    var data_error = {
        "level": "error",
        "log": "This is message for error"
    };

    var data_fatal = {
        "level": "fatal",
        "log": "This is message for fatal"
    };





    function logTextToLoggingSystem(data) {

        _setUpHttpRequest(
            {
                "method":"PUT"
                ,"url":loggingService
                ,"data":data
                ,"json":isJson(data)
            }
        );
    };


    describe('Log text to the logging system (logginService.js)::', function() {

        describe('Logging service sends messages to logging system::', function() {

            it("Add requiest to send message when Logging level set to various logging levels", function () {

                logTextToLoggingSystem(data_trace);
                expect(g_httpStatus).toEqual(201);

                logTextToLoggingSystem(data_debug);
                expect(g_httpStatus).toEqual(201);

                logTextToLoggingSystem(data_info);
                expect(g_httpStatus).toEqual(201);

                logTextToLoggingSystem(data_warn);
                expect(g_httpStatus).toEqual(201);

                logTextToLoggingSystem(data_error);
                expect(g_httpStatus).toEqual(201);

                logTextToLoggingSystem(data_fatal);
                expect(g_httpStatus).toEqual(201);

            });
        });

    });

})();
