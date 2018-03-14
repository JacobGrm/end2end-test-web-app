/**
 * Created by 204071207 on 11/23/15.
 */

var dataAccessHighLevel_async = dataAccessHighLevel_async || {};
dataAccessHighLevel_async.subns = (function() {

    var replicationStatusNoErrorValues = ["Active", "Idle"];

    var docId = "qa_doc_" + generateUniqueId();
    var docType = "qa_type_"+generateUniqueId();


    function createDocument(id, callback) {

        var data = {
            "key1": "value1",
            "key2": "value2",
            "type": docType
        };

        _setUpHttpRequestAsync(

            {
                "method":"PUT"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
                ,"data":data
                ,"json":isJson(data)
            },callback
        );
    };

    function retrieveDocument(id, callback) {


        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":LOCAL_COUCHDB_HIGH_LEVEL + "document/" + id
            },callback
        );
    };


    function getDocumentByType(type,callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":LOCAL_COUCHDB_HIGH_LEVEL + "type/"+type
            },callback
        );

    };


    describe('Couchbase management and other high-level capabilities (dataAccessHighLevel_async.js)::', function(){

        describe('Replication configuration::', function(){

            beforeAll(function(done) {

                getReplicationConfiguration(done);
            });


            it('Replication PUSH and PULL status should be Active or Idle if no replication is occuring. LastErrorCode should be undefined', function(){

                console.log("REPLICATION CONFIGURATION: "+g_httpResponse);

                expect(g_httpResponse.length >= 1).toBeTruthy("Error fetching Replication configuration (DE7758 Electron)");

                var obj = JSON.parse(g_httpResponse);

                expect(replicationStatusNoErrorValues.indexOf(obj.pull.status)).not.toEqual(-1, "replication configuration pull value wrong (DE7758 Electron)");
                expect(replicationStatusNoErrorValues.indexOf(obj.push.status)).not.toEqual(-1, "replication configuration push value wrong (DE7758 Electron)");

            });
        });


        describe('Document: create, retrieve (dataAccessHighLevel_async.js)::', function() {

            beforeAll(function(done) {

                createDocument(docId,done);
            });

            it("Issue a call to retrieve created document", function(done){

                retrieveDocument(docId,done);
            });


            it('Read and verify document', function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId);

                expect(obj.key1).toEqual("value1");
                expect(obj.key2).toEqual("value2");
            });

        });

        describe("Document retrieval by type::",function(){

            beforeAll(function(done) {

                getDocumentByType(docType,done);

            });

            it('Verify Document retrieval by type', function(){


                var obj = JSON.parse(g_httpResponse);
                var docFound = obj.length >=1;
                expect(docFound).toEqual(true);
            });
        });

    });

})();