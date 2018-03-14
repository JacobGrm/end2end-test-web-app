/*

 Created by Clifton G
 */

var documentsResultSetFilters_async = documentsResultSetFilters_async || {};
documentsResultSetFilters_async.subns = (function() {


    var docName1 = "qa_doc_" + generateUniqueId();
    var docName2 = "qa_doc_" + generateUniqueId();

    var docs = [docName1, docName2];

    var docDataValue1 = generateUniqueId();
    var docDataValue2 = generateUniqueId();

    var filterIncludeDocs = "include_docs=true";
    var filterAllDocs = "_all_docs";

    var docData = {
        "key1": docDataValue1,
        "key2": docDataValue2
    };


    var counter = [];

    function updateCounter(count){

        counter.push(count);
    };

    function createTestDocuments() {

        for(var i = 0; i<docs.length; i++){

            createCbDocumentAsync(docs[i], docData, updateCounter(i));
        }

    };


    /*
     TESTS
     */


    describe('CouchDb documents filtering (documentsResultSetFilters_async.js)::', function () {

        // Don't start tests before documents created
        beforeAll(function(done) {

            poll(
                function() {

                    createTestDocuments();
                    return counter.length === 2;
                },
                function() {
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Polling error....");
                    done();
                },
                30000, //timeout
                1000   //interval
            );
        });

        it("Fetch docName1",function(done){

            poll(
                function() {

                    getDocumentsAsync(docName1);
                    return g_httpStatus === 200;
                },
                function() {
                    expect(g_httpStatus).not.toEqual(404);
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Polling error....");
                    done();
                },
                30000, //timeout
                1000   //interval
            );
        });

        it("Verify docName1 created", function(){

            expect(g_httpStatus).not.toEqual(404);
        });

        it("Fetch docName2",function(done){

            getDocumentsAsync(docName2, done);
        });

        it("Verify docName2 created", function(){

            expect(g_httpStatus).not.toEqual(404);
        });

        it("Fetch all document using _all_docs filter", function(done){

            getDocumentsAsync(filterAllDocs, done);
        });

        it("Documents id's SHOULD BE fetched. Documents values SHOULD NOT be fetched", function () {

            expect(g_httpStatus).toEqual(200);
            var ret1 = JSON.stringify(g_httpResponse);

            //Documents ID's should be fetched
            expect(ret1.indexOf(docName1)).not.toEqual(-1, "Document ID for docName1 should be fetched");
            expect(ret1.indexOf(docName2)).not.toEqual(-1, "Document ID for docName2 should be fetched");

            //Documents values should not be fetched
            expect(ret1.indexOf(docDataValue1)).toEqual(-1, "Documents values for docDataValue1 should not be fetched");
            expect(ret1.indexOf(docDataValue2)).toEqual(-1, "Documents values for docDataValue2 should not be fetched");

        });

        it("Query all documents in local CouchDb using 'include_docs=true' filter. ",function(done){

            getDocumentsAsync(filterAllDocs + "?" + filterIncludeDocs, done);
        });

        it("Documents id's along with Documents values SHOULD BE fetched", function () {


            expect(g_httpStatus).toEqual(200);
            var ret2 = JSON.stringify(g_httpResponse);

            //Documents ID's should be fetched
            expect(ret2.indexOf(docName1)).not.toEqual(-1);
            expect(ret2.indexOf(docName2)).not.toEqual(-1);

            //Documents values should be fetched
            expect(ret2.indexOf(docDataValue1)).not.toEqual(-1);
            expect(ret2.indexOf(docDataValue2)).not.toEqual(-1);

        });

        it("Query specific document in local CouchDb. No filters attached.",function(done){

            getDocumentsAsync(docName1,done);
        });

        it("Documents id's along with Documents values SHOULD BE fetched", function () {

            expect(g_httpStatus).toEqual(200);
            var ret2 = JSON.stringify(g_httpResponse);

            //Documents ID's should be fetched
            expect(ret2.indexOf(docName1)).not.toEqual(-1, "Documents ID's should be fetched for docName1");

            //Documents values should be fetched
            expect(ret2.indexOf(docDataValue1)).not.toEqual(-1, "Documents values should be fetched for docName1");

        });

    });

})();