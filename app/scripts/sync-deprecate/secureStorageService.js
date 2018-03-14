/**
 * Created by 204071207 on 2/16/16.
 */


var secureStorageService = secureStorageService || {};
secureStorageService.subns = (function() {

    var keyValue = "qa_data_key_" + generateUniqueId();
    var keyValue1 = "qa_data_key_" + generateUniqueId();
    var keyValue2 = "qa_data_key_" + generateUniqueId();
    var keyValue3 = "qa_data_key_" + generateUniqueId();

    var dataJSON; // json file ./res/dataStorage.json

    var dictionary; // short string
    var dictionary1; // long string separated by commas
    var dictionary2; // array of strings
    var dictionary3; // incorrect JSON


    describe("Secure store and retrieve data protected by key (secureStorageService.js)::", function () {

        // Read json into variable

        beforeAll(function (done) {

            var xmlhttp = new XMLHttpRequest();
            var url = "./res/dataStorage.json";

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    dataJSON = JSON.parse(xmlhttp.responseText);
                    done();
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        });


        it("Store data (sipmle string) to storage with no optional 'promptToRead' dictionary field", function () {

            dictionary = Object.assign({}, dataJSON); // make a copy
            dictionary.key = keyValue;
            dictionary.value = "qa data storage test";

            saveDataToStorage(dictionary);
            expect(g_httpStatus).toEqual(200);

        });

        it("Retrieve data protected by the key", function () {

            getStorageData(dictionary.key);
            var res = JSON.parse(g_httpResponse);
            expect(dictionary.value).toEqual(res.value);
        });


        it("Secure store data (as a single string) loaded from JSON file", function () {

            dictionary1 = Object.assign({}, dataJSON); // make a copy

            dictionary1.key = keyValue1;
            dictionary1.value = dataJSON.value.join(",");

            saveDataToStorage(dictionary1);
            expect(g_httpStatus).toEqual(200);

        });

        it("Retrieve data stored as a single string", function () {

            getStorageData(dictionary1.key);
            var res = JSON.parse(g_httpResponse);

            console.log("Data retrieved: ", res.value);

            expect(dictionary1.value).toEqual(res.value);

        });

        it("Store data (as string array) to secure storage (DE21751)", function () {

            dictionary2 = Object.assign({}, dataJSON); // make a copy
            dictionary2.key = keyValue2;

            saveDataToStorage(dictionary2);
            expect(g_httpStatus).toEqual(200);

        });

        it("Retrieve data stored as a string array (DE21751)", function () {

            getStorageData(dictionary2.key);
            var res = JSON.parse(g_httpResponse);

            expect(dictionary2.value).toEqual(res.value);
        });

        it("Store data using existing key (replace one set of data with another)", function () {

            dictionary.value += generateUniqueId();

            saveDataToStorage(dictionary);
            expect(g_httpStatus).toEqual(200);
        });

        it("Retrieve data and verify it's been overwritten", function () {

            getStorageData(dictionary.key);
            var res = JSON.parse(g_httpResponse);
            expect(dictionary.value).toEqual(res.value);
        });

        it("Expect 400 status output when incorrect JSON used for input", function () {

            dictionary3 = Object.assign({}, dataJSON); // make a copy
            dictionary3.key = keyValue3;

            delete dictionary3.value; // remove expected JSON key
            dictionary3.value1 = "some string"; // unexpected format

            saveDataToStorage(dictionary3);
            expect(g_httpStatus).toEqual(400);
        });

        it("Expect 404 for nonexistent key",function(){

            getStorageData("key_does_not_exist");
            expect(g_httpStatus).toEqual(404, "Expect 404 for nonexistent key");
        });

    });

})();
