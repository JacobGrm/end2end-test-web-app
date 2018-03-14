/**
 * Created by 204071207 on 1/20/16.
 */

var loadInvalidAppWindowService_async = loadInvalidAppWindowService_async || {};
loadInvalidAppWindowService_async.subns = (function() {

    describe('Window management service. (loadInvalidAppWindowService_async.js)::',function(){

        describe('Extracts appname web app from local Couchbase database::',function(){


            it('Attempt to load invalid webapp', function(done){

                displayWebAppAsync("does_not_exist",done);
            });

            it('Verify Not found 404 error when displayWebApp has non-existing app parameter ', function(){

                expect(g_httpStatus).toEqual(404);
            });

        });

    });

})();