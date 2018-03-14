/**
 * Created by 204071207 on 11/23/15.
 */

var replicationConfigSettings_async = replicationConfigSettings_async || {};
replicationConfigSettings_async.subns = (function() {


    function setReplicationUrl(callback) {

        var data = {

            "replicationURL" : BACKEND_API_GATEWAY_URI+"/pg/data/"+BUCKET_NAME
        };

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url":LOCAL_COUCHDB_HIGH_LEVEL+"replication"
                ,"data":data
                ,"json":isJson(data)
            },callback
        );

    };

    function shutDownCouchbase(callback) {


        _setUpHttpRequestAsync(

            {
                "method":"POST"
                ,"url":COUCHDB_HIGH_LEVEL + "close"
            },callback
        );
    };



    describe('Replication configuration shut down and settings (replicationConfigSettings_async.js)::', function(){


        describe("Shutting down Couchbase (local) will set replication status to 404 (stop replication)::",function(){

            beforeAll(function(done) {

                shutDownCouchbase(done);
            });

            it('Verify Shutting down Couchbase sets replication status to 404', function(){

                expect(g_httpStatus).toEqual(200, "Database not shut down");

            }, IOS_ONLY+MAC_ONLY+ANDR_ONLY);

            it("Get replication status after shut down",function(done){

                getReplicationConfiguration(done);
            });

            it("Verify status 404 after database shut down",function(){

                expect(g_httpStatus).toEqual(404, "Expect 404 after database shut down");

            }, IOS_ONLY+MAC_ONLY+ANDR_ONLY);

        });

        describe("Set replication url enables replication if it was shut down::",function(){

            beforeAll(function(done){

                setReplicationUrl(done);
            });

            it('Verify set replication returns status 200', function() {

                expect(g_httpStatus).toEqual(200, "setReplicationUrl should return status 200");
            },IOS_ONLY+MAC_ONLY+ANDR_ONLY);

            it("Get replication configuration after 'Set replication' call",function(done){

                getReplicationConfiguration(done);

            },IOS_ONLY+MAC_ONLY+ANDR_ONLY);

            it("Verify setting replication url enables replication", function(){

                var obj = JSON.parse(g_httpResponse);
                expect(obj.pull.status).not.toBeUndefined();
                expect(obj.push.status).not.toBeUndefined();
                expect(obj.push.lastErrorCode).not.toBeDefined();

            },IOS_ONLY+MAC_ONLY+ANDR_ONLY);

        });

    });

})();