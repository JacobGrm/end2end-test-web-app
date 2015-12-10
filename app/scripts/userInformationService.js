/**
 * Created by 204071207 on 12/3/15.
 */


var userInformationService = "http://"+API_HOST+"/user/";

var userDictionary =
{
    "user" : "Joe Smith",
    "myFoo": "123e2e",
    "isauthenticated" : false,
    "userRoles" : [100, 200, 300, 500],
    "myNumber":55
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
        expect(isJson(obj)).toBe(true);

    });

    it('Get data corresponding to data-element of stored information from the current user', function(){

        getCurrentUserDataElement("username");
        expect(g_httpResponse).toEqual(CURRENT_USER);

        getCurrentUserDataElement("isauthenticated");
        expect(JSON.parse(g_httpResponse)).toEqual(1);

    });

    it('If data-element is not found in the user data dictionary then the response will be a 404 status code', function(){

        getCurrentUserDataElement("nonExistantElement");
        expect(g_httpStatus).toEqual(404);

    });

    it('Create JSON dictionary of name/value pairs associated with User data. Existing dictionary currently stored is replaced', function(){

        createUserDataDictionary(userDictionary);
        expect(g_httpStatus).toEqual(200);

        getCurrentUserDataElement("user");
        expect(g_httpResponse).toEqual(userDictionary.user);

        getCurrentUserDataElement("isauthenticated");
        expect(JSON.parse(g_httpResponse)).toEqual(0);

        getCurrentUserDataElement("userRoles");
        expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.userRoles);

        getCurrentUserDataElement("myFoo");
        expect(g_httpResponse).toEqual(userDictionary.myFoo);

        getCurrentUserDataElement("myNumber");
        expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.myNumber);

    });

    it('Delete user dictionary. The current user dictionary is cleared. Future GET requests return no data.', function(){

        deleteUserDataDictionary();
        expect(g_httpStatus).toEqual(200);

        getCurrentUser();
        expect(g_httpResponse).toEqual("{}");

    });

});