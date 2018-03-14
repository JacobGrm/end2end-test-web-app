/**
 * Created by 204071207 on 11/23/15.
 */

    /*

        EACH DOC WITH 2 FIELDS HAVING repeat(10000) WILL HAVE ~1.3 MB size

     */

    var couchBaseServicesHighLevel = LOCAL_COUCHDB_HIGH_LEVEL;

    var docType = "type_big_doc_size"+generateUniqueId();
    var issuedRequests = [];
    var docCount = 1600;

    // Should be ~1.3 MB
    var value1 = "Veniam commodo eu duis proident cillum ut exercitation.".repeat(10000);
    var value2 = "Reprehenderit est exercitation ipsum enim incididunt tempor minim nostrud do.".repeat(10000);


    function _setAsyncRequests(options, counter) {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {

            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {

                resetGlobalVar();

                g_httpResponse = xmlhttp.responseText;
                g_httpStatus = xmlhttp.status;
                issuedRequests.push(counter);
            }
        };

        xmlhttp.open(options.method, options.url, true);


        if(options.json === true) {

            xmlhttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xmlhttp.send( JSON.stringify(options.data) );

        } else if (options.json === false) {

            xmlhttp.setRequestHeader("Content-type","application/text;charset=UTF-8");
            xmlhttp.send(options.data);

        } else if (typeof  options.json === 'undefined') {

            xmlhttp.send();
        }

    };

    function createDocument(id, cnt) {

        var data = {
            "key1": value1,
            "key2": value2,
            "type": docType,
            "channels": ["entity_jacob_ge_com"]
        };

        _setAsyncRequests(

            {
                "method":"PUT"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
                ,"data":data
                ,"json":isJson(data)
            },cnt
        );
    };

    describe('Create big size doc (create_docs_big_size_json_string.js)::', function(){


        it("Create documents", function() {

            for (var i = 0; i < docCount; i++) {

                var docId = "qa_doc_" + generateUniqueId();
                createDocument(docId, i);
            }
        });

    });

