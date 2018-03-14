/**
 * Created by 204071207 on 12/16/15.
 */

// https://github.com/PredixDev/PredixMobileSDK/wiki/Boot

function restartApp(callback){

    _setUpHttpRequestAsync(
        {
            "method":"POST"
            ,"url": WEB_PROTOCOL+API_HOST+"/boot/restart"
        },callback
    );
};

describe('Restart the app (restartApp_async.js)::',function(){

    describe('Issue REST API to restart the app::',function(){

        it('Restart', function(done){

            restartApp(done);
       });

    });
});
