/**
 * Created by 204071207 on 11/23/15.
 */

var document_long_string_value_async = document_long_string_value_async || {};
document_long_string_value_async.subns = (function() {



    var docId = "qa_doc_" + generateUniqueId();
    var docType = "qa_type_"+generateUniqueId();

    var value_255_chars = "123456789012345678@#901&23456789012cdb3456789012345678901234567123456789012345678@#901&23456789012cdb3456789012345678901234567123456789012345678@#901&23456789012cdb3456789012345678901234567123456789012345678@#901&23456789012cdb3456789012345678901234567";

    function createDocument(id, callback) {

        var data = {
            "key1": value_255_chars,
            "key2": "value2",
            "type": docType,
            "channels": ["entity_jacob_ge_com"]
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


    describe('Create doc with field filled with long string (document_long_string_value_async.js)::', function(){


            beforeAll(function(done) {

                createDocument(docId,done);
            });

            it("Issue a call to retrieve created document", function(done){

                retrieveDocument(docId,done);
            });


            it('Read and verify document', function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId);

                expect(obj.key1).toEqual(value_255_chars);
                expect(obj.key2).toEqual("value2");
            });

    });

})();
