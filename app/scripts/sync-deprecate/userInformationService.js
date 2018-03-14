/**
 * Created by 204071207 on 12/3/15.
 */


var userInformationServiceTest = userInformationServiceTest || {};
userInformationServiceTest.subns = (function() {


    var userDictionary =
    {
        "user" : "Joe Smith",
        "myFoo": "123e2e",
        "isauthenticated" : false,
        "userRoles" : [100, 200, 300, 500],
        "myNumber":55,
        "myDecimal":34.12
    };


    function getCurrentUser() {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":userInformationService
            }
        );
    };

    function getCurrentUserDataElement(data_element) {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":userInformationService + data_element
            }
        );
    };

    function createUserDataDictionary(data){

        _setUpHttpRequest(
            {
                "method":"POST"
                ,"url":userInformationService
                ,"data":data
                ,"json":isJson(data)
            }
        );

    };


    function deleteUserDataDictionary() {

        _setUpHttpRequest(
            {
                "method":"DELETE"
                ,"url":userInformationService
            }
        );
    };


    describe('Allows storage and retrieval of user information (userInformationService.js)::', function(){

        it('Get data JSON JSON dictionary of stored information from the current user', function(){

            getCurrentUser();

            var obj = JSON.parse(g_httpResponse);
            expect(isJsonReceived(obj)).toBe(true);

        });

        it('Get data corresponding to data-element of stored information from the current user (Electron: DE27046)', function(){

            getCurrentUserDataElement("username");

            expect(g_httpResponse.toLowerCase()).toEqual(g_user.toLowerCase(),"Dictionary key 'username' not found!");

            getCurrentUserDataElement("isauthenticated");

            expect(JSON.parse(g_httpResponse)).not.toEqual(undefined,"Dictionary key 'isauthenticated' not found!");

        });

        it('If data-element is not found in the user data dictionary then the response will be a 404 status code', function(){

            getCurrentUserDataElement("nonExistantElement");
            expect(g_httpStatus).toEqual(404);

        });

        it('Create JSON dictionary of name/value pairs associated with User data. Existing dictionary currently stored is replaced (DE5122 ios)', function(){

            createUserDataDictionary(userDictionary);
            expect(g_httpStatus).toEqual(201);

            getCurrentUserDataElement("user");
            expect(g_httpResponse).toEqual(userDictionary.user, "Data dictionary field 'user' not found");

            getCurrentUserDataElement("isauthenticated");
            expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.isauthenticated, "Data dictionary field 'isauthenticated' has wrong value or not found (DE5122 ios)");

            getCurrentUserDataElement("userRoles");
            expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.userRoles, "Data dictionary field 'userRoles' not found");

            getCurrentUserDataElement("myFoo");
            expect(g_httpResponse).toEqual(userDictionary.myFoo, "Data dictionary field 'myFoo' not found");

            getCurrentUserDataElement("myNumber");
            expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.myNumber, "Data dictionary field 'myNumber' not found or has wrong value");

            getCurrentUserDataElement("myDecimal");
            expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.myDecimal, "Data dictionary field 'myDecimal' not found or has wrong value");

        });

        it('Delete user dictionary. The current user dictionary is cleared. Future GET requests return no data.', function(){

            deleteUserDataDictionary();
            expect(g_httpStatus).toEqual(200);

            getCurrentUser();
            expect(g_httpResponse).toEqual("{}");

        });

    });

})();