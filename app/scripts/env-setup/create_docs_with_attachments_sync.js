/**
 * Created by 204071207 on 11/23/15.
 */


    var couchBaseServicesHighLevel = LOCAL_COUCHDB_HIGH_LEVEL;

    var documents = [];
    var docCountMax = 2000;


    function createDocument(id) {

        var data = {
            "key1": "value1",
            "key2": "value2",
            "type": "docWithAttachment_8",
            "channels": ["entity_jacob_ge_com"]
        };

        _setUpHttpRequest(

            {
                "method":"PUT"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
                ,"data":data
                ,"json":isJson(data)
            }
        );
    };



    function getAttachmentAbsolutePath(attachmentRelativePath) {

        var list = window.location.href.split("/");
        list.pop(); // remove "index.html"
        list.push(attachmentRelativePath)
        var finalURL = list.join("/");

        return finalURL;

    };

    function addDocumentAttachment(id, data) {


        _setUpHttpRequest(

            {
                "method":"POST"
                ,"url":couchBaseServicesHighLevel + "attachments/" + id
                ,"data":data
                ,"json":isJson(data)
            }
        );

    };


    describe('Create any number of documents with attachments::', function() {

        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        });

        it("Create few documents", function(){

            for(var n=0; n<docCountMax; n++){

                var docId = "qa_DocAttachment_"+generateUniqueId();
                documents.push(docId);
            }

            for (var i = 0; i < docCountMax; i++) {

                createDocument(documents[i]);
                expect(g_httpStatus).toEqual(201);
            }
        });

        it("Add attachment to each document", function() {

            for (var n = 0; n < documents.length; n++) {

                addDocumentAttachment(documents[n], {
                    "contenttype": "application/zip",
                    "url": getAttachmentAbsolutePath("res/package_big.zip")
                });

                console.log("Adding attachment to doc #: "+n);

                expect(g_httpStatus).toEqual(201);

            }
        });

        // Reset timeout to original value
        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });


