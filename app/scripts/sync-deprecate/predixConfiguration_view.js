/**
 * Created by 204071207 on 1/22/16.
 */

 //******* Pre-requisite - have this code in container app's AppDelegate.swift
 //
 //   PredixMobilityConfiguration.appendDataViewDefinition("qaview/designdoc", version: "1", mapFunction: { (properties, emit) -> () in
 //   guard let type = properties["type"] as? String
 //   else {
 //
 //           return
 //       }
 //       if(type ==  "qatype")
 //       {
 //           emit(type, properties["_id"])
 //       }
 //   })


var predixConfiguration_view = predixConfiguration_view || {};
predixConfiguration_view.subns = (function() {


    var documentType = "qatype";
    var getViewUrl = LOCAL_COUCHDB_LOW_LEVEL+"~/_design/qaview/_view/designdoc";


    function createDocumentsOfType1(count){

        var data = {
            "key": "value1",
            "type":documentType
        };

        for(var i=0; i<count; i++){

            var docName = "qa_doc_" + generateUniqueId();

            createCbDocument(docName,data);
        }
    };


    function createDocumentsOfType2(count){

        var data = {
            "key": "value1",
            "type":documentType+"New"
        };

        for(var i=0; i<count; i++){

            var docName = "qa_doc_" + generateUniqueId();

            createCbDocument(docName,data);
        }
    };


    function getViewDocuments() {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":getViewUrl
            }
        );
    };



    describe("Create data views for querying data documents within the application (predixConfiguration_view.js)::",function(){

        var viewRowCount;

        beforeAll(function() {

            getViewDocuments();
            viewRowCount = JSON.parse(g_httpResponse).total_rows;

            createDocumentsOfType1(5);
            createDocumentsOfType2(5);

        });

        it("Check the data view created for type 'qatype'",function(){

            getViewDocuments();
            var res = JSON.parse(g_httpResponse).total_rows;
            expect(res-viewRowCount).toEqual(5,"Number of documents added to view should be 5");

            var documentMismatchCount = 0;
            var view = JSON.parse(g_httpResponse).rows;
            for(var i=0; i<view.length; i++){
                if(view[i].key !== documentType)
                    documentMismatchCount++;
            }

            expect(documentMismatchCount).toEqual(0,"All documents in view should have the same type");

        }, IOS_ONLY);
    });

})();