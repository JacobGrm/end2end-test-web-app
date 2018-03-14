/**
 * Created by 204071207 on 1/12/16.
 */


//   Reference:
//   https://wiki.apache.org/couchdb/HTTP_Document_API
//   GET /somedatabase/_all_docs?startkey="doc2"&endkey="doc3" HTTP/1.0

var startEndKeyLimits_async = startEndKeyLimits_async || {};
startEndKeyLimits_async.subns = (function() {

    var keyValue = new Date().getTime();

    /** Document's ID and Key ARE STRINGS **/

    var docName1_str = String(keyValue+1);
    var docName2_str = String(keyValue+2);
    var docName3_str = String(keyValue+3);
    var docName4_str = String(keyValue+4);
    var docName5_str = String(keyValue+5);


    var docData1_str = {
        "key": docName1_str
    };
    var docData2_str = {
        "key": docName2_str
    };
    var docData3_str = {
        "key": docName3_str
    };
    var docData4_str = {
        "key": docName4_str
    };
    var docData5_str = {
        "key": docName5_str
    };

    /** Document's ID and Key ARE NUMBERS **/

    var tmp = new Date();
    var keyValue_nbr = tmp.setMonth(tmp.getMonth()+1);

    var docName1 = keyValue_nbr+1;
    var docName2 = keyValue_nbr+2;
    var docName3 = keyValue_nbr+3;
    var docName4 = keyValue_nbr+4;
    var docName5 = keyValue_nbr+5;


    var docData1 = {
        "key": docName1
    };
    var docData2 = {
        "key": docName2
    };
    var docData3 = {
        "key": docName3
    };
    var docData4 = {
        "key": docName4
    };
    var docData5 = {
        "key": docName5
    };

    /*** Define filters ****/

    var startEndFilter = 'startkey="'+docData2.key+'"&endkey="'+docData4.key+'"';
    var startEndFilter_str = 'startkey="'+docData2_str.key+'"&endkey="'+docData5_str.key+'"';
    var filterAllDocs = '_all_docs';

    function pollingCallback(){

        console.log("pollingCallback: "+ g_httpResponse);
    }

    /**** TESTS *****/


    describe("Create test documents (startEndKeyLimits_async.js)::",function(){

        var origTotalRows = 0;

        it("Ask for total number of documents",function(done){

            getDocumentsAsync("_all_docs",done);
        });

        it("Save number in a variable",function(){

            expect(g_httpResponse).not.toEqual(0);
            origTotalRows = JSON.parse(g_httpResponse).total_rows;

        });

        it("Send multiple requests and poll till all docs created", function (done) {

            createCbDocumentAsync(docData1.key,docData1, pollingCallback);
            createCbDocumentAsync(docData2.key,docData2, pollingCallback);
            createCbDocumentAsync(docData3.key,docData3, pollingCallback);
            createCbDocumentAsync(docData4.key,docData4, pollingCallback);
            createCbDocumentAsync(docData5.key,docData5, pollingCallback);

            createCbDocumentAsync(docData1_str.key,docData1_str, pollingCallback);
            createCbDocumentAsync(docData2_str.key,docData2_str, pollingCallback);
            createCbDocumentAsync(docData3_str.key,docData3_str, pollingCallback);
            createCbDocumentAsync(docData4_str.key,docData4_str, pollingCallback);
            createCbDocumentAsync(docData5_str.key,docData5_str, pollingCallback);

            poll(
                function() {

                    getDocumentsAsync("_all_docs",pollingCallback);
                    return (JSON.parse(g_httpResponse).total_rows - origTotalRows)==10;
                },
                function() {
                    expect((JSON.parse(g_httpResponse).total_rows - origTotalRows)).toEqual(10);
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

    });

    describe('Filtering the documents in database to find those relevant to a particular range (startEndKeyLimits_async.js)::',function(){


        it("Fetch subset of documents from local couchDb with startkey/endkey. Document's ID and Key ARE NUMBERS",function(done){

            getDocumentsAsync(filterAllDocs +"?"+startEndFilter, done);
        });

        it("Verify only 3 documents are in a filtered set", function(){

            console.log("Verify only 3 docs: "+g_httpResponse);

            var ret = JSON.parse(g_httpResponse);
            expect(ret.total_rows).toEqual(3, "Number of rows in filtered set is not 3");
        });


        it("Fetch subset of documents from local couchDb with startkey/endkey. Document's ID and Key ARE STRINGS",function(done){

            getDocumentsAsync(filterAllDocs +"?"+startEndFilter_str, done);
        });

        it("Verify only 4 documents are in a filtered set", function(){

            console.log("Verify only 4 docs: "+g_httpResponse);

            var ret1 = JSON.parse(g_httpResponse);
            expect(ret1.total_rows).toEqual(4, "Number of rows in filtered set is not 4");
        });

    });

})();


