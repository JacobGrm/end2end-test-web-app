/*

        Created by Clifton G
 */


var docName = "command_multi_" + randomNumber(100,1000);

function pushCommand() {

    var data = {
        "type": "command",
        "~userid": "user1",
        //"channels": ["entity_user1"],
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

    _setUpHttpRequest(

        {
            "method":"PUT"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + docName
            ,"data":data
            ,"json":isJson(data)
        }
    );


}

function getCommand() {

    _setUpHttpRequest(

        {
            "method":"GET"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + docName
        }
    );

}

/*
 TESTS
 */


describe('PredixMobile API Tests::', function() {

    describe('Create and process a command::', function() {

        it("Create a command by posting to the local CouchDb", function () {

            pushCommand();
            expect(g_httpStatus).toEqual(201);
            expect(g_httpResponse.indexOf("true")).not.toEqual(-1);

        });

        it("Verify command can be retrieved from client couchDb", function () {

            getCommand();
            expect(g_httpStatus).toEqual(200);
            expect(g_httpResponse.indexOf(docName)).not.toEqual(-1);
        });

    });

});
