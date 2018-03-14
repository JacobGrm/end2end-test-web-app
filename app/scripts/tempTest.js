/**
 * Created by 204071207 on 1/30/17.
 */


var docId = "qa_doc_" + generateUniqueId();
var command_route = "/test_cmdp/";
var now = new Date();


function addPushReplicationFilter(id, data, callback) {

    _setUpHttpRequestAsync(

        {
            "method":"PUT"
            ,"url":LOCAL_COUCHDB_HIGH_LEVEL + "replication/push"
            ,"data":data
            ,"json":isJson(data)
        },callback
    );
};

function createDocument(docID, data, callback){

    _setUpHttpRequestAsync(
        {
            "method": "PUT"
            , "url": LOCAL_COUCHDB_LOW_LEVEL_DB + docID
            , "data": data
            , "json": isJson(data)
        }, callback
    );
};
