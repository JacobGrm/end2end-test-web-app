/*

        Created by Clifton G
 */


var docName = "command_multi_" + randomNumber(100,1000);

function test1() {

    var data = {
        "type": "command",
        "~userid": "user1",
        "channels": ["entity_user1"],
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
            ,"url":LOCAL_COUCHDB_LOW_LEVEL + docName
            ,"data":data
            ,"json":isJson(data)
        }
    );


}

function test2() {

    _setUpHttpRequest(

        {
            "method":"GET"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL + docName
        }
    );

}

/*
 TESTS
 */


describe('PredixMobile API Tests::', function() {

    describe('Create and process a command::', function() {

        it("Create a command by posting to the local CouchDb", function () {

            test1();
            expect(g_httpStatus).toEqual(201);
            expect(g_httpResponse.indexOf("true")).not.toEqual(-1);

        });

        it("Verify command synced to the backend, processed and sycned back to the client", function () {

            test2();
            expect(g_httpStatus).toEqual(200);
            expect(g_httpResponse.indexOf(docName)).not.toEqual(-1);
        });

    });

});
