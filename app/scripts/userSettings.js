/*
 US62983
 https://rally1.rallydev.com/#/33932456357u/detail/userstory/46177377441

 */

var userSettingsService = "http://"+API_HOST+"/usersettings/";


var keyName1 = "qaUserKey_" + randomNumber(100,1000);
var value1 = "value1";

var keyName2 = "qaUserKey_" + randomNumber(100,1000);
var value2 = "value2";

var keyName3 = "qaUserKey_" + randomNumber(100,1000);
var value3 = "value3";

var keyName4 = "qaUserKey_" + randomNumber(100,1000);
var value4 = "value4";

var keyName5 = "qaUserKey_" + randomNumber(100,1000);
var value5 = "value5";

var keyName6 = "qaUserKey_" + randomNumber(100,1000);
var value6 = "value6";

function create2KeyJSON(key1, value1, key2, value2) {

    var jsonObj = {};
    jsonObj[key1]= value1;
    jsonObj[key2]= value2;

    return jsonObj;

};


function putSettingKey() {

    var data = value1;

    _setUpHttpRequest(

        {
            "method":"PUT"
            ,"url":userSettingsService + keyName1
            ,"data":data
            ,"json":isJson(data)
        }
    );
}


function postSettingKey() {

    var data = value2;

    _setUpHttpRequest(

        {
            "method":"POST"
            ,"url":userSettingsService + keyName2
            ,"data":data
            ,"json":isJson(data)
        }
    );

}


function putSettingKeyJSON_dictionary() {

    var data = create2KeyJSON(keyName3, value3, keyName4,value4);

    _setUpHttpRequest(
        {
            "method":"PUT"
            ,"url":userSettingsService
            ,"data":data
            ,"json":isJson(data)
        }
    );

}


function postSettingKeyJSON_dictionary() {

    var data = create2KeyJSON(keyName5, value5, keyName6,value6);

    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":userSettingsService
            ,"data":data
            ,"json":isJson(data)
        }
    );

}


function getUserSetting(key) {

    if(typeof key == 'undefined')
        key = '';

    _setUpHttpRequest(
        {
            "method":"GET"
            ,"url":userSettingsService + key
        }
    );

}


function deleteSetting(key) {

    if(typeof key == 'undefined')
        key = '';

    _setUpHttpRequest(
        {
            "method":"DELETE"
            ,"url":userSettingsService + key
        }
    );
}


/*
        TESTS
 */



describe('User Settings Service Tests (userSettings.js)::', function() {

    describe('Add string value for UserSettings with PUT::', function() {

        it("PUT UserSettings to local CouchDb", function () {

            putSettingKey();
            expect(g_httpStatus).toEqual(200);

            getUserSetting(keyName1);
            expect(stripQuotes(g_httpResponse)).toEqual(value1);
        });


        it("If settings key not found HTTP status code should be 404", function(){

            getUserSetting("not_existing_key");
            expect(g_httpStatus).toEqual(404);

        });
    });

    describe('Add string value for UserSettings with POST::', function() {

        it("POST UserSettings to local CouchDb", function () {

            postSettingKey();
            expect(g_httpStatus).toEqual(200);

            getUserSetting(keyName2);
            expect(stripQuotes(g_httpResponse)).toEqual(value2);
        });
    });

    describe('Add string values for UserSettings with PUT and JSON dictionary::', function() {

        it("PUT JSON dictionary UserSettings to local CouchDb", function () {

            putSettingKeyJSON_dictionary();
            expect(g_httpStatus).toEqual(200);

            getUserSetting(keyName3);
            expect(g_httpResponse).toEqual(value3);
            getUserSetting(keyName4);
            expect(g_httpResponse).toEqual(value4);

        });
    });


    describe('Add string values for UserSettings with POST and JSON dictionary::', function() {

        it("POST JSON dictionary UserSettings to local CouchDb", function () {

            postSettingKeyJSON_dictionary();
            expect(g_httpStatus).toEqual(200);

            getUserSetting(keyName5);
            expect(g_httpResponse).toEqual(value5);
            getUserSetting(keyName6);
            expect(g_httpResponse).toEqual(value6);

        });
    });

    describe('JSON dictionary of key/value string pairs for all user settings for the App::', function() {

        it("Call to API_HOST/usersettings returns JSON dictionary", function () {

            getUserSetting();
            expect(g_httpResponse.length).toBeGreaterThan(10);

        });
    });


    describe('Delete user settings for the App::', function() {

        it("If found the key and value for settingkey will be deleted from the settings dictionary", function () {

            getUserSetting(keyName1);
            expect(stripQuotes(g_httpResponse)).toEqual(value1);

            deleteSetting(keyName1);
            expect(g_httpStatus).toEqual(200);

            getUserSetting(keyName1);
            expect(g_httpStatus).toEqual(404);

        });


        it("If settings are found they will be deleted from the settings dictionary", function () {

            getUserSetting();
            expect(g_httpResponse.length).toBeGreaterThan(10);

            deleteSetting();
            expect(g_httpStatus).toEqual(200);

            getUserSetting();
            expect(g_httpStatus).toEqual(404);

        });

    });


});
