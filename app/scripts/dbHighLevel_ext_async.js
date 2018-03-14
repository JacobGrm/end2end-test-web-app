/**
 * Created by 204071207 on 11/23/15.
 */

var dbHighLevel_ext_async = dbHighLevel_ext_async || {};
dbHighLevel_ext_async.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();
    var docId_1 = "qa_doc_" + generateUniqueId();
    var docId_to_delete = "qa_doc_" + generateUniqueId();
    var docId_Not_included;

    var modified_doc_value1 = "value_" + generateUniqueId();
    var modified_doc_value2 = "value_" + generateUniqueId();

    var docType = "qa_type_"+generateUniqueId();


    describe('Additons to Couchbase management and other high-level capabilities (dbHighLevel_ext_async.js)::', function(){


        describe('Document Create with POST::', function() {

            it("Create document with POST with id as part of url",function(done){

                var inputDic = {
                    "key1": "value1",
                    "key2": "value2",
                    "type": docType
                };
                createDocumentPOST(inputDic,done,docId);

            });

            it("Verify status and returned JSON",function(){

                expect(g_httpStatus).toEqual(201,"Document create failed");

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId);

                expect(obj.key1).toEqual("value1");
                expect(obj.key2).toEqual("value2");

            });

            it("If URL does not include documentId, document will be created with random document id",function(done){

                var inputDic1 = {
                    "key3": "value3",
                    "key4": "value4",
                    "type": docType
                };
                createDocumentPOST(inputDic1,done);

            });

            it("Verify status and returned JSON for generated docid",function(){

                expect(g_httpStatus).toEqual(201,"Document create with generated id failed");

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).not.toEqual(undefined);

                expect(obj.key3).toEqual("value3");
                expect(obj.key4).toEqual("value4");

                docId_Not_included = obj._id;

            });

            it("If input dictionary contains a key '_id', this value will be used as the document id",function(done){

                var inputDic2 = {
                    "key4": "value4",
                    "key5": "value5",
                    "_id": docId_1,
                    "type": docType
                };
                createDocumentPOST(inputDic2,done);

            });

            it("Verify status and returned JSON for docid included in input DE38054 IOS",function(){

                expect(g_httpStatus).toEqual(201,"DE38054 IOS Document create with included id failed");

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId_1);

                expect(obj.key4).toEqual("value4");
                expect(obj.key5).toEqual("value5");

            });

            it("Get created document",function(done){

                getDocumentsAsync(docId_1,done);
            });

            it("Verify doc",function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId_1);

                expect(obj.key4).toEqual("value4");
                expect(obj.key5).toEqual("value5");
            });

            it("Attempt to create document having invalid json for input",function(done){


                var invalidJSON = ["test1","test2"];

                createDocumentPOST(invalidJSON,done);

            });

            it("Verify error status code after submitting request",function(){

                expect(g_httpStatus).toEqual(400,"Document create should fail with 400 bad request");

            });

        });

        describe("Document Modify with PUT - Replaces the contents of the document with the provided JSON dictionary ::", function() {

            it("Modify document with PUT",function(done){

                var inputDic = {
                    "key1": modified_doc_value1,
                    "key2": modified_doc_value2,
                    "type": docType
                };
                modifyDocumentPUT(docId,inputDic,done);

            });

            it("Verify status and returned JSON for modified document",function(){

                expect(g_httpStatus).toEqual(200,"Document modification failed");

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId);

                expect(obj.key1).toEqual(modified_doc_value1);
                expect(obj.key2).toEqual(modified_doc_value2);

            });


            it("Attepmpt to create document with PUT",function(done){

                var inputDic = {
                    "key1": modified_doc_value1,
                    "key2": modified_doc_value2,
                    "type": docType
                };
                modifyDocumentPUT(docId+"_123",inputDic,done);

            });

            it("Verify status showing doc not found - only modification allowed",function(){

                expect(g_httpStatus).toEqual(404,"Document creation not allowed");

            });

        });


        describe("Delete document::",function(){

            it("Pre-requisite - create document first",function(done){

                var inputDic = {
                    "key": "Doc to be deleted"
                };
                createDocumentPOST(inputDic,done,docId_to_delete);
            });

            it("Attempt to delete non existing doc", function(done){

                deleteDocument("doc_not_there",done);
            });

            it("Verify error",function(){

                expect(g_httpStatus).toEqual(404, "404 status is expected");

            });

            it("Attempt to delete existing doc", function(done){

                deleteDocument(docId_to_delete,done);
            });

            it("Verify delete success",function(){

                expect(g_httpStatus).toEqual(200, "200 status is expected");
            });
        });

        describe("Post test: Verify all created/modified/deleted documents",function(){

            it("Get document 1",function(done){

                getDocumentsAsync(docId,done);
            });

            it("Verify doc 1",function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId);

                expect(obj.key1).toEqual(modified_doc_value1);
                expect(obj.key2).toEqual(modified_doc_value2);
            });

            it("Get document 2",function(done){

                getDocumentsAsync(docId_1,done);
            });

            it("Verify doc 2 DE38054 IOS",function(){

                var obj = JSON.parse(g_httpResponse, "Parsing JSON failed DE38054 IOS");
                expect(obj._id).toEqual(docId_1);

                expect(obj.key4).toEqual("value4");
                expect(obj.key5).toEqual("value5");
            });

            it("Get document 3",function(done){

                getDocumentsAsync(docId_Not_included,done);
            });

            it("Verify doc 3",function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId_Not_included);

                expect(obj.key3).toEqual("value3");
                expect(obj.key4).toEqual("value4");
            });

            it("Get document 4",function(done){

                getDocumentsAsync(docId_to_delete,done);
            });

            it("Verify doc 4",function(){

                expect(g_httpStatus).toEqual(404,"Document should have been deleted");
            });

        });

        describe("Attempt to re-create deleted document",function(){

            var inputDic_del = {
                "key1": "value_"+generateUniqueId(),
                "key2": "value_"+generateUniqueId(),
                "type": docType
            };

            it("Create document with POST",function(done){

                createDocumentPOST(inputDic_del,done,docId_to_delete);

            });

            it("Verify doc created successfully",function(){

                expect(g_httpStatus).toEqual(201,"Document creation failed");

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId_to_delete);

                expect(obj.key1).toEqual(inputDic_del.key1);
                expect(obj.key2).toEqual(inputDic_del.key2);

            });

            it("Get re-created document",function(done){

                getDocumentsAsync(docId_to_delete,done);
            });

            it("Verify re-created doc",function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId_to_delete);

                expect(obj.key1).toEqual(inputDic_del.key1);
                expect(obj.key2).toEqual(inputDic_del.key2);
            });

        });

    });

})();