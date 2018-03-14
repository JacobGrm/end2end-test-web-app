/**
 * Created by 204071207 on 12/16/15.
 */

// https://github.com/PredixDev/PredixMobileSDK/wiki/Window#load-web-app-by-appnameid

describe('Window management service. Manages the display of webapps within the system (updateAppWindowService.js)::',function(){

    describe('Extracts appname web app from local Couchbase database::',function(){

        it('Load web app by appnameID', function(done){

            logWrite({
               "level": "info",
               "log": "Started loading replacement app: "+ new Date()
            });

            displayWebAppAsync(REPLACEMENT_WEBAPP_ID,done);

       });

    });
});
