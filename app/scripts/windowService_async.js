/**
 * Created by 204071207 on 12/16/15.
 */


var windowService_async = windowService_async || {};
windowService_async.subns = (function() {

    var spinnerLongMessage = constructStringOfLen(100, "XYZ");

    function setSpinner(data,callback){

        if(typeof data !== 'undefined')
            data = "?"+data;
        else
            data = "";

        var spinnerParam = encodeURI(windowService+"spinner"+data);

        console.log("Calling setSpinner(): "+spinnerParam);

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":spinnerParam
            },callback
        );
    };


    function getSpinner(callback){

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":windowService+"spinner"
            },callback
        );
    };

    describe('Window management service. Manages the display of webapps within the system (windowService_async.js)::',function(){

        it('Turn spinner on without providing optional parameters', function(done){

            var temp; //undefined
            setSpinner(temp,done);

        });

        it('Verify Turning spinner returned 200 status', function(){

            expect(g_httpStatus).toEqual(200);

        });

        it("Request spinner status",function(done){

            getSpinner(done);

        });

        it("Verify spinner state is set to 'on'", function(){

            var obj = JSON.parse(g_httpResponse);
            expect(obj.state).toEqual("on");

        });


        it('Turn spinner on with message displayed', function (done) {

            setSpinner("state=on&msg=Loading Data",done);

        });


        it('Verify Turning spinner on with message displayed call returned 200 status and request spinner properties', function (done) {

            expect(g_httpStatus).toEqual(200);
            getSpinner(done);

        });

        it("Verify spinner properties have message in there and turn spinner off (DE53335 PMJ)", function (done) {

            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual("Loading Data");
            expect(obj.state).toEqual("on");

            setSpinner("state=off", done);

        });

        it('Verify turn of spinner returned 200 status and get spinner properties', function (done) {

            expect(g_httpStatus).toEqual(200);
            getSpinner(done);

        });


        it('Verify spinner state is set to off and turn it on',function(done){

            expect(g_httpStatus).toEqual(200);
            var obj = JSON.parse(g_httpResponse);
            expect(obj.state).toEqual("off");

            setSpinner("state=on", done);

        });

        it('Verify 200 status and fetch spinner status', function(done){

            expect(g_httpStatus).toEqual(200);
            getSpinner(done);

        });

        it('Expect spinner status to be on', function(){

            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual("");
            expect(obj.state).toEqual("on");

        });

        it('Add the message', function(done){

            setSpinner("state=on&msg=Message Added",done);

        });


        it("Verify status 200 and fetch spinner properties", function(done){

            expect(g_httpStatus).toEqual(200);
            getSpinner(done);

        });

        it('Verify spinner message and status after adding message', function(){

            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual("Message Added");
            expect(obj.state).toEqual("on");

        });


        it('Turn spinner on wiht long message displayed', function (done) {

            setSpinner("state=on&msg="+spinnerLongMessage, done);

        });

        it("Verify status 200 and get spinner properties",function(done){

            expect(g_httpStatus).toEqual(200);

            getSpinner(done);

        });

        it("Verify spinner long message and status",function(){

            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual(spinnerLongMessage);
            expect(obj.state).toEqual("on");

        });

        it('POST spinner call with invalid optional parameters', function(done){

            setSpinner("invalid_parameter",done);

        });

        it('POST-ing spinner call with invalid optional parameters should not give error', function(){

            expect(g_httpStatus).toEqual(200);

        });

        afterAll(function(done) {

            setSpinner("state=off",done);
        });

    });

})();
