/*

 Created by Clifton G
 */

var documentsResultSetFilters = documentsResultSetFilters || {};
documentsResultSetFilters.subns = (function() {


    var docName1 = "qa_doc_" + generateUniqueId();
    var docName2 = "qa_doc_" + generateUniqueId();

    var docDataValue1 = generateUniqueId();
    var docDataValue2 = generateUniqueId();

    var filterIncludeDocs = "include_docs=true";
    var filterAllDocs = "_all_docs";

    var docData = {
        "key1": docDataValue1,
        "key2": docDataValue2
    };

    function createTestDocuments() {

        createCbDocument(docName1, docData);
        createCbDocument(docName2, docData);
    };

    createTestDocuments();


    /*
     TESTS
     */


    describe('CouchDb documents filtering (documentsResultSetFilters.js)::', function () {


        it("Query all documents in local CouchDb using '_all_docs' filter. " +
            "Documents id's SHOULD BE fetched. Documents values SHOULD NOT be fetched", function () {

            getDocuments(docName1);
            expect(g_httpStatus).not.toEqual(404);
            getDocuments(docName2);
            expect(g_httpStatus).not.toEqual(404);

            getDocuments(filterAllDocs);
            expect(g_httpStatus).toEqual(200);
            var ret1 = JSON.stringify(g_httpResponse);

            //Documents values should not be fetched
            expect(ret1.indexOf(docDataValue1)).toEqual(-1);
            expect(ret1.indexOf(docDataValue2)).toEqual(-1);

            //Documents ID's should be fetched
            expect(ret1.indexOf(docName1)).not.toEqual(-1);
            expect(ret1.indexOf(docName2)).not.toEqual(-1);

        });



        it("Query all documents in local CouchDb using 'include_docs=true' filter. " +
            "Documents id's along with Documents values SHOULD BE fetched", function () {

            getDocuments(filterAllDocs + "?" + filterIncludeDocs);
            expect(g_httpStatus).toEqual(200);
            var ret2 = JSON.stringify(g_httpResponse);

            //Documents ID's should be fetched
            expect(ret2.indexOf(docName1)).not.toEqual(-1);
            expect(ret2.indexOf(docName2)).not.toEqual(-1);

            //Documents values should be fetched
            expect(ret2.indexOf(docDataValue1)).not.toEqual(-1);
            expect(ret2.indexOf(docDataValue2)).not.toEqual(-1);

        });

        it("Query specific document in local CouchDb. No filters attached." +
            "Documents id's along with Documents values SHOULD BE fetched", function () {

            getDocuments(docName1);
            expect(g_httpStatus).toEqual(200);
            var ret2 = JSON.stringify(g_httpResponse);

            //Documents ID's should be fetched
            expect(ret2.indexOf(docName1)).not.toEqual(-1, "Documents ID's should be fetched for docName1");

            //Documents values should be fetched
            expect(ret2.indexOf(docDataValue1)).not.toEqual(-1, "Documents values should be fetched for docName1");

        });

    });

})();