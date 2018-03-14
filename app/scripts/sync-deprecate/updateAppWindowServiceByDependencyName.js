/**
 * Created by 204071207 on 12/16/15.
 */


describe('Window management service. Manages the display of webapps within the system (updateAppWindowService.js)::',function(){

    describe('Extracts appname web app from local Couchbase database::',function(){

        it('Displays another webapp in main view pane, using the version independent webapp name', function(){

           logWrite({
               "level": "info",
               "log": "Started loading replacement app using webapp name: "+ new Date()
           });

           displayWebApp(REPLACEMENT_WEBAPP_NAME);
        });

    });

});
