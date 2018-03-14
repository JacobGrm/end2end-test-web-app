/**
 * Created by 204071207 on 5/31/17.
 */


var bulkDocumentEdit_async = bulkDocumentEdit_async || {};
bulkDocumentEdit_async.subns = (function() {


    var doc1 = "Lexus_"+generateUniqueId();
    var doc2 = "Chevy_"+generateUniqueId();
    var doc3 = "Jeep_"+generateUniqueId();

    var bulkCreateReturn;
    var bulkModifyReturn;
    var bulkModifyAfterDeleteRetrun;
    var singleModifiedDocReturn;
    var singleDocDeleteReturn;

    //function createDocumentsBulkAsync(data, callback) {
    //
    //    _setUpHttpRequestAsync(
    //
    //        {
    //            "method":"POST"
    //            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + "_bulk_docs"
    //            ,"data":data
    //            ,"json":isJson(data)
    //        },callback
    //    );
    //};

    function deleteDocument(id,rev,callback) {

        var data = encodeURI(id+"?rev="+rev);

        _setUpHttpRequestAsync(

            {
                "method":"DELETE"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + data
            },callback
        );
    };


    describe("Bulk document editing (bulkDocumentEdit_async.js)::",function(){

        describe("Create muliple documents",function(){


            it("Create multiple documents in bulk",function(done){

                var documents = {

                    "docs": [
                        {
                            "_id": doc1,
                            "description": "Bulk doc editing test"
                        },
                        {
                            "_id": doc2,
                            "description": "Bulk doc editing test"
                        },
                        {
                            "_id": doc3,
                            "description": "Bulk doc editing test"
                        }
                    ]
                }

                createDocumentsBulkAsync(documents,done);

            });

            it("Verify documents successfully created", function () {

                bulkCreateReturn = JSON.parse(g_httpResponse);
                expect(g_httpStatus).toEqual(201);
            });

        });


        describe("Modify doc #2 out of 3 documents created by bulk",function(){

            it("Get document 2 to create a revision",function(done){

                getDocumentsAsync(doc2,done);

            });

            it("Create doc #2 revision",function(done){

                var dataDoc2 = JSON.parse(g_httpResponse);
                dataDoc2.description = "Modifed text";

                createCbDocumentAsync(doc2,dataDoc2,done);
            });

            it("Verify document successfully modified", function () {

                expect(g_httpStatus).toEqual(201);
                singleModifiedDocReturn = JSON.parse(g_httpResponse);
            });

        });


        describe("Modify all documents with bulk after one of the documents was changed separetely",function(){

            it("Do bulk document modification",function(done){

                var documentsModified = {

                    "docs": [
                        {
                            "_id": doc1,
                            "_rev": bulkCreateReturn[0].rev,
                            "description": "Bulk doc modify"
                        },
                        {
                            "_id": doc2,
                            "_rev": singleModifiedDocReturn.rev,
                            "description": "Bulk doc modify"
                        },
                        {
                            "_id": doc3,
                            "_rev": bulkCreateReturn[2].rev,
                            "description": "Bulk doc modify"
                        }
                    ]
                }

                createDocumentsBulkAsync(documentsModified,done);
            });

            it("Verify documents successfully modified", function () {

                expect(g_httpStatus).toEqual(201);
                // save response to get revision number later
                bulkModifyReturn = JSON.parse(g_httpResponse);
            });

        });

        describe("Attempt to edit docs in bulk after one of the docs deleted",function(){

            it("Delete doc #2 out of all bulk created docs",function(done){

                deleteDocument(doc2,bulkModifyReturn[1].rev,done);

            });

            it("Verify document successfully deleted", function () {

                expect(g_httpStatus).toEqual(200);
                singleDocDeleteReturn = JSON.parse(g_httpResponse);
            });

            it("Do bulk document modification again",function(done){

                var documentsModified_1 = {

                    "docs": [
                        {
                            "_id": doc1,
                            "_rev": bulkModifyReturn[0].rev,
                            "description": "Bulk doc modify after deleted"
                        },
                        {
                            "_id": doc2,
                            "_rev": singleDocDeleteReturn.rev,
                            "description": "Bulk doc modify after deleted"
                        },
                        {
                            "_id": doc3,
                            "_rev": bulkModifyReturn[2].rev,
                            "description": "Bulk doc modify after deleted"
                        }
                    ]
                }

                createDocumentsBulkAsync(documentsModified_1,done);
            });

            it("Verify update was successful (deleted document restored)",function(){

                expect(g_httpStatus).toEqual(201);
                bulkModifyAfterDeleteRetrun = JSON.parse(g_httpResponse);
            });

        });


        describe("Delete all documents in bulk",function(){

            it("Delete multiple docs",function(done){

                var documentsToDelete = {

                    "docs": [
                        {
                            "_id": doc1,
                            "_rev": bulkModifyAfterDeleteRetrun[0].rev,
                            "_deleted": true,
                            "description": "Bulk doc delete"
                        },
                        {
                            "_id": doc2,
                            "_rev": bulkModifyAfterDeleteRetrun[1].rev,
                            "_deleted": true,
                            "description": "Bulk doc delete"
                        },
                        {
                            "_id": doc3,
                            "_rev": bulkModifyAfterDeleteRetrun[2].rev,
                            "_deleted": true,
                            "description": "Bulk doc delete"
                        }
                    ]
                }

                createDocumentsBulkAsync(documentsToDelete,done);

            });

            it("Verify deletion was successful",function(){

                expect(g_httpStatus).toEqual(201);
            });

            it("Attempt to get deleted doc",function(done){

                getDocumentsAsync(doc1,done);
            });

            it("Verify doc is not accessible",function(){

                expect(g_httpStatus).toEqual(404);
            });

        });


    });

})();