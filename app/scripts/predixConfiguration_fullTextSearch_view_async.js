/**
 * Created by 204071207 on 1/22/16.
 */


/*

 // Pre-requisite - have this code in container app's AppDelegate.swift

 PredixMobilityConfiguration.appendDataViewDefinition("views/searchtext", version: "1") { (properties: [String : Any], emit: (Any, Any?) -> ()) -> () in

     if let body = properties["body"] as? String
     {
         emit(FullTextSearch.createKey(body), nil)
     }
 }


 // NOTE: TEST SHOULD WORK ON MAC WHEN APP USES swift-based SDK.
 //       FOR Java-based SDK THIS TEST SHOULD BE EXCLUDED

*/

var predixConfiguration_fullTextSearch_view_async = predixConfiguration_fullTextSearch_view_async || {};
predixConfiguration_fullTextSearch_view_async.subns = (function() {


    var documentType = "testDocFullTextSearch";
    var getViewUrlFilter = "~/_design/views/_view/searchtext";

    var docBodyText1 = "actus me invito factus non est meus actus";
    var docBodyText2 = "amor et melle et felle est fecundissimus";

    var count = 0;
    var docsInViewCount = 0;

        function updateCounter(){

        count++;
    };

    function createDocumentsWithText1(cnt){

        var data = {
            "key": "value1",
            "type":documentType,
            "body":docBodyText1
        };

        for(var i=0; i<cnt; i++){

            var docName = "qa_doc_full_text_search_" + generateUniqueId();

            createCbDocumentAsync(docName,data,updateCounter());
        }
    };


    function createDocumentsWithText2(cnt){

        var data = {
            "key": "value1",
            "type":documentType+"New",
            "body":docBodyText2
        };

        for(var i=0; i<cnt; i++){

            var docName = "qa_doc_full_text_search_" + generateUniqueId();

            createCbDocumentAsync(docName,data,updateCounter());
        }
    };


    // filter value should be URL encoded (e.g "?keys=%5B%22qatype%22%5D")
    // str -> string or pattern to search for
    function getViewDocumentsWithText(str,callback) {

        var filter =  "?full_text=%22"+encodeURI(str)+"%22";

        _setUpHttpRequestAsync(
            {
                "method":"GET",
                "url":LOCAL_COUCHDB_LOW_LEVEL+getViewUrlFilter+filter

            },callback
        );
    };

    function getViewDocumentsWithTextSnippets(str,callback) {

        var filter =  "?full_text=%22"+encodeURI(str)+"%22"+"&snippets";

        _setUpHttpRequestAsync(
            {
                "method":"GET",
                "url":LOCAL_COUCHDB_LOW_LEVEL+getViewUrlFilter+filter

            },callback
        );
    };

    describe("Setup views to allow for full text searching in string fields (predixConfiguration_fullTextSearch_view_async.js)::",function(){


        describe("Pre-requisits", function(){

            it("Create new documents with body containing docBodyText1", function(done){

                poll(
                    function() {

                        createDocumentsWithText1(5);
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
            }, IOS_ONLY);

            it("Create new documents with body containing docBodyText2", function(done){

                poll(
                    function() {

                        createDocumentsWithText2(5);
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
            }, IOS_ONLY);

        });

        describe("Full Text Search views", function(){

            it("Get all documents in view that match text", function(done){

                getViewDocumentsWithText(docBodyText1,done);

            }, IOS_ONLY);


            it("Check all documents in view have docBodyText1 string in them",function(done){

                docsInViewCount = JSON.parse(g_httpResponse).rows.length;
                expect(docsInViewCount).toBeGreaterThan(0,"View does not contain any documents");

                // pick random document from the view
                var docId = JSON.parse(g_httpResponse).rows[randomNumberExclusive(0,docsInViewCount)].id;

                getDocumentsAsync(docId,done);

            }, IOS_ONLY);

            it("Verify randomly picked from the view document contains 'body' with string docBodyText1", function(){

                expect(JSON.parse(g_httpResponse).body).toEqual(docBodyText1);

            },IOS_ONLY);

        describe("Parameter 'snippet' can be used in quering documents",function(){

            it("In addition to the querystring parameter full_text, the parameter 'snippets' can be included",function(done){

                getViewDocumentsWithTextSnippets(docBodyText2,done);

            },IOS_ONLY);

            it("Check each document in the resulting return set. It should include a 'snippet' property containing a snippet of the full text",function(){

                var view = JSON.parse(g_httpResponse).rows;
                for(var i=0; i<view.length; i++){

                    var txt = view[i].snippet;
                    expect(typeof txt).toEqual("string","Snippet parameter is not included for docid: "+view[i].id);
                    expect(txt.replace(/[\[\]]+/g,"")).toEqual(docBodyText2, "Snippet parameter does not match for docid: "+view[i].id);

                }

            },IOS_ONLY);

            });

            describe("The full_text parameter can include various options",function(){

                describe("Individual words, delimited by double-quotes",function() {

                    it("Create view with Individual words, delimited by double-quotes", function (done) {

                        getViewDocumentsWithTextSnippets("melle\"\"fecundissimus", done);

                    }, IOS_ONLY);


                    it("Check each document's 'snippet'", function () {

                        var view = JSON.parse(g_httpResponse).rows;
                        for (var i = 0; i < view.length; i++) {

                            var txt = view[i].snippet;
                            expect(typeof txt).toEqual("string", "Snippet parameter is not included for docid: " + view[i].id);
                            expect(txt.replace(/[\[\]]+/g, "")).toEqual(docBodyText2, "Snippet parameter does not match for docid: " + view[i].id);

                        }

                    }, IOS_ONLY);

                });


                describe("Appending a * to a search term denotes a prefix search that matches any word beginning with that term",function() {


                    it("Create view by Appending a * to a search term", function (done) {

                        getViewDocumentsWithTextSnippets("fecundiss*", done);

                    }, IOS_ONLY);


                    it("Check each document's 'snippet'", function () {

                        var view = JSON.parse(g_httpResponse).rows;
                        for (var i = 0; i < view.length; i++) {

                            var txt = view[i].snippet;

                            expect(typeof txt).toEqual("string", "Snippet parameter is not included for docid: " + view[i].id);
                            expect(txt.replace(/[\[\]]+/g, "")).toEqual(docBodyText2, "Snippet parameter does not match for docid: " + view[i].id);
                        }

                    }, IOS_ONLY);

                });

                describe("Words AND or OR (in all caps) can be put between search terms",function() {


                    it("Create view by using AND between search terms", function (done) {

                        getViewDocumentsWithTextSnippets("invito \"AND\" actus", done);

                    }, IOS_ONLY);


                    it("Check each document's 'snippet'", function () {

                        var view = JSON.parse(g_httpResponse).rows;
                        for (var i = 0; i < view.length; i++) {

                            var txt = view[i].snippet;

                            expect(typeof txt).toEqual("string", "Snippet parameter is not included for docid: " + view[i].id);
                            // remove "[" and "]" that surround searched text in "snippet"
                            expect(txt.replace(/[\[\]]+/g, "")).toEqual(docBodyText1, "Snippet parameter does not match for docid: " + view[i].id);

                        }

                    }, IOS_ONLY);

                });


                describe("Word NEAR between terms is like AND but also requires that the matches be near each other",function() {


                    it("Create view with word NEAR between terms", function (done) {

                        getViewDocumentsWithTextSnippets("felle \"AND\" est", done);

                    }, IOS_ONLY);


                    it("Check each document's 'snippet'", function () {

                        console.log("Check each document's 'snippet' g_httpResponse: "+g_httpResponse);

                        var view = JSON.parse(g_httpResponse).rows;
                        for (var i = 0; i < view.length; i++) {

                            var txt = view[i].snippet;

                            expect(typeof txt).toEqual("string", "Snippet parameter is not included for docid: " + view[i].id);
                            // remove "[" and "]" that surround searched text in "snippet"
                            expect(txt.replace(/[\[\]]+/g, "")).toEqual(docBodyText2, "Snippet parameter does not match for docid: " + view[i].id);

                        }

                    }, IOS_ONLY);

                });

            });


        });

    });

})();