/*
 US62983
 https://rally1.rallydev.com/#/33932456357u/detail/userstory/46177377441

 */

var userSettingsDelete_async = userSettingsDelete_async || {};
userSettingsDelete_async.subns = (function() {

    var keyName1 = "qaUserKey_" + randomNumber(100,1000);
    var value1 = "value1_"+ randomNumber(100,1000);


    function postSettingKeyJSON_dictionary(dic, callback) {

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":userSettingsService
                ,"data":dic
                ,"json":isJson(dic)
            },callback
        );

    }

    function putSettingKey(callback) {

        var data = value1;

        _setUpHttpRequestAsync(

            {
                "method":"PUT"
                ,"url":userSettingsService + keyName1
                ,"data":data
                ,"json":isJson(data)
            },callback
        );
    }

    function getUserSetting(key, callback) {

        if(typeof key == 'undefined')
            key = '';

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":userSettingsService + key
            },callback
        );

    }


    function deleteSetting(key,callback) {

        if(typeof key == 'undefined')
            key = '';

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                ,"url":userSettingsService + key
            },callback
        );
    }


    /*
            TESTS
     */



    describe('User Settings Service Tests (userSettingsDelete_async.js)::', function() {


        describe('Delete user settings for the App::', function() {

            it("Publish new user settings dictionary", function(done){

                putSettingKey(done);
            });

            it("Get user settings for 'keyName1'", function(done){

                getUserSetting(keyName1,done);
            });

            it("Verify key/value pair found", function () {

                expect(g_httpResponse).toEqual(JSON.stringify(value1), "unexpected return value");
            });

            it("If found, issue API call to delete it from the user settings dictionary", function (done) {

                deleteSetting(keyName1, done);
            });

            it("Delete user settings call should return status 200", function(){

                expect(g_httpStatus).toEqual(200);
            });

            it("Attempt to fetch deleted user settings", function(done){

                getUserSetting(keyName1, done);
            });

            it("Verify after API call to delete user setting they are gone (status 404)", function(){

                expect(g_httpStatus).toEqual(404);
            });

            it("Verify there are some user settings in a system before attempt to delete them", function(done){

                getUserSetting("", done);
            });

            it("Some user settings expected to be there", function(){

                expect(g_httpResponse.length).toBeGreaterThan(10);
            });

            it("If settings are found they should be deleted from the settings dictionary", function(done) {

                deleteSetting("",done);
            });

            it("Verify API to delete all user settings returned status 200", function(){

                expect(g_httpStatus).toEqual(200);
            });

            it("Attempt to fetch user settings after API call to delete them all", function(done){

                getUserSetting("",done);
            });

            it("No user settings should be found after API call to delete them Android DE13917", function(){

                expect(g_httpStatus).toEqual(404, "Status should be 404. Android DE13917");
                expect(g_httpResponse.length).toEqual(0, "Should return nothing. Android DE13917");
            });

        });

    });

})();
