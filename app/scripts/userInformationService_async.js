/**
 * Created by 204071207 on 12/3/15.
 */


var userInformationService_async = userInformationService_async || {};
userInformationService_async.subns = (function() {

    var origUserInfo;

    var userDictionary =
    {
        "user" : "Joe Smith",
        "myFoo": "123e2e",
        "isauthenticated" : false,
        "userRoles" : [100, 200, 300, 500],
        "myNumber":55,
        "myDecimal":34.12,
        "username": "Joe Smith"
    };


    function getCurrentUser(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":userInformationService
            },callback
        );
    };

    function getCurrentUserDataElement(data_element, callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":userInformationService + data_element
            },callback
        );
    };

    function createUserDataDictionary(data, callback){

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":userInformationService
                ,"data":data
                ,"json":isJson(data)
            },callback
        );

    };


    function deleteUserDataDictionary(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"DELETE"
                ,"url":userInformationService
            },callback
        );
    };


    describe('Allows storage and retrieval of user information (userInformationService_async.js)::', function(){

        beforeAll(function(done) {

            getCurrentUser(done);
        });

        it('Verify response received is JSON dictionary', function(){

            origUserInfo = JSON.parse(g_httpResponse);

            var obj = JSON.parse(g_httpResponse);
            expect(isJsonReceived(obj)).toBe(true);

        });

        it("Get data corresponding to data-element 'username' of stored information from the current user", function(done) {

            getCurrentUserDataElement("username",done);
        });


        it("Verify data corresponding to data-element 'username' of stored information from the current user (Electron: DE27046)", function() {

            expect(g_httpResponse.toLowerCase()).toEqual(g_user.toLowerCase(), "Dictionary key 'username' not found!");
        });

        // Commented out this test per Andy's request. Hard-coded value "isauthenticated" was removed from code

        //it("Get data corresponding to data-element 'isauthenticated' of stored information from the current user", function(done) {
        //
        //    getCurrentUserDataElement("isauthenticated",done);
        //});
        //
        //it("Verify data corresponding to data-element 'isauthenticated' of stored information from the current user", function() {
        //
        //    expect(JSON.parse(g_httpResponse)).not.toEqual(undefined,"Dictionary key 'isauthenticated' not found!");
        //});

        it('Attempt to fetch data-element not existing in the user data dictionary', function(done) {

            getCurrentUserDataElement("nonExistantElement",done);
        });


        it('If data-element is not found in the user data dictionary then the response will be a 404 status code', function(){

            expect(g_httpStatus).toEqual(404);
        });

        it('Create JSON dictionary of name/value pairs associated with User data. Existing dictionary currently stored is replaced ', function(done) {

            createUserDataDictionary(userDictionary, done);
        });

        it("Verify creation of dictionary returned 201 status", function(){

            expect(g_httpStatus).toEqual(201);
        });

        it("Get data corresponding to data-element 'user' from new dictionary", function(done) {

            getCurrentUserDataElement("user",done);
        });

        it("Verify data corresponding to data-element 'user' from new dictionary", function() {

            expect(g_httpResponse).toEqual(userDictionary.user, "Data dictionary field 'user' not found");
        });

        it("Get data corresponding to data-element 'isauthenticated' from new dictionary", function(done) {

            getCurrentUserDataElement("isauthenticated",done);
        });

        it("Verify data corresponding to data-element 'isauthenticated' from new dictionary", function() {

            // Because of platform JSON encoding difference (Android, IOS etc)
            var res = Boolean(JSON.parse(userDictionary.isauthenticated)) === Boolean(JSON.parse(g_httpResponse));
            expect(res).toEqual(true, "Data dictionary field 'isauthenticated' has wrong value or not found");
        });

        it("Get data corresponding to data-element 'userRoles' from new dictionary", function(done) {

            getCurrentUserDataElement("userRoles",done);
        });

        it("Verify data corresponding to data-element 'userRoles' from new dictionary", function() {

            expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.userRoles, "Data dictionary field 'userRoles' not found");
        });

        it("Get data corresponding to data-element 'myFoo' from new dictionary", function(done) {

            getCurrentUserDataElement("myFoo",done);
        });

        it("Verify data corresponding to data-element 'myFoo' from new dictionary", function() {

            expect(g_httpResponse).toEqual(userDictionary.myFoo, "Data dictionary field 'myFoo' not found");
        });

        it("Get data corresponding to data-element 'myNumber' from new dictionary", function(done) {

            getCurrentUserDataElement("myNumber",done);
        });

        it("Verify data corresponding to data-element 'myNumber' from new dictionary", function() {

            expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.myNumber, "Data dictionary field 'myNumber' not found or has wrong value");
        });

        it("Get data corresponding to data-element 'myDecimal' from new dictionary", function(done) {

            getCurrentUserDataElement("myDecimal",done);
        });

        it("Verify data corresponding to data-element 'myDecimal' from new dictionary", function() {

            expect(JSON.parse(g_httpResponse)).toEqual(userDictionary.myDecimal, "Data dictionary field 'myDecimal' not found or has wrong value");
        });

        it("Delete user dictionary", function(done) {

            deleteUserDataDictionary(done);
        });

        it("Verify dictionary delete returned status 200", function() {

            expect(g_httpStatus).toEqual(200);
        });

        it('After call to Delete user dictionary attempt to GET user dic', function(done) {

            getCurrentUser(done);
        });

        it('After call to Delete user dictionary the current user dictionary is cleared. Future GET requests return no data.', function() {

            expect(g_httpResponse).toEqual("{}");
        });

        afterAll(function(done) {

            // restore original user info
            createUserDataDictionary(origUserInfo, done);
        });
    });

})();