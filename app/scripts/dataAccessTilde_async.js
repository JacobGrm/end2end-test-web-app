/**
 * Created by 204071207 on 11/23/15.
 */

var dataAccessTilde_async = dataAccessTilde_async || {};
dataAccessTilde_async.subns = (function() {


    var docIdTilde = "qa_doc_" + generateUniqueId();
    var couchBaseServicesHighLevelTilde = "~"+"/";

    function retrieveDocumentTilde(id, callback) {


        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":COUCHDB_HIGH_LEVEL+couchBaseServicesHighLevelTilde + "document/" + id
            },callback
        );
    };

    function getReplicationConfigurationTilde(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":COUCHDB_HIGH_LEVEL+couchBaseServicesHighLevelTilde +"replication"
            },callback
        );
    };


    describe("Tilde should be recognized as a replacement for DB name (dataAccessTilde_async.js)::", function() {


        beforeAll(function(done){

            var data = {
                "key1": "value1",
                "key2": "value2"
            };

            createCbDocumentAsync(docIdTilde,data,done);
        });

        it("Create document returns 201 status",function(){

            expect(g_httpStatus).toEqual(201);
        });

        it("Retrieve document using tilde for db name",function(done){

            retrieveDocumentTilde(docIdTilde,done);
        });

        it("Verify getting document success",function(){

            var obj = JSON.parse(g_httpResponse);
            expect(obj._id).toEqual(docIdTilde);
        });

        it("Fetch replication configuration using tilde",function(done){

            getReplicationConfigurationTilde(done);
        });

        it('Verify fetching replication configuration with tilde', function(){

            expect(g_httpResponse.length >= 1).toBeTruthy("Error fetching Replication configuration with tilde (DE7758 Electron)");

            var obj = JSON.parse(g_httpResponse);

            console.log("Replication configuration with tilde: "+ obj);

            expect(obj.pull.status).not.toBeUndefined();
            expect(obj.push.status).not.toBeUndefined();

        });

    });

})();