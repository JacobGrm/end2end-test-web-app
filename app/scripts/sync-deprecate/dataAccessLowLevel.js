/**
 * Created by 204071207 on 12/21/15.
 */

var dataAccessLowLevel = dataAccessLowLevel || {};
dataAccessLowLevel.subns = (function() {


    var couchBaseServicesLowLevel = LOCAL_COUCHDB_LOW_LEVEL;
    var dbName = "qa_db_"+ generateUniqueId();


    function createDatabase(name){

        _setUpHttpRequest(
            {
                "method":"PUT"
                ,"url":couchBaseServicesLowLevel+name
            }
        );

    };

    function getDatabase(name){

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":couchBaseServicesLowLevel+name
            }
        );

    };

    describe('Data Access Low level Service /pmapi/cdb (dataAccessLowLevel.js)::',function(){

        it('Request GET /{db} to retrieve information about existing database',function(){

            getDatabase(BUCKET_NAME);
            expect(200).toEqual(g_httpStatus);
            var obj = JSON.parse(g_httpResponse);

            expect(BUCKET_NAME).toEqual(obj.db_name);
            expect("undefined").not.toEqual(obj.db_uuid);
        });

        it('Request GET /{db} to retrieve information about non-existing database',function(){

            getDatabase("wrongdb");
            expect(404).toEqual(g_httpStatus); // 404 - Not found
        });

        it('Request to create existing database supported',function(){

            createDatabase(dbName);
            expect(g_httpStatus).toEqual(404, "Create new database not supported");

        });
    });

})();
