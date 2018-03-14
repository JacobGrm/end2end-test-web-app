/**
 * Created by 204071207 on 12/16/15.
 */


var windowServiceSpinnerSpecialChars_async = windowServiceSpinnerSpecialChars_async || {};
windowServiceSpinnerSpecialChars_async.subns = (function() {

    var spinnerMessageSpecialChars = constructStringOfLen(1,"xx%yy");


    function setSpinner(data,callback){

        if(typeof data !== 'undefined')
            data = "?"+data;
        else
            data = "";

        var spinnerParam = windowService+"spinner"+data;

        console.log("CALLING setSpinner(): "+spinnerParam);

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

    describe("Turn spinner on with message containing special chars (windowServiceSpinnerSpecialChars_async.js)::",function(){

        it('Turn spinner on wiht long message containing special char', function (done) {

            setSpinner("state=on&msg="+encodeURI(spinnerMessageSpecialChars),done);

        });

        it("Verify 200 status and get spinner properties",function(done){

            expect(g_httpStatus).toEqual(200);
            getSpinner(done);
        });

        it("Verify spinner properties after Turning spinner on wiht long message containing special char (DE53335 PMJ)", function () {

            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual(spinnerMessageSpecialChars);
            expect(obj.state).toEqual("on");
        });

        afterAll(function(done) {

            setSpinner("state=off",done);
        });

    });


})();
