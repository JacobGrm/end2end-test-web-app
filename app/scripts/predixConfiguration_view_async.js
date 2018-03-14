/**
 * Created by 204071207 on 1/22/16.
 */


/*

    Docs: https://github.com/PredixDev/PredixMobileSDK/wiki/Data-Access-Low-level#querying-views

 // Pre-requisite:

  IOS:

  have this code in container app's AppDelegate.swift

     PredixMobilityConfiguration.appendDataViewDefinition("qaview/designdoc", version: "1", mapFunction: { (properties, emit) -> () in
     guard let type = properties["type"] as? String
        else {

                return
            }
        emit(type, nil)
     })


  Android:

  have this code in containter app's MainActivity.java


 private void createCustomView(){

 DBViewDefinition typeView = new DBViewDefinition() {
     @Override
     public void mapFunction(final Map<String, Object> properties, final DBViewEmitter emitter) {
     if (properties.containsKey("type") && (!properties.containsKey("_deleted") || !(Boolean)properties.get("_deleted"))) {

         String type = (String)properties.get("type");
         String id = (String)properties.get("_id");
         emitter.emit(type, id);
     }
 }

         @Override
         public String getViewName() {
            return "qaview/designdoc";
        }

         @Override
             public String getViewVersion() {
            return "1";
         }
    };

    PredixMobileConfiguration.appendDataViewDefinition(typeView);
 }


 call createCustomView() inside initiatePredixMobile() after
 if (instance.isRunning())


*/

var predixConfiguration_view_async = predixConfiguration_view_async || {};
predixConfiguration_view_async.subns = (function() {

    var documentType = generateUniqueId();
    var documentType1 = generateUniqueId();

    var count = 0;

    function updateCounter(){

        count++;
    };

    function createDocumentsOfType1(cnt){

        var data = {
            "key": "value1",
            "type":documentType
        };

        for(var i=0; i<cnt; i++){

            var docName = "qa_doc_" + generateUniqueId();

            createCbDocumentAsync(docName,data,updateCounter());
        }
    };

    function createDocumentsOfType2(cnt){

        var data = {
            "key": "value1",
            "type":documentType1
        };

        for(var i=0; i<cnt; i++){

            var docName = "qa_doc_" + generateUniqueId();

            createCbDocumentAsync(docName,data,updateCounter());
        }
    };

    function getViewDocumentsPOST(callback) {

        var getViewUrl = LOCAL_COUCHDB_LOW_LEVEL+"~/_design/qaview/_view/designdoc";
        var urlEncoded = encodeURI(getViewUrl);

        console.log("encoded url: "+ urlEncoded);

        _setUpHttpRequestAsync(
            {
                "method":"POST",
                "url":urlEncoded,
                "json":true,
                "data":{"keys":[ documentType ]}

            },callback
        );
    };

    function getViewDocumentsMultipleTypesPOST(callback) {

        var getViewUrl = LOCAL_COUCHDB_LOW_LEVEL+"~/_design/qaview/_view/designdoc";
        var urlEncoded = encodeURI(getViewUrl);

        console.log("encoded url: "+ urlEncoded);

        _setUpHttpRequestAsync(
            {
                "method":"POST",
                "url":urlEncoded,
                "json":true,
                "data":{"keys":[ documentType, documentType1 ]}

            },callback
        );
    };


    describe("Create data views for querying data documents within the application (predixConfiguration_view_async.js)::",function(){

        var viewRowCount;

        describe("Pre-requisits", function(){

            it("Fetch existing documents if any", function(done){

                getViewDocumentsMultipleTypesPOST(done);
            }, IOS_ONLY+ANDR_ONLY);

            it("Verify counter set", function(){

                viewRowCount = JSON.parse(g_httpResponse).rows.length;

                console.log("Verify counter set viewRowCount: "+viewRowCount);

                expect(typeof viewRowCount).toEqual("number");
                expect(viewRowCount).toEqual(0);

            }, IOS_ONLY+ANDR_ONLY);

            it("Create documents of unique type 1", function(done){

                poll(
                    function() {

                        createDocumentsOfType1(5);
                        return count === 5;
                    },
                    function() {
                        expect(count).toEqual(5);
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Polling error....");
                        done();
                    },
                    30000, //timeout
                    1000   //interval
                );
            }, IOS_ONLY+ANDR_ONLY);

            it("Create documents of unique type 2", function(done){

                poll(
                    function() {

                        createDocumentsOfType2(5);
                        return count === 10;
                    },
                    function() {
                        expect(count).toEqual(10);
                        done();
                    },
                    function() {

                        // Error, failure callback
                        console.log("Polling error....");
                        done();
                    },
                    30000, //timeout
                    1000   //interval
                );
            }, IOS_ONLY+ANDR_ONLY);


        });

        describe("Do view data verfication", function(){

            it("Fetch view docs created with unique type",function(done) {

                getViewDocumentsPOST(done);
            }, IOS_ONLY+ANDR_ONLY);


            it("Verify all documents have unique type 1",function(){

                var res = JSON.parse(g_httpResponse).rows.length;
                expect(res).toEqual(5,"Number of documents added to view should be 5");

                var documentMismatchCount = 0;
                var view = JSON.parse(g_httpResponse).rows;
                for(var i=0; i<view.length; i++){
                    if(view[i].key !== documentType)
                        documentMismatchCount++;
                }

                expect(documentMismatchCount).toEqual(0,"All documents in view should have the unique type");

            }, IOS_ONLY+ANDR_ONLY);


            it("Fetch view docs created with unique type1 and type2",function(done) {

                getViewDocumentsMultipleTypesPOST(done);
            }, IOS_ONLY+ANDR_ONLY);


            it("Verify all documents have unique type 1 and type 2",function(){

                var res = JSON.parse(g_httpResponse).rows.length;
                expect(res).toEqual(10,"Number of documents added to view should be 10");

                var documentViewCount = 0;
                var view = JSON.parse(g_httpResponse).rows;
                for(var i=0; i<view.length; i++){
                    if((view[i].key == documentType)||(view[i].key == documentType1)){
                        documentViewCount++;
                    }
                }

                expect(documentViewCount).toEqual(10,"All documents in view should have the unique type1 and type2");

            }, IOS_ONLY+ANDR_ONLY);

        });

    });

})();