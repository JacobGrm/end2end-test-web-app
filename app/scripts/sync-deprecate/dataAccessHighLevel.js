/**
 * Created by 204071207 on 11/23/15.
 */


var dataAccessHighLevel = dataAccessHighLevel || {};
dataAccessHighLevel.subns = (function() {


    var couchBaseServicesHighLevel = LOCAL_COUCHDB_HIGH_LEVEL;
    var replicationStatusNoErrorValues = ["Active", "Idle"];

    var docId = "qa_doc_" + generateUniqueId();
    var docType = "qa_type_"+generateUniqueId();


    function getReplicationConfiguration() {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":couchBaseServicesHighLevel+"replication"
            }
        );
    };


    function setReplicationUrl() {

        var data = {

            "replicationURL" : BACKEND_API_GATEWAY_URI+"/pg/data/"+BUCKET_NAME
        };

        _setUpHttpRequest(
            {
                "method":"POST"
                ,"url":couchBaseServicesHighLevel+"replication"
                ,"data":data
                ,"json":isJson(data)
            }
        );

    };


    function createDocument(id) {

        var data = {
            "key1": "value1",
            "key2": "value2",
            "type": docType
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

    function retrieveDocument(id) {


        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":couchBaseServicesHighLevel + "document/" + id
            }
        );

    };


    function retrieveDocumentAttachment(id) {


        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":couchBaseServicesHighLevel + "attachments/" + id

            }
        );

    };


    function getDocumentByType(type) {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":couchBaseServicesHighLevel + "type/"+type
            }
        );

    };


    function shutDownCouchbase() {


        _setUpHttpRequest(

            {
                "method":"POST"
                ,"url":COUCHDB_HIGH_LEVEL + "close"
            }
        );

    };



    describe('Couchbase management and other high-level capabilities (dataAccessHighLevel.js)::', function(){

        describe('Replication configuration::', function(){

            it('Replication PUSH and PULL status should be Active or Idle if no replication is occuring. LastErrorCode should be undefined', function(){

                    getReplicationConfiguration();
                    var obj = JSON.parse(g_httpResponse);

                    logWrite(
                        {
                            "level": "info",
                            "log": "****** REPLICATION STATUS: "+g_httpResponse
                        }
                    );

                    expect(replicationStatusNoErrorValues.indexOf(obj.pull.status)).not.toEqual(-1);
                    expect(replicationStatusNoErrorValues.indexOf(obj.push.status)).not.toEqual(-1);

                    //expect(obj.push.lastErrorCode).not.toBeDefined(); //dictionary may contain 'lastErrorCode'. It's not an error
                });
        });


        describe('Document: create, retrieve, add attachment::', function() {

            var originalTimeout;
            beforeAll(function() {

                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
            });


            it('Create and retrieve document', function(){

                createDocument(docId);
                retrieveDocument(docId);

                var obj = JSON.parse(g_httpResponse);
                expect(obj._id).toEqual(docId);

                expect(obj.key1).toEqual("value1");
                expect(obj.key2).toEqual("value2");
            });


            it('Adding attachment to document returns 201 code', function(){


                addDocumentAttachment(docId, {

                    "contenttype": "application/zip",
                    "url": getAttachmentAbsolutePath("res/package.zip")
                });
                expect(g_httpStatus).toEqual(201);  //Bug added DE16044 to correct documentation to show 201
                expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1);
                expect(g_httpResponse.indexOf("package.zip")).not.toEqual(-1);

            }, IOS_ONLY);

            it('Document attachment retrieval', function(){

                retrieveDocumentAttachment(docId);
                var obj = JSON.parse(g_httpResponse);
                expect(obj.attachments_path.indexOf(docId)).not.toEqual(-1);

            }, IOS_ONLY);

            it('Adding attachment to document returns 404 when document not found', function(){


                addDocumentAttachment("doc_not_found_id", {

                    "contenttype": "application/zip",
                    "url": getAttachmentAbsolutePath("res/package.zip")
                });
                expect(g_httpStatus).toEqual(404);

            });

            it('Adding attachment with bad request returns 400 status', function(){


                addDocumentAttachment(docId, {

                    "contenttype": "bad Request",
                    "url": "bad Request"
                });
                expect(g_httpStatus).toEqual(400);

            }, IOS_ONLY);

            it('Document retrieval by type (DE32721 Electron)', function(){

                getDocumentByType(docType);
                var obj = JSON.parse(g_httpResponse);
                var docFound = obj.length >=1;
                expect(docFound).toEqual(true);
            });


            it('Shutting down Couchbase (local) will set replication status to 404 (stop replication)', function(){

                shutDownCouchbase();
                expect(g_httpStatus).toEqual(200, "Database not shut down");
                getReplicationConfiguration();
                expect(g_httpStatus).toEqual(404, "Expect 404 after database shut down");

            }, IOS_ONLY);

            it('Set replication url enables replication if it was shut down', function(done){

                setReplicationUrl();
                expect(g_httpStatus).toEqual(200);

                poll(
                    function() {

                        getReplicationConfiguration();
                        var obj = JSON.parse(g_httpResponse);
                        return replicationStatusNoErrorValues.indexOf(obj.pull.status) != -1;
                    },
                    function() {
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Calling poll error....");
                    },
                    jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                    1000   //interval
                );

            }, IOS_ONLY);

            it("Checking replication status expecting it is enabled", function(){

                var obj = JSON.parse(g_httpResponse);
                expect(replicationStatusNoErrorValues.indexOf(obj.pull.status)).not.toEqual(-1, "replication (pull) Status should be enabled");
                expect(replicationStatusNoErrorValues.indexOf(obj.push.status)).not.toEqual(-1, "replication (push) Status should be enabled");

                expect(obj.push.lastErrorCode).not.toBeDefined();

                logWrite(
                    {
                        "level": "info",
                        "log": "****** REPLICATION STATUS: "+g_httpResponse
                    }
                );
            },IOS_ONLY);


            describe("Tilde should be recognized as a replacement for DB name::", function() {


                var docIdTilde = "qa_doc_" + generateUniqueId();
                var couchBaseServicesHighLevelTilde = COUCHDB_HIGH_LEVEL+"~"+"/";

                function retrieveDocumentTilde(id) {


                    _setUpHttpRequest(
                        {
                            "method":"GET"
                            ,"url":couchBaseServicesHighLevelTilde + "document/" + id
                        }
                    );

                };

                function getReplicationConfigurationTilde() {

                    _setUpHttpRequest(
                        {
                            "method":"GET"
                            ,"url":couchBaseServicesHighLevelTilde +"replication"
                        }
                    );
                };

                it("Create document",function(){

                    createDocument(docIdTilde);
                    expect(g_httpStatus).toEqual(201);
                });

                it("Retrieve document using tilde for db name",function(){

                    retrieveDocumentTilde(docIdTilde);
                    var obj = JSON.parse(g_httpResponse);
                    expect(obj._id).toEqual(docIdTilde);

                });

                it('Test Replication configuration with tilde', function(){

                    getReplicationConfigurationTilde();
                    var obj = JSON.parse(g_httpResponse);

                    console.log("Replication configuration with tilde: "+ obj);

                    expect(replicationStatusNoErrorValues.indexOf(obj.pull.status)).not.toEqual(-1);
                    expect(replicationStatusNoErrorValues.indexOf(obj.push.status)).not.toEqual(-1);

                });

            });

            // Reset timeout to original value
            afterAll(function() {

                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });

        });

    });

})();