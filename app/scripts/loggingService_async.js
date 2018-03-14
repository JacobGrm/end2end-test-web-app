/**

 US62980
 https://rally1.rallydev.com/#/33932456357u/detail/userstory/46177019293

 */

var loggingService_async = loggingService_async || {};
loggingService_async.subns = (function() {

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





    function logTextToLoggingSystem(data, callback) {

        _setUpHttpRequestAsync(
            {
                "method":"PUT"
                ,"url":loggingService
                ,"data":data
                ,"json":isJson(data)
            },callback
        );
    };


    describe('Log text to the logging system (loggingServiceTest_async.js)::', function() {

        it("Add requiest to send message when Logging level set 'data trace' logging levels", function (done) {

            logTextToLoggingSystem(data_trace, done);
        });

        it("Verify status 201 for data_trace", function(){

            expect(g_httpStatus).toEqual(201);
        });

        it("Add requiest to send message when Logging level set 'data_debug' logging levels", function (done) {

            logTextToLoggingSystem(data_debug, done);
        });

        it("Verify status 201 for data_debug", function(){

            expect(g_httpStatus).toEqual(201);
        });

        it("Add requiest to send message when Logging level set 'data_info' logging levels", function (done) {

            logTextToLoggingSystem(data_info, done);
        });

        it("Verify status 201 for data_info", function(){

            expect(g_httpStatus).toEqual(201);
        });

        it("Add requiest to send message when Logging level set 'data_warn' logging levels", function (done) {

            logTextToLoggingSystem(data_warn, done);
        });

        it("Verify status 201 for data_warn", function(){

            expect(g_httpStatus).toEqual(201);
        });

        it("Add requiest to send message when Logging level set 'data_error' logging levels", function (done) {

            logTextToLoggingSystem(data_error, done);
        });

        it("Verify status 201 for data_error", function(){

            expect(g_httpStatus).toEqual(201);
        });

        it("Add requiest to send message when Logging level set 'data_fatal' logging levels", function (done) {

            logTextToLoggingSystem(data_fatal, done);
        });

        it("Verify status 201 for data_fatal", function(){

            expect(g_httpStatus).toEqual(201);
        });

    });

})();
