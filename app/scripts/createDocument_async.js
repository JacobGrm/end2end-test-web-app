/*

        Created by Clifton G
 */


var createDocument_async = createDocument_async || {};
createDocument_async.subns = (function() {

    var docName = "command_multi_" + generateUniqueId();
    var docName_cdb = "command123cdb123multi_" + generateUniqueId(); // to test bug when name contains "cdb" substring

    function pushCommand(id, callback) {

        var data = {
            "type": "command",
            "~userid": "user1",
            "channels": ["entity_jacob_ge_com"],
            "~status": "pending",
            "request": {
                "uri": "/service1/add-number",
                "method": "PUT",
                "headers": {},
                "body": {
                    "a": 1,
                    "b": 2
                }
            }
        };

        _setUpHttpRequestAsync(

            {
                "method":"PUT"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
                ,"data":data
                ,"json":isJson(data)
            },callback
        );


    }

    function getCommand(id, callback) {

        _setUpHttpRequestAsync(

            {
                "method":"GET"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
            },callback
        );

    }

    /*
     TESTS
     */


    describe('PredixMobile API Tests (createDocument_async.js) ::', function() {

        describe('Create and process a command::', function() {

            it("Create a command by posting to the local CouchDb", function (done) {

                pushCommand(docName, done);

            });

            it("Verify status and response",function(){

                expect(g_httpStatus).toEqual(201);
                expect(g_httpResponse.indexOf("true")).not.toEqual(-1);
            });

            it("Fetch document(command)",function(done){

                getCommand(docName, done);
            });

            it("Verify command can be retrieved from client couchDb", function () {

                expect(g_httpStatus).toEqual(200);
                expect(g_httpResponse.indexOf(docName)).not.toEqual(-1);
            });

        });

        describe('Create and process a command with cdb substring (test for DE6915) ::', function() {

            it("cdb substring: Create a command by posting to the local CouchDb", function (done) {

                pushCommand(docName_cdb, done);

            });

            it("cdb substring: Verify status and response",function(){

                expect(g_httpStatus).toEqual(201);
                expect(g_httpResponse.indexOf("true")).not.toEqual(-1);
            });

            it("cdb substring: Fetch document(command)",function(done){

                getCommand(docName_cdb, done);
            });

            it("cdb substring: Verify command can be retrieved from client couchDb", function () {

                expect(g_httpStatus).toEqual(200);
                expect(g_httpResponse.indexOf(docName_cdb)).not.toEqual(-1);
            });

        });

    });

})();