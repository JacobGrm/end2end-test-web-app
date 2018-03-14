/**
 * Created by 204071207 on 12/16/15.
 */


describe('Window management service. Manages the display of webapps within the system (updateAppWindowService.js)::',function(){

    describe('Extracts appname web app from local Couchbase database::',function(){

        it('Display another app in main view pane', function(){

           logWrite({
               "level": "info",
               "log": "Started loading replacement app: "+ new Date()
           });

           displayWebApp(REPLACEMENT_WEBAPP_ID);
           //expect(REPLACEMENT_APP_INITIALIZED).toEqual(true);
       });

    });

});
