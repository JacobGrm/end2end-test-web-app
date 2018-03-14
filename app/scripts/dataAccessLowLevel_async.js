/**
 * Created by 204071207 on 12/21/15.
 */

var dataAccessLowLevel_async = dataAccessLowLevel_async || {};
dataAccessLowLevel_async.subns = (function() {

    var dbName = "qa_db_"+ generateUniqueId();


    function createDatabase(name, callback){

        _setUpHttpRequestAsync(
            {
                "method":"PUT"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL+name
            },callback
        );

    };

    function getDatabase(name, callback){

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":LOCAL_COUCHDB_LOW_LEVEL+name
            },callback
        );

    };

    describe('Data Access Low level Service /pmapi/cdb (dataAccessLowLevel_async.js)::',function(){

        it('Request GET /{db} to retrieve information about existing database',function(done){

            getDatabase(BUCKET_NAME,done);
        });

        it('Verify information about existing database',function(){

            expect(200).toEqual(g_httpStatus);
            var obj = JSON.parse(g_httpResponse);

            expect(BUCKET_NAME).toEqual(obj.db_name);
            expect("undefined").not.toEqual(obj.db_uuid);
        });

        it('Request GET /{db} to retrieve information about non-existing database',function(done){

            getDatabase("wrongdb",done);
        });

        it('Verify status when asked about non-existing database',function(){

            expect(404).toEqual(g_httpStatus); // 404 - Not found
        });

        it('Request to create database not supported',function(done){

            createDatabase(dbName,done);

        });

        it('Verify Request to create database not supported and returns 501',function(){

            expect(g_httpStatus).toEqual(404, "Create new database not supported and should return status 404");

        });
    });

})();
