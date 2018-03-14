/**
 * Created by 204071207 on 1/12/16.
 */


//   Reference:
//   https://wiki.apache.org/couchdb/HTTP_Document_API
//   GET /somedatabase/_all_docs?startkey="doc2"&endkey="doc3" HTTP/1.0

var startEndKeyLimits = function(){


    var keyValue = new Date().getTime();

    /** Document's ID and Key ARE STRINGS **/

    var key1_str = String(keyValue+1);
    var key2_str = String(keyValue+2);
    var key3_str = String(keyValue+3);
    var key4_str = String(keyValue+4);
    var key5_str = String(keyValue+5);


    var docData1_str = {
        "key": key1_str
    };
    var docData2_str = {
        "key": key2_str
    };
    var docData3_str = {
        "key": key3_str
    };
    var docData4_str = {
        "key": key4_str
    };
    var docData5_str = {
        "key": key5_str
    };

    var docName1_str = key1_str;
    var docName2_str = key2_str;
    var docName3_str = key3_str;
    var docName4_str = key4_str;
    var docName5_str = key5_str;


    /** Document's ID and Key ARE NUMBERS **/

    var tmp = new Date();
    var keyValue_nbr = tmp.setMonth(tmp.getMonth()+1);

    var key1 = keyValue_nbr+1;
    var key2 = keyValue_nbr+2;
    var key3 = keyValue_nbr+3;
    var key4 = keyValue_nbr+4;
    var key5 = keyValue_nbr+5;


    var docData1 = {
        "key": key1
    };
    var docData2 = {
        "key": key2
    };
    var docData3 = {
        "key": key3
    };
    var docData4 = {
        "key": key4
    };
    var docData5 = {
        "key": key5
    };

    var docName1 = key1;
    var docName2 = key2;
    var docName3 = key3;
    var docName4 = key4;
    var docName5 = key5;

    /*** Define filters ****/

    var startEndFilter = 'startkey="'+docData2.key+'"&endkey="'+docData4.key+'"';
    var startEndFilter_str = 'startkey="'+docData2_str.key+'"&endkey="'+docData5_str.key+'"';
    var filterAllDocs = '_all_docs';


    function createDocumentSet_str(){

        console.log("createDocumentSet_str Called....");

        createCbDocument(docName1_str,docData1_str);
        createCbDocument(docName2_str,docData2_str);
        createCbDocument(docName3_str,docData3_str);
        createCbDocument(docName4_str,docData4_str);
        createCbDocument(docName5_str,docData5_str);

    };

    function createDocumentSet(){

        console.log("createDocumentSet Called....");

        createCbDocument(docName1,docData1);
        createCbDocument(docName2,docData2);
        createCbDocument(docName3,docData3);
        createCbDocument(docName4,docData4);
        createCbDocument(docName5,docData5);

    };

    createDocumentSet();
    createDocumentSet_str();


    /**** TESTS *****/

    describe('Filtering the documents in database to find those relevant to a particular range (startEndKeyLimits.js)::',function(){


        it("Fetch subset of documents from local couchDb with startkey/endkey. Document's ID and Key ARE NUMBERS",function(){

            getDocuments(filterAllDocs +"?"+startEndFilter);
            var ret = JSON.parse(g_httpResponse);
            expect(ret.total_rows).toEqual(3);
        });

        it("Fetch subset of documents from local couchDb with startkey/endkey. Document's ID and Key ARE STRINGS",function(){

            getDocuments(filterAllDocs +"?"+startEndFilter_str);
            var ret = JSON.parse(g_httpResponse);
            expect(ret.total_rows).toEqual(4);
        });

    });

}();


