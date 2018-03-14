/**
 * Created by 204071207 on 2/16/16.
 */


var secureStorageService_async = secureStorageService_async || {};
secureStorageService_async.subns = (function() {

    var key = "qa_data_key_" + generateUniqueId();
    var key3 = "qa_data_key_" + generateUniqueId();

    var dictionary = {
                        "key":"1234",
                        "value":"qa data storage test"
                    }; // short string

    var prompt = "Test message";


    describe("Secure store and retrieve data protected by key (secureStorageService_async.js)::", function () {

        it("Store data (sipmle string) to storage with no optional 'promptToRead' dictionary field", function (done) {

            saveDataToStorageAsync(dictionary,done);

        });

        it("Verify storage was successful by checking status",function(){

            expect(g_httpStatus).toEqual(201, "Storage was not successful");
        });

        it("Retrieve data protected by the key w/o providing prompt (prompt should be ignored)", function (done) {

            getStorageDataAsync(dictionary.key, done);

        });

        it("Verify retrieved data (no prompt)",function(){

            console.log("(no prompt) data protected by the key: "+g_httpResponse);
            console.log("(no prompt) status for data protected by the key: "+g_httpStatus);

            var res1 = JSON.parse(g_httpResponse);
            expect(dictionary.value).toEqual(res1.value);
        });


        it("Retrieve data protected by the key", function (done) {

            getStorageDataAsync(dictionary.key, done, prompt);
        });

        it("Verify data",function(){

            console.log("data protected by the key: "+g_httpResponse);
            console.log("status for data protected by the key: "+g_httpStatus);

            var res = JSON.parse(g_httpResponse);
            expect(dictionary.value).toEqual(res.value);
        });


        it("Store data using existing key (replace one set of data with another)", function (done) {

            dictionary.value += generateUniqueId();

            saveDataToStorageAsync(dictionary,done);
        });

        it("Verify storage was successful by checking status",function(){

            expect(g_httpStatus).toEqual(201, "Storage of modified data was not successful");
        });

        it("Retrieve data and verify it's been overwritten", function (done) {

            getStorageDataAsync(dictionary.key,done,prompt);
        });

        it("Verify data stored",function(){

            var res = JSON.parse(g_httpResponse);
            expect(dictionary.value).toEqual(res.value, "data was not overwritten");
        });

        it("Attempt to store data with incorrect JSON used for input", function (done) {

            dictionary.key = key3;

            delete dictionary.value; // remove expected JSON key
            dictionary.value1 = "some string"; // unexpected format

            saveDataToStorageAsync(dictionary, done);
        });

        it("Expect 400 status output when incorrect JSON used for input", function () {

            expect(g_httpStatus).toEqual(400);
        });

        it("Attempt to store data with nonexistent key",function(done){

            getStorageDataAsync("key_does_not_exist",done,prompt);
        });

        it("Expect 404 for nonexistent key",function(){

            expect(g_httpStatus).toEqual(404, "Expect 404 for nonexistent key");
        });

    });

})();
