/*
 US62983
 https://rally1.rallydev.com/#/33932456357u/detail/userstory/46177377441

 */

var userSettings = userSettings || {};
userSettings.subns = (function() {

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

        var data1 = create2KeyJSON(keyName3, value3, keyName4, value4);

        _setUpHttpRequest(
            {
                "method":"PUT"
                ,"url":userSettingsService
                ,"data":data1
                ,"json":isJson(data1)
            }
        );

    }


    function postSettingKeyJSON_dictionary() {

        var data2 = create2KeyJSON(keyName5, value5, keyName6,value6);

        _setUpHttpRequest(
            {
                "method":"POST"
                ,"url":userSettingsService
                ,"data":data2
                ,"json":isJson(data2)
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

            it("PUT UserSettings to local CouchDb", function (done) {

                putSettingKey();
                expect(g_httpStatus).toEqual(201);

                poll(
                    function() {

                        getUserSetting(keyName1);
                        return g_httpResponse === JSON.stringify(value1);
                    },
                    function() {
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                    },
                    10000, //timeout
                    1000   //interval
                );

            });


            it("Verify key value", function(){

                expect(g_httpResponse).toEqual( JSON.stringify(value1) );

            });


            it("If settings key not found HTTP status code should be 404", function(){

                getUserSetting("not_existing_key");
                expect(g_httpStatus).toEqual(404);

            });
        });

        describe('Add string value for UserSettings with POST::', function() {

            it("POST UserSettings to local CouchDb", function () {

                postSettingKey();
                expect(g_httpStatus).toEqual(201);

                getUserSetting(keyName2);
                expect(g_httpResponse).toEqual( JSON.stringify(value2) );
            });
        });

        describe('Add string values for UserSettings with PUT and JSON dictionary::', function() {

            it("Should PUT JSON dictionary UserSettings to local CouchDb", function () {

                putSettingKeyJSON_dictionary();
                expect(g_httpStatus).toEqual(201);

                getUserSetting(keyName3);
                expect(g_httpResponse).toEqual( JSON.stringify(value3), "Value3 put is not equat to value stored in db");
                getUserSetting(keyName4);
                expect(g_httpResponse).toEqual( JSON.stringify(value4), "Value4 put is not equat to value stored in db");

            });
        });


        describe('Add numeric values for UserSettings with POST and JSON dictionary::', function() {

            it("POST JSON dictionary UserSettings to local CouchDb", function () {

                postSettingKeyJSON_dictionary();
                expect(g_httpStatus).toEqual(201);

                getUserSetting(keyName5);
                expect(g_httpResponse).toEqual( JSON.stringify(value5), "Value5 added and put is not equat to value stored in db");
                getUserSetting(keyName6);
                expect(g_httpResponse).toEqual( JSON.stringify(value6), "Value6 added and put is not equat to value stored in db");

            });
        });

        describe('JSON dictionary of key/value string pairs for all user settings for the App::', function() {

            it("Call to API_HOST/usersettings returns JSON dictionary", function () {

                getUserSetting();
                expect(g_httpResponse.length).toBeGreaterThan(10);

            });
        });


        describe('Delete user settings for the App::', function() {

            it("If found, the key and value for settingkey will be deleted from the settings dictionary", function () {

                getUserSetting(keyName1);
                expect(g_httpResponse).toEqual( JSON.stringify(value1), "unexpected return value" );

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

})();
