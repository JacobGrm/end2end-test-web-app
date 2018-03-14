/**
 * Created by 204071207 on 12/16/15.
 */


var showSeriosErrorWindowService_async = showSeriosErrorWindowService_async || {};
showSeriosErrorWindowService_async.subns = (function() {


    function showSeriousErrorPage(data,callback){

        if(typeof data !== 'undefined')
            data = "?"+data;
        else
            data = "";


        console.log("showSeriousErrorPage argument: "+data);

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":windowService+"showseriouserrorpage"+data
            },callback
        );
    };

    describe('Window management service. Manages the display of webapps within the system (showSeriosErrorWindowService_async.js)::',function(){

        describe('Show error dialog::',function(){

            //it('Default message will be shown if no optionl parameters provied',function(){
            //
            //    showSeriousErrorPage();
            //});

            it("Alert dialog displaying the message 'A truly horrible, unrecoverable error occurred'. " +
                "When the user taps the button, the system will re-initialize the boot service.",function(done){

                showSeriousErrorPage("e=A+truly+horrible%2C+unrecoverable+error+occurred",done);
            });

            it("Verify status is not en error",function(){

                expect(g_httpStatus).toEqual(201);
            });

            //it("alert dialog displaying the message 'An error occurred'. When the user taps the button, " +
            //    "the system will POST to the Window service to load the webapp 'myerrorapp'",function(){
            //
            //    showSeriousErrorPage("e=An+error+occurred&route=window%2Fpane%3Fwebapp%3Dmyerrorapp&method=POST");
            //});

        });

    });

})();
