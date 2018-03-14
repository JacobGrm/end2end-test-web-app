/**
 * Created by 204071207 on 12/16/15.
 */


var spinnerLongMessage = constructStringOfLen(100, "XYZ");
var spinnerMessageSpecialChars = constructStringOfLen(1,"xx%yy");


function setSpinner(data){

    if(typeof data !== 'undefined')
        data = "?"+data;
    else
        data = "";

    var spinnerParam = windowService+"spinner"+data;

    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":spinnerParam
        }
    );
};


function getSpinner(){

    _setUpHttpRequest(
        {
            "method":"GET"
            ,"url":windowService+"spinner"
        }
    );
};

function showSeriousErrorPage(data){

    if(typeof data !== 'undefined')
        data = "?"+data;
    else
        data = "";

    console.log("showSeriousErrorPage argument: "+data);

    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":windowService+"showseriouserrorpage"+data
        }
    );
};

describe('Window management service. Manages the display of webapps within the system (windowService.js)::',function(){

    describe('Native spinner Control::',function() {

        it('Turn spinner on without providing optional parameters (DE18278)', function(){

            setSpinner();
            expect(g_httpStatus).toEqual(200);

            getSpinner();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.state).toEqual("on");

            // Reset
            setSpinner("state=off");
        } );

        it('Turn spinner on wiht message displayed', function () {

            setSpinner("state=on&msg=LoadingData");
            expect(g_httpStatus).toEqual(200);

            getSpinner();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual("LoadingData");
            expect(obj.state).toEqual("on");
        } );

        it('Turn spinner off',function(){

            setSpinner("state=off");
            expect(g_httpStatus).toEqual(200);

            getSpinner();
            expect(g_httpStatus).toEqual(200);
            var obj = JSON.parse(g_httpResponse);
            expect(obj.state).toEqual("off");

        } );

        it('Turn spinner on without message diplayed', function(){

            setSpinner("state=on");
            expect(g_httpStatus).toEqual(200);

            getSpinner();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual("");
            expect(obj.state).toEqual("on");

        } );

        it('Turn spinner on without message diplayed, and then add the message', function(){

            setSpinner("state=on");
            expect(g_httpStatus).toEqual(200);

            getSpinner();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual("");
            expect(obj.state).toEqual("on");

            setSpinner("state=on&msg=Message Added");
            expect(g_httpStatus).toEqual(200);

            getSpinner();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual("Message Added");
            expect(obj.state).toEqual("on");

        } );


        it('Turn spinner on wiht long message displayed', function () {

            setSpinner("state=on&msg="+spinnerLongMessage);
            expect(g_httpStatus).toEqual(200);

            getSpinner();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual(spinnerLongMessage);
            expect(obj.state).toEqual("on");
        } );

        it('POST spinner call with invalid optional parameters is not en error', function(){

            setSpinner("invalid_parameter");
            expect(g_httpStatus).toEqual(200);

        } );

        it('Turn spinner on wiht long message containing special char (DE17403)', function () {

            setSpinner("state=on&msg="+spinnerMessageSpecialChars);
            expect(g_httpStatus).toEqual(200);

            getSpinner();
            var obj = JSON.parse(g_httpResponse);
            expect(obj.msg).toEqual(spinnerMessageSpecialChars);
            expect(obj.state).toEqual("on");
        } );

        afterAll(function() {

            setSpinner("state=off");
        });
    });

});