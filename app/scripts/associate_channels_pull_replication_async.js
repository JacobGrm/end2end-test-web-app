/**
 * Created by 204071207 on 1/27/16.
 */

    /*

    Pre-requisites:

    1. Back-end contains 3 documents
         - FishStew with channel_1_jacob
         - LambStew with channel_2_jacob
         - BeefStew with channel_3_jacob

     {
     "docs": [
             {
             "_id": "FishStew",
             "~userid": "jacob_ge_com",
             "channels": ["channel_1_jacob"]

             },
             {
             "_id": "LambStew",
             "~userid": "jacob_ge_com",
             "channels": ["channel_2_jacob"]
             },
             {
             "_id": "BeefStew",
             "~userid": "jacob_ge_com",
             "channels": ["channel_3_jacob"]
             }
        ]
     }

    2. Container app (xcode AppDelegate.swift or Andoroid MainActivity.java) has to contain this line (initial default channels
                                                                                                       to have all other tests work)):

     xcode:

     PredixMobilityConfiguration.defaultPullReplicationChannels = ["app-FunctionalTestSuite_1_0_0",
                                                                     "webapp-e2e-app-test_0_0_1",
                                                                     "webapp-replacement-e2e-app_0_0_2",
                                                                     "webapp-sample-webapp_0_0_1",
                                                                     "webapp-offline-login_0_0_1",
                                                                     "entity_jacob_ge_com",
                                                                     "webapp-e2e-app-test_0_0_1"]


    Android:

     PredixMobileConfiguration.defaultPullReplicationChannels.add("app-FunctionalTestSuite_1_0_0");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-e2e-app-test_0_0_1");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-replacement-e2e-app_0_0_2");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-sample-webapp_0_0_1");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-offline-login_0_0_1");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("entity_jacob_ge_com");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-e2e-app-test_0_0_1");



   3. User has "channel_1_jacob", "channel_2_jacob" and "channel_3_jacob" created (use "pm channels" command)


   4. TEST WILL ONLY WORK IF RUN ON A NEW INSTALLATION


     */


function associateChannelPullReplication(data,callback) {

    _setUpHttpRequestAsync(
        {
            "method": "PUT"
            , "url": LOCAL_COUCHDB_HIGH_LEVEL+"replication/pull" // TODO -> move to resources
            , "data": data
            , "json": isJson(data)
        },callback
    );

};

function pollingCallback(){

    console.log("pollingCallback: "+g_httpResponse);
}


