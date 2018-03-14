/**
 * Created by 204071207 on 1/20/16.
 */

describe('Window management service. (loadInvalidAppWindowService.js)::',function(){

    describe('Extracts appname web app from local Couchbase database::',function(){


        it('Not found 404 error when displayWebApp has non-existing app parameter ', function(){

            displayWebApp("does_not_exist");
            expect(g_httpStatus).toEqual(404);
        });

    });

});