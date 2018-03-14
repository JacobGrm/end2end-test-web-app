/*
 US62983
 https://rally1.rallydev.com/#/33932456357u/detail/userstory/46177377441

 */

var userSettings_async = userSettings_async || {};
userSettings_async.subns = (function() {

    var keyName1 = "qaUserKey_" + randomNumber(100,1000);
    var value1 = "value1_"+ randomNumber(100,1000);

    var keyName2 = "qaUserKey_" + randomNumber(100,1000);
    var value2 = "value2_"+ randomNumber(100,1000);

    var keyName3 = "qaUserKey_" + randomNumber(100,1000);
    var value3 = "value3_"+ randomNumber(100,1000);

    var keyName4 = "qaUserKey_" + randomNumber(100,1000);
    var value4 = "value4_"+ randomNumber(100,1000);

    var keyName5 = "qaUserKey_" + randomNumber(100,1000);
    var value5 = 1234; //int

    var keyName6 = "qaUserKey_" + randomNumber(100,1000);
    var value6 = 23.56; // double

    function create2KeyJSON(key1, value1, key2, value2) {

        var jsonObj = {};
        jsonObj[key1]= value1;
        jsonObj[key2]= value2;

        return jsonObj;

    };


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


    function postSettingKey(callback) {

        var data = value2;

        _setUpHttpRequestAsync(

            {
                "method":"POST"
                ,"url":userSettingsService + keyName2
                ,"data":data
                ,"json":isJson(data)
            },callback
        );

    }


    function putSettingKeyJSON_dictionary(callback) {

        var data1 = create2KeyJSON(keyName3, value3, keyName4, value4);

        _setUpHttpRequestAsync(
            {
                "method":"PUT"
                ,"url":userSettingsService
                ,"data":data1
                ,"json":isJson(data1)
            },callback
        );

    }


    function postSettingKeyJSON_dictionary(callback) {

        var data2 = create2KeyJSON(keyName5, value5, keyName6,value6);

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":userSettingsService
                ,"data":data2
                ,"json":isJson(data2)
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


    /*
            TESTS
     */



    describe('User Settings Service Tests (userSettings_async.js)::', function() {

        describe('Add string value for UserSettings with PUT::', function() {

            it("PUT UserSettings to local CouchDb", function(done){

                putSettingKey(done);
            });

            it("Verify API call returned status 201",function(){

                expect(g_httpStatus).toEqual(201);
            });

            it("Fetch user settings", function(done){

                getUserSetting(keyName1, done);
            });

            it("Verify key value", function () {

                expect(g_httpResponse).toEqual( JSON.stringify(value1) );
            });

            it("Attempt to fetch value for key that does not exist", function(done){

                getUserSetting("not_existing_key", done);
            });

            it("If settings key not found HTTP status code should be 404", function(){

                expect(g_httpStatus).toEqual(404);

            });
        });

        describe('Add string value for UserSettings with POST::', function() {

            it("POST UserSettings to local CouchDb", function(done){

                postSettingKey(done);
            });

            it("Verify POST API call returned status 201",function(){

                expect(g_httpStatus).toEqual(201);
            });

            it("Fetch user settings after POST", function(done){

                getUserSetting(keyName2,done);
            });

            it("Verify key value after POST", function () {

                expect(g_httpResponse).toEqual( JSON.stringify(value2) );
            });

        });

        describe('Add string values for UserSettings with PUT and JSON dictionary::', function() {

            it("Make API call to put JSON dictionary UserSettings to local CouchDb", function(done){

                putSettingKeyJSON_dictionary(done);
            });

            it("PUT call should return status 201",function(){

                expect(g_httpStatus).toEqual(201);
            });

            it("Fetch user settings after PUT call for 'keyName3'", function(done){

                getUserSetting(keyName3,done);
            });

            it("JSON should be returned with 'value3' for 'keyName3'", function(){

                expect(g_httpResponse).toEqual( JSON.stringify(value3), "Value3 put is not equat to value stored in db");
            });

            it("Fetch user settings after PUT call for 'keyName4'", function(done){

                getUserSetting(keyName4,done);
            });

            it("JSON should be returned with 'value4' for 'keyName4'", function(){

                expect(g_httpResponse).toEqual( JSON.stringify(value4), "Value4 put is not equat to value stored in db");
            });

        });


        describe('Add numeric values for UserSettings with POST and JSON dictionary::', function() {

            it("POST JSON dictionary UserSettings to local CouchDb", function (done) {

                postSettingKeyJSON_dictionary(done);
            });

            it("POST call should return status 201",function(){

                expect(g_httpStatus).toEqual(201);
            });

            it("Fetch user settings after POST call for 'keyName5'", function(done){

                getUserSetting(keyName5,done);
            });

            it("JSON should be returned with 'value5' for 'keyName5'", function(){

                expect(g_httpResponse).toEqual( JSON.stringify(value5), "value5 POST is not equat to value stored in db");
            });

            it("Fetch user settings after POST call for 'keyName6'", function(done){

                getUserSetting(keyName6,done);
            });

            it("JSON should be returned with 'value6' for 'keyName6'", function(){

                expect(g_httpResponse).toEqual( JSON.stringify(value6), "Value6 is not equat to value stored in db");
            });

        });

        describe('JSON dictionary of key/value string pairs for all user settings for the App::', function() {

            it("Fetch all user settings for the app by making API_HOST/usersettings call", function(done){

                getUserSetting("", done);
            });

            it("Call to API_HOST/usersettings returns JSON dictionary", function () {

                expect(g_httpResponse.length).toBeGreaterThan(10);
            });
        });

    });

})();
