/**
 * Created by 204071207 on 12/16/15.
 */


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

    describe('Show error dialog::',function(){

        it('Default message will be shown if no optionl parameters provied',function(){

            showSeriousErrorPage();
        });

        it("Alert dialog displaying the message 'A truly horrible, unrecoverable error occurred'. " +
            "When the user taps the button, the system will re-initialize the boot service.",function(){

            showSeriousErrorPage("e=A+truly+horrible%2C+unrecoverable+error+occurred");
        });

        it("alert dialog displaying the message 'An error occurred'. When the user taps the button, " +
            "the system will POST to the Window service to load the webapp 'myerrorapp'",function(){

            showSeriousErrorPage("e=An+error+occurred&route=window%2Fpane%3Fwebapp%3Dmyerrorapp&method=POST");
        });

    });

});