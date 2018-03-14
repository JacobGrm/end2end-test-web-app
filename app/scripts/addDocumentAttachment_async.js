/**
 * Created by 204071207 on 11/23/15.
 */

var addDocumentAttachment_async = addDocumentAttachment_async || {};
addDocumentAttachment_async.subns = (function() {

    var docId = "qa_doc_" + generateUniqueId();
    var docType = "qa_type_attachment_from_url";
    var attachmentUrl = "https://qa-project-1.run.aws-usw02-pr.ice.predix.io/img/qaImage0.jpg"; // image size 5 MB
    var attachmentUrl_updated = "https://qa-project-4.run.aws-usw02-pr.ice.predix.io/img/qaImage0.jpg"; // image size 9 KB
    var attachmentZip_url = "https://github.com/PredixDev/predix-cli/archive/v0.6.16.zip"; //6 KB
    var original_attachment_size;


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

    function getAttachmentAbsolutePath(attachmentRelativePath) {

        var list = window.location.href.split("/");
        list.pop(); // remove "index.html"
        list.push(attachmentRelativePath)
        var finalURL = list.join("/");

        return finalURL;

    };


    describe("Add attachemnt to document (addDocumentAttachment_async.js)::",function() {

        var originalTimeout;
        beforeAll(function () {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        });


        describe('Add document image attachemnt from url::', function () {

            it("Create document",function(done){

                var data = {
                    "key1": "value1",
                    "key2": "value2",
                    "type": docType
                };

                createCbDocumentAsync(docId,data,done);

            });

            it("Add attachment to document", function (done) {

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


            it('Adding attachment to document returns 201 code (DE22481 Electron)', function () {

                expect(g_httpStatus).toEqual(201);
                expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1, "String _attachments not found");
                expect(g_httpResponse.indexOf("qaImage0.jpg")).not.toEqual(-1, "Name of image not found");

                var parsed_res = JSON.parse(g_httpResponse);
                original_attachment_size = parsed_res._attachments["qaImage0.jpg"].length;

            });

            it("Request document attachment", function (done) {

                retrieveDocumentAttachment(docId, done);
            });

            it('Verifiy document attachment path', function () {

                var obj = JSON.parse(g_httpResponse);
                expect(obj.attachments_path.indexOf(docId)).not.toEqual(-1);

            });

        });

        describe("Overwrite/modify document attachment::",function(){

            it("Attempt to Overwrite/modify original attachment to document",function(done){

                g_httpResponse = "";
                addDocumentAttachment(docId, {
                    "contenttype": "image/jpeg",
                    "url": attachmentUrl_updated
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

            it('Overwriting existing attachment to document replaces original', function () {

                expect(g_httpStatus).toEqual(201);
                expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1, "String _attachments not found after modification");
                expect(g_httpResponse.indexOf("qaImage0.jpg")).not.toEqual(-1, "Name of image not found after modification");

                var parsed_res = JSON.parse(g_httpResponse);
                var modified_attachment_size = parsed_res._attachments["qaImage0.jpg"].length;

                // Verify original attachment was replaced with new one
                expect(typeof original_attachment_size).not.toEqual("undefined");
                expect(modified_attachment_size).not.toEqual(original_attachment_size);

                expect(modified_attachment_size).toBeLessThan(original_attachment_size);

                // Verify document still has only 1 attachment
                expect(Object.keys(parsed_res._attachments).length).toEqual(1);

            });

            it("Request document attachment after modification", function (done) {

                retrieveDocumentAttachment(docId, done);
            });

            it('Verifiy document attachment path after modification', function () {

                var obj = JSON.parse(g_httpResponse);
                expect(obj.attachments_path.indexOf(docId)).not.toEqual(-1);

            });

        });


        describe("Adding zip attachment to document::",function(){

            it("Create document",function(done){

                g_httpResponse = "";
                addDocumentAttachment(docId, {
                    "contenttype": "application/zip",
                    "url": getAttachmentAbsolutePath("res/package.zip")
                },done);

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

            it('Adding attachment to document returns 201 code', function(){

                expect(g_httpStatus).toEqual(201);
                expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1);
                expect(g_httpResponse.indexOf("package.zip")).not.toEqual(-1);
            });

            it("Request document attachment",function(done){

                retrieveDocumentAttachment(docId,done);
            });

            it('Verifiy document attachment path', function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj.attachments_path.indexOf(docId)).not.toEqual(-1);

            });

        });

        describe("Adding zip attachment downloaded from the web to document::",function(){

            it("Create document",function(done){

                g_httpResponse = "";
                addDocumentAttachment(docId, {
                    "contenttype": "application/octet-stream",
                    "url": attachmentZip_url
                },done);

            });

            it("Wait to allow attachment downlode processed",function(done){

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

            it('Adding downloaded attachment to document returns 201 code', function(){

                expect(g_httpStatus).toEqual(201);
                expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1);
                expect(g_httpResponse.indexOf("v0.6.16.zip")).not.toEqual(-1);
            });

            it("Request document attachment",function(done){

                retrieveDocumentAttachment(docId,done);
            });

            it('Verifiy document attachment path', function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj.attachments_path.indexOf(docId)).not.toEqual(-1);

            });

        });

        describe("Adding attachment to document returns 404 when document not found::",function(){

            it("Create document",function(done){

                addDocumentAttachment("doc_not_found_id", {

                    "contenttype": "application/zip",
                    "url": getAttachmentAbsolutePath("res/package.zip")
                },done);
            });

            it('Verify attempt to add attachment to document returns 404 when document not found', function(){

                expect(g_httpStatus).toEqual(404);

            });
        });


        describe("Adding attachment with bad request returns 400 status::",function(){

            it("Create document",function(done){

                addDocumentAttachment(docId, {

                    "contenttype": "bad Request",
                    "url": "bad Request"
                },done);
            });

            it('Verify Adding attachment with bad request returns 400 status', function(){

                expect(g_httpStatus).toEqual(400);

            });
        });

        afterAll(function () {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

})();
