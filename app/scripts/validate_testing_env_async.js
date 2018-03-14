/**
 * Created by 204071207 on 1/27/17.
 */

/*

 */


var validate_test_env_async = validate_test_env_async || {};
validate_test_env_async.subns = (function() {


    describe("Check synced documents to make sure it's a new installation (validate_test_env_async.js)::", function(){

        // May need more timeout value to allow command to be processed
        beforeAll(function(done) {

            getDocumentsAsync("_all_docs?include_docs=true",done);
        });

        it("Check client synced documents to make sure it's a new installation::", function(){

            expect(g_httpResponse.includes("channel_1_jacob")).toEqual(false, "channel_1_jacob TESTS SHOULD BE RUN ON NEW INSTALLATION. DELETE APP BEFORE RUNNING TESTS!");
            expect(g_httpResponse.includes("channel_2_jacob")).toEqual(false, "channel_2_jacob TESTS SHOULD BE RUN ON NEW INSTALLATION. DELETE APP BEFORE RUNNING TESTS!");
            expect(g_httpResponse.includes("channel_3_jacob")).toEqual(false, "channel_3_jacob TESTS SHOULD BE RUN ON NEW INSTALLATION. DELETE APP BEFORE RUNNING TESTS!");
        });


    });

})();
