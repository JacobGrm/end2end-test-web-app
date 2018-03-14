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
*/

var secureStorageService_prompt = secureStorageService_prompt || {};
secureStorageService_prompt.subns = (function() {

    var originalPrompt = "Provide authentication";
    var modifiedPrompt = "Please Enter Authentication Now";


    var dictionary = {
        "key":"qa_key_"+generateUniqueId(),
        "value": "some string",
        "promptToRead": originalPrompt
    };


    describe("Secure store and retrieve data protected by key (secureStorageService_prompt.js)::",function(){


        it("Store data with optional dictionary field 'promptToRead'",function(){

            saveDataToStorage(dictionary);
            expect(g_httpStatus).toEqual(200);

        });

        it("Retrieve data protected by the key and authentication",function(){

            getStorageData(dictionary.key, modifiedPrompt);
            var res = JSON.parse(g_httpResponse);
            expect(dictionary.value).toEqual(res.value);
        });

    });

})();