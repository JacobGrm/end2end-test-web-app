/**
 * Created by 204071207 on 11/23/15.
 */



var couchBaseServicesHighLevel = LOCAL_COUCHDB_HIGH_LEVEL;
var replicationStatusNoErrorValues = ["Active", "Idle"];

var docId = "qa_doc_" + randomNumber(100,1000);
var docType = "qa_type_"+randomNumber(100,1000);


function getReplicationConfiguration() {

    _setUpHttpRequest(
        {
            "method":"GET"
            ,"url":couchBaseServicesHighLevel+"/replication"
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
            ,"url":couchBaseServicesHighLevel+"/replication"
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
            ,"url":LOCAL_COUCHDB_LOW_LEVEL + id
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



describe('Couchbase management and other high-level capabilities::', function(){

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

                expect(obj.push.lastErrorCode).not.toBeDefined();
            });
    });


    describe('Document: create, retrieve, add attachment::', function() {

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
                "url": getAttachmentAbsolutePath("scripts/package.zip")
            });
            expect(g_httpStatus).toEqual(201);  //Bug added DE16044 to correct documentation to show 201
            expect(g_httpResponse.indexOf("_attachments")).not.toEqual(-1);
            expect(g_httpResponse.indexOf("package.zip")).not.toEqual(-1);

        });

        it('Document attachment retrieval', function(){

            retrieveDocumentAttachment(docId);
            var obj = JSON.parse(g_httpResponse);
            expect(obj.attachments_path.indexOf(docId)).not.toEqual(-1);

        });

        it('Adding attachment to document returns 404 when document not found', function(){


            addDocumentAttachment("doc_not_found_id", {

                "contenttype": "application/zip",
                "url": getAttachmentAbsolutePath("scripts/package.zip")
            });
            expect(g_httpStatus).toEqual(404);

        });

        it('Adding attachment with bad request returns 400 status', function(){


            addDocumentAttachment(docId, {

                "contenttype": "bad Request",
                "url": "bad Request"
            });
            expect(g_httpStatus).toEqual(400);

        });

        it('Documnet retrieval by type', function(){

            getDocumentByType(docType);
            var obj = JSON.parse(g_httpResponse);
            expect(obj.length).toEqual(1);
        });


        it('Shutting down Couchbase (local) will set replication status to 404 (stop replication)', function(){

            shutDownCouchbase();
            expect(g_httpStatus).toEqual(200);
            getReplicationConfiguration();
            expect(g_httpStatus).toEqual(404);

        });

        it('Set replication url enables replication if it was shut down', function(){

            setReplicationUrl();
            expect(g_httpStatus).toEqual(200);

            sleep(5000);

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

            expect(obj.push.lastErrorCode).not.toBeDefined();

        });

    });

});