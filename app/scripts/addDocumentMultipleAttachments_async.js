/**
 * Created by 204071207 on 11/23/15.
 */

var addDocumentMultipleAttachments_async = addDocumentMultipleAttachments_async || {};
addDocumentMultipleAttachments_async.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();
    var docType = "qa_type_attachment_from_url";
    var attachmentUrl = "https://qa-project-1.run.aws-usw02-pr.ice.predix.io/img/qaImage0.jpg";
    var attachmentUrl_1 = "https://qa-project-1.run.aws-usw02-pr.ice.predix.io/img/qaImage1.jpg";
    var originalTimeout;


    function createDocument(id, callback) {

        var data = {
            "key1": "value1",
            "key2": "value2",
            "type": docType
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

    function addDocumentAttachment(id, data, callback) {


        _setUpHttpRequestAsync(

            {
                "method":"POST"
                ,"url":LOCAL_COUCHDB_HIGH_LEVEL + "attachments/" + id
                ,"data":data
                ,"json":isJson(data)
            },callback
        );

    };

    function retrieveDocumentAttachment(id,callback) {


        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":LOCAL_COUCHDB_HIGH_LEVEL + "attachments/" + id

            },callback
        );

    };

    describe("Add multiple attachemnt to document (addDocumentMultipleAttachments_async.js)::",function() {


        describe('Add 2 attachemnts (downloaded from url) to document::', function () {

            beforeAll(function (done) {

                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

                createDocument(docId, done);
            });

            it("Request document attachments where none was added", function (done) {

                retrieveDocumentAttachment(docId, done);
            });

            it('Where there are not attachments to document - returns 404 code', function () {

                expect(g_httpStatus).toEqual(404);
            });

            it("Add 1-st attachment to document", function (done) {

                g_httpResponse="";
                addDocumentAttachment(docId, {
                    "contenttype": "image/jpeg",
                    "url": attachmentUrl
                }, done);

            });

            it("Wait to allow attachment processed",function(done){

                poll(
                    function() {

                        return g_httpResponse.indexOf("_attachments") > 0;

                    },
                    function() {

                        expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1);
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                        done();
                    },
                    jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                    1000   //interval
                );

            });


            it("Add 2-nd attachment to document", function (done) {

                g_httpResponse="";
                addDocumentAttachment(docId, {
                    "contenttype": "image/jpeg",
                    "url": attachmentUrl_1
                }, done);

            });

            it("Wait to allow attachment processed",function(done){

                poll(
                    function() {

                        return g_httpResponse.indexOf("_attachments") > 0;

                    },
                    function() {

                        expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1);
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                        done();
                    },
                    jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                    1000   //interval
                );

            });


            it('Adding attachment to document returns 201 code', function () {

                expect(g_httpStatus).toEqual(201);
                expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1, "String _attachments not found");
                expect(g_httpResponse.indexOf("qaImage0.jpg")).not.toEqual(-1, "Name of 1-st attachment not found");
                expect(g_httpResponse.indexOf("qaImage1.jpg")).not.toEqual(-1, "Name of 2-nd attachment not found");
            });

            it("Request document attachments", function (done) {

                retrieveDocumentAttachment(docId, done);
            });

            it('Verifiy document attachment path', function () {

                var obj = JSON.parse(g_httpResponse);
                expect(obj.attachments_path.indexOf(docId)).not.toEqual(-1);

                expect(g_httpStatus).toEqual(200);
                expect(g_httpResponse.indexOf("attachments_path")).not.toEqual(-1, "String attachments_path not found on attachment request");

                /* Attachment's name no longer in return */
                //expect(g_httpResponse.indexOf("qaImage0.jpg")).not.toEqual(-1, "Name of 1-st attachment not found on attachment request");
                //expect(g_httpResponse.indexOf("qaImage1.jpg")).not.toEqual(-1, "Name of 2-nd attachment not found on attachment request");

            });

        });

    });

    afterAll(function () {

        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

})();