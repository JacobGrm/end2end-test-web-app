/**
 * Created by 204071207 on 12/16/15.
 */

// Docs: https://github.com/PredixDev/PredixMobileSDK/wiki/Window#load-web-app-by-appname

describe('Window management service. Manages the display of webapps within the system. ' +
    'Extracts web app from local Couchbase database using appname (updateAppWindowService_async.js)::',function(){

        // App name should be taken from command line tool: pm webapps
        // webapp name should be added as dependencies to app.json

    it('Load web app by appname', function(done){

       logWrite({
           "level": "info",
           "log": "Started loading replacement app using webapp name: "+ new Date()
       });

        displayWebAppAsync(REPLACEMENT_WEBAPP_NAME,done);
    });

});
