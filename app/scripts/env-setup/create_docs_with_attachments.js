/**
 * Created by 204071207 on 11/23/15.
 */


    /*

        SCRIPT HAS PROBLEMS AND FOR THE TIME BEING REPLACED WITH SYNC VERSION

     */

    var imagesUrl = "https://qa-project-1.run.aws-usw02-pr.ice.predix.io/img/qaImage";

    var couchBaseServicesHighLevel = LOCAL_COUCHDB_HIGH_LEVEL;
    var documents = [];
    var issuedRequests = [];
    var counterAttachments = 0;
    var docCountMax = 385;


//****

    var missedDocs = [
            "150.jpg"
        ];
//***


    function _setUpHttpAsyncRequest(options, counter) {

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
            "key1": "value1",
            "key2": "value2",
            "type": "doc_Jan_10",
            "channels": ["entity_jacob_ge_com"]
        };

        _setUpHttpAsyncRequest(

            {
                "method":"PUT"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
                ,"data":data
                ,"json":isJson(data)
            }, cnt
        );
    };



    function getAttachmentAbsolutePath(attachmentRelativePath) {

        var list = window.location.href.split("/");
        list.pop(); // remove "index.html"
        list.push(attachmentRelativePath)
        var finalURL = list.join("/");

        return finalURL;

    };

    function addDocumentAttachment(id, data, cnt) {


        _setUpHttpAsyncRequest(

            {
                "method":"POST"
                ,"url":couchBaseServicesHighLevel + "attachments/" + id
                ,"data":data
                ,"json":isJson(data)
            }, cnt
        );
    };

    describe('Document: create, retrieve, add attachment (create_docs_with_attachments.js)::', function(){

        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 36000000;

            for(var n=0; n<docCountMax; n++){

                var docId = "qa_DocAttachment_"+generateUniqueId();
                documents.push(docId);
            }
        });

        it("Create number of documents", function(done) {

            for (var i = 0; i < docCountMax; i++) {

                createDocument(documents[i], i);
            }

            poll(
                function() {

                    return issuedRequests.length === docCountMax;
                },
                function() {

                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                60000, //timeout
                1000   //interval
            );

        });


        it("Add attachment to each document", function() {

            //for (var n = 0; n < documents.length+1; n++) {
            //for (var n = 0; n < missedDocs.length; n++) {
            for (var n = 0; n < docCountMax; n++) {

                addDocumentAttachment(documents[n], {
                    //"contenttype": "application/zip",
                    "contenttype": "image/jpeg",
                    //"url": imagesUrl+(n+301)+".jpg"
                    "url": imagesUrl+"0"+".jpg"
                }, counterAttachments);

            }
        });


        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