var associate_channels_pull_replication_async = associate_channels_pull_replication_async || {};
associate_channels_pull_replication_async.subns = (function() {

    var originalChannelList;


    describe("Allow association server-side channels to Pull replication, enable or disable those channel associations (associate_channels_pull_replication_async.js)::",function(){

        var originalTimeout;
        beforeAll(function() {

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        });

        it("Get replication configuration",function(done){

            getReplicationConfiguration(done);
        });

        it("Verify that test documents channels are not associated with pull request",function(){

            var res = JSON.parse(g_httpResponse);
            expect(res["pull"].channels.indexOf("channel_1_jacob")).toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_2_jacob")).toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_3_jacob")).toEqual(-1);

            originalChannelList = res["pull"].channels;
            console.log("originalChannelList" + JSON.stringify(originalChannelList));
        });


        it("Get all documents replicated to client",function(done){

           getDocumentsAsync("_all_docs",done);

        });

        it("Verify end-point documents with channels not associated with pull request were not replicated",function(){

            expect(g_httpResponse.indexOf("FishStew")).toEqual(-1, "TEST SHOULD BE RUN ON NEW INSTALLATION ONLY 1");
            expect(g_httpResponse.indexOf("LambStew")).toEqual(-1, "TEST SHOULD BE RUN ON NEW INSTALLATION ONLY 2");
            expect(g_httpResponse.indexOf("BeefStew")).toEqual(-1, "TEST SHOULD BE RUN ON NEW INSTALLATION ONLY 3");
        });

        it("Associate channel 'channel_1_jacob' with pull replication",function(done){

            var apiInput = {

                "add": ["channel_1_jacob"]
            }

            associateChannelPullReplication(apiInput,done);

        });

        it("Verify there is no errors",function(){

            expect(g_httpStatus).toEqual(200);
        });

        it("Get replication configuration after channel was added",function(done){

            getReplicationConfiguration(done);
        });

        it("Verify that test documents channel are now associated with pull request",function(){

            var res = JSON.parse(g_httpResponse);
            expect(res["pull"].channels.indexOf("channel_1_jacob")).not.toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_2_jacob")).toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_3_jacob")).toEqual(-1);
        });

        it("Poll for test Document 'FishStew' till it's replicated from backend", function(done){

            poll(
                function() {

                    getDocumentsAsync("FishStew",pollingCallback);
                    return JSON.parse(g_httpResponse)["_id"] === "FishStew";
                },
                function() {

                    expect(JSON.parse(g_httpResponse)["_id"]).toEqual("FishStew", "Document 'FishStew' was not replicated");
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                1000   //interval
            );

        });

        it("Ask for Document 'LambStew' with 'channel_2_jacob'",function(done){

            getDocumentsAsync("LambStew",done);
        });

        it("Document should not be replicated to client",function(){

            expect(g_httpStatus).toEqual(404, "Document 'LambStew' should not be replicated");

        });

        it("Associate channel 'channel_2_jacob' with pull replication",function(done){

            var apiInput1 = {

                "add": ["channel_2_jacob"]
            }

            associateChannelPullReplication(apiInput1,done);

        });

        it("Verify there is no errors",function(){

            expect(g_httpStatus).toEqual(200);
        });

        it("Get replication configuration after channel was added",function(done){

            getReplicationConfiguration(done);
        });

        it("Verify that test documents channel are now associated with pull request",function(){

            var res = JSON.parse(g_httpResponse);
            expect(res["pull"].channels.indexOf("channel_1_jacob")).not.toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_2_jacob")).not.toEqual(-1);
        });

        it("Poll for test Document 'LambStew' till it's replicated from backend", function(done){

            poll(
                function() {

                    getDocumentsAsync("LambStew",pollingCallback);
                    return JSON.parse(g_httpResponse)["_id"] === "LambStew";
                },
                function() {

                    expect(JSON.parse(g_httpResponse)["_id"]).toEqual("LambStew", "Document 'LambStew' was not replicated");
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                1000   //interval
            );

        });

        it("Attempt to issue API call to add and remove channel in one call",function(done){


            var apiInput2 = {

                "add": ["some_channel"],
                "remove": ["channel_1_jacob"]
            }

            associateChannelPullReplication(apiInput2,done);

        });

        it("Verify there is no errors",function(){

            expect(g_httpStatus).toEqual(200);
        });

        it("Get replication configuration",function(done){

            getReplicationConfiguration(done);
        });

        it("Verify channels list afer add/remove channels",function(){

            var res = JSON.parse(g_httpResponse);
            expect(res["pull"].channels.indexOf("some_channel")).not.toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_1_jacob")).toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_2_jacob")).not.toEqual(-1);
        });

        it("Attempt to issue API call to remove channels",function(done){


            var apiInput3 = {

                "remove": ["some_channel","channel_2_jacob"]
            }

            associateChannelPullReplication(apiInput3,done);

        });

        it("Verify there is no errors",function(){

            expect(g_httpStatus).toEqual(200);
        });

        it("Get replication configuration",function(done){

            getReplicationConfiguration(done);
        });

        it("Verify channels list afer add/remove channels",function(){

            var res = JSON.parse(g_httpResponse);
            expect(res["pull"].channels.indexOf("some_channel")).toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_1_jacob")).toEqual(-1);
            expect(res["pull"].channels.indexOf("channel_2_jacob")).toEqual(-1);

        });

        it("Compare lists of channels", function() {

            var res = JSON.parse(g_httpResponse);
            var channelList = res["pull"].channels;

            expect(channelList.length).toEqual(originalChannelList.length);

            for (var i in channelList) {

                expect(originalChannelList.indexOf(channelList[i])).not.toEqual(-1);
            }
        });


        it("API call to remove all channels associated with the main pull replication",function(done){


            var apiInput4 = {

                "removeall": true
            }

            associateChannelPullReplication(apiInput4,done);

        });

        it("Verify there is no errors",function(){

            expect(g_httpStatus).toEqual(200);
        });

        it("Get replication configuration",function(done){

            getReplicationConfiguration(done);
        });

        it("Verify channels list is empty",function(){

            var res = JSON.parse(g_httpResponse);
            var channelList1 = res["pull"].channels;

            expect(typeof channelList1).toEqual("undefined");

        });

        it("Poll for test Document 'BeefStew'. After all channels were removed all doces should be replicated from backend", function(done){

            poll(
                function() {

                    getDocumentsAsync("BeefStew");
                    return JSON.parse(g_httpResponse)["_id"] === "BeefStew";
                },
                function() {

                    expect(JSON.parse(g_httpResponse)["_id"]).toEqual("BeefStew", "Document 'BeefStew' was not replicated");
                    done();
                },
                function() {

                    // Error, failure callback
                    console.log("Calling poll error....");
                    done();
                },
                jasmine.DEFAULT_TIMEOUT_INTERVAL, //timeout
                1000   //interval
            );

        });


        afterAll(function() {

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

})();