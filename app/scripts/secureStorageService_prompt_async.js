/**
 * Created by 204071207 on 2/17/16.
 */

/**
 * Created by 204071207 on 2/16/16.
 */

/*
    Purspouse: Visually inspect the following
               a) verify user is presented with prompt
               b) prompt is overwritten from what is stored in JSON to "Please Enter Authentication Now"

               On prompt (pop-up) -> use touch ID
               FOR THIS TO RUN, TOUCHID SHOULD BE ENABLED
*/

var secureStorageService_prompt_async = secureStorageService_prompt_async || {};
secureStorageService_prompt_async.subns = (function() {

    var originalPrompt = "Provide authentication";
    var modifiedPrompt = "Please Enter Authentication Now";


    var dictionary = {
        "key":"qa_key_"+generateUniqueId(),
        "value": "some string",
        "promptToRead": originalPrompt
    };


    describe("Secure store and retrieve data protected by key (secureStorageService_prompt_async.js)::",function(){


        it("Store data with optional dictionary field 'promptToRead'",function(done){

            saveDataToStorageAsync(dictionary,done);
        });

        it("Verify storage was successful by checking status",function(){

            expect(g_httpStatus).toEqual(201, "Storage was not successful");
        });

        it("Retrieve data protected by the key and authentication",function(done){

            getStorageDataAsync(dictionary.key, done, modifiedPrompt);
        });

        it("Verify data (DE18478 Android)",function(){

            console.log("g_httpResponse after the call: "+g_httpResponse);
            var res = JSON.parse(g_httpResponse);
            expect(dictionary.value).toEqual(res.value);
        });

    });

})();