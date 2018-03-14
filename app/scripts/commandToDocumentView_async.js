/**
 * Created by 204071207 on 9/26/17.
 */


var commandToDocumentView_async = commandToDocumentView_async || {};
commandToDocumentView_async.subns = (function() {

    var doc1 = "Viper_"+generateUniqueId();
    var doc2 = "Nissan"+generateUniqueId();
    var doc3 = "Caddy"+generateUniqueId();

    var cmdId_1 = "CMD_1_" + generateUniqueId();
    var cmdId_2 = "CMD_2_" + generateUniqueId();

    // GET api DEPRECATED!!!
    //function getCommandDocumentViewCDB(callback,filter) {
    //
    //    _setUpHttpRequestAsync(
    //        {
    //            "method":"GET"
    //            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + "_design/views/_view/relatedCommandDocuments"+filter
    //        },callback
    //    );
    //};


    function getCommandDocumentViewDB(inputDict, viewName, callback) {

        _setUpHttpRequestAsync(
            {
                "method":"POST"
                ,"url": LOCAL_COUCHDB_HIGH_LEVEL + "query/" + viewName
                ,"data":inputDict
                ,"json":isJson(inputDict)

            },callback
        );
    };



    describe("Test Creation of default CB Database View that maps commands to Documents (commandToDocumentView_async.js)::",function(){


        describe("Prerequisite: create documents and commands",function(){

            it("Create commands that will reference some documents",function(done){

                // !!! Documents don't have to exist

                var documents = {

                    "docs": [
                        {
                            "_id": cmdId_1,
                            type: "command",
                            "~userid": "jacob_ge_com",
                            channels: ["entity_jacob_ge_com","role-user"],
                            "targetDocuments":[doc1,doc2,doc3],
                        },
                        {
                            "_id": cmdId_2,
                            type: "command",
                            "~userid": "jacob_ge_com",
                            channels: ["entity_jacob_ge_com","role-user"],
                            "targetDocuments":[doc2],
                        }
                    ]
                };

                createDocumentsBulkAsync(documents,done);

            });

            it("Verify documents and commands successfully created", function () {

                expect(g_httpStatus).toEqual(201);
            });

        });


        describe("Verify command view",function(){

            // GET api DEPRECATED!!!
            //it("Query view with low level API call",function(done){
            //
            //    var filter = "?keys=%5B%22"+doc1+"%22%2C%20%22"+doc2+"%22%2C%20%22"+doc3+"%22%5D";
            //    getCommandDocumentViewCDB(done,filter);
            //
            //});
            //
            //it("Verify result for low level call (DE49102 Android)", function () {
            //
            //    expect(g_httpStatus).toEqual(200);
            //
            //    var result = JSON.parse(g_httpResponse).rows;
            //
            //    expect(result.length).toEqual(4);
            //
            //    var counter1 = 0;
            //    var counter2 = 0;
            //    var counter3 = 0;
            //    var allDocs = new Array();
            //
            //    result.forEach(
            //        function(item)
            //        {
            //            if(item.value == cmdId_1){
            //
            //                counter1++;
            //                allDocs.push(item.key);
            //            }else if(item.value == cmdId_2){
            //
            //                counter2++;
            //                expect(item.key).toEqual(doc2);
            //            }else{
            //
            //                counter3;
            //            }
            //        }
            //    );
            //
            //    expect(counter1).toEqual(3);
            //    expect(counter2).toEqual(1);
            //    expect(counter3).toEqual(0);
            //
            //    expect(allDocs.indexOf(doc1)).not.toEqual(-1);
            //    expect(allDocs.indexOf(doc2)).not.toEqual(-1);
            //    expect(allDocs.indexOf(doc3)).not.toEqual(-1);
            //
            //});

            it("Query the view with high level API call",function(done){

                var body =  {
                    "keys" : [doc1,doc2,doc3]
                };

                getCommandDocumentViewDB(body,"views/relatedCommandDocuments",done);

            });

            it("Verify result", function () {

                expect(g_httpStatus).toEqual(200);

                var result = JSON.parse(g_httpResponse).rows;

                expect(result.length).toEqual(4);

                var counter1 = 0;
                var counter2 = 0;
                var counter3 = 0;
                var allDocs = new Array();

                result.forEach(
                    function(item)
                    {
                        if(item.value == cmdId_1){

                            counter1++;
                            allDocs.push(item.key);
                        }else if(item.value == cmdId_2){

                            counter2++;
                            expect(item.key).toEqual(doc2);
                        }else{

                            counter3;
                        }
                    }
                );

                expect(counter1).toEqual(3);
                expect(counter2).toEqual(1);
                expect(counter3).toEqual(0);

                expect(allDocs.indexOf(doc1)).not.toEqual(-1);
                expect(allDocs.indexOf(doc2)).not.toEqual(-1);
                expect(allDocs.indexOf(doc3)).not.toEqual(-1);
            });

        });

    });

})();