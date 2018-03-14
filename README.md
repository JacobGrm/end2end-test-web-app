# px-mobile-reference-webapp
This project is the reference web application for Predix Mobile.

### Step 1 - Clone repo

```
$ git clone github.build.ge.com/204071207/px-end2end-test-web-app.git
```

### Step 2 - Install dependencies

```
$ npm i && bower install
```

### Step 3
Start:

```
$ npm start
```

### Step 4 - Create dist build


```
$ npm run build
```

### Step 5 - Publish dist build


```
$ px publish
```

Pre-requisites (apps and data needed to be deployed of a back-end for tests to run):

queryingViews_async.js


 IOS:

    PredixMobilityConfiguration.appendDataViewDefinition("myview/querytest",
        version: "1",
        mapFunction: { (properties, emit) -> () in
    guard let type = properties["type"] as? String
    else {
            return
        }
        emit(type, properties["category"])
    })


 Android (MainActivity.java):

     private void createCustomCategoryView(){

            DBViewDefinition typeView = new DBViewDefinition() {
                @Override
                public void mapFunction(final Map<String, Object> properties, final DBViewEmitter emitter) {
                    if (!properties.containsKey("type")) {
                        return;
                    }
                    String type = (String)properties.get("type");
                    String category = (String)properties.get("category");
                    emitter.emit(type, category);
                }

                @Override
                public String getViewName() {
                    return "myview/querytest";
                }

                @Override
                public String getViewVersion() {
                    return "1";
                }
            };

            PredixMobileConfiguration.appendDataViewDefinition(typeView);
        }



commandProcessor_async.js

     Deploy command processor:
     https://github.build.ge.com/predix-mobile/CBS-Conflict-Test/tree/master/conflict-cmd-processor

     Modify manifest.yml

     Push it to cloud:
       npm install
       cf push -f manifest.yml

     Add route:

        $ pm add-route /CMDP_CONFLICTS/ qa-test-command-processor.grc-apps.svc.ice.ge.com
            [INFO] PMRouterConfig: config document not found in server: router-configuration-1 ; using default empty document.
            OK
        SFO1204071207I:px-end2end-test-web-app 204071207$ pm routes

        route: ^/CMDP_CONFLICTS/ 	 https://qa-test-command-processor.grc-apps.svc.ice.ge.com

            total routes: 1
        OK


predixConfiguration_fullTextSearch_view_async.js

    IOS:

       PredixMobilityConfiguration.appendDataViewDefinition("views/searchtext", version: "1") { (properties: [String : Any], emit: (Any, Any?) -> ()) -> () in

           if let body = properties["body"] as? String
           {
               emit(FullTextSearch.createKey(body), nil)
           }
       }


filteredPushReplication_async.js


  IOS -> AppDelegate.swift:


        PredixMobilityConfiguration.addPushReplicationFilter(name: "MyFilter") { (properties: [String : Any]?, parameters:[AnyHashable : Any]?) -> (Bool) in

            // if both properties and parameters is not null
            if let properties = properties, let parameters = parameters
            {
                // loop through parameters key/value pairs
                for kv in parameters
                {
                    // To simplify, if the parameter key and value are strings
                    if let key = kv.key as? String, let value = kv.value as? String
                    {
                        // if the properties dictionary has a key/value pair with the same key as the this parameter key and it's also a string
                        if let documentValue = properties[key] as? String
                    {
                        // return true if the value in properties matches the value in parameters
                        if value == documentValue
                    {
                        return true
                    }
                }
                }
                }
            }

            return false
        }


        PredixMobilityConfiguration.addPushReplicationFilter(name: "MyFilterExcludeDocs") { (properties: [String : Any]?, parameters:[AnyHashable : Any]?) -> (Bool) in

            // if both properties and parameters is not null
            if let properties = properties, let parameters = parameters
            {
                // loop through parameters key/value pairs
                for kv in parameters
                {
                    // To simplify, if the parameter key and value are strings
                    if let key = kv.key as? String, let value = kv.value as? String
                    {
                        // if the properties dictionary has a key/value pair with the same key as the this parameter key and it's also a string
                        if let documentValue = properties[key] as? String
                        {
                            Logger.info("Comparing filter value:\n \(value)")
                    Logger.info("Comparing document value:\n \(documentValue)")

                    // return true if the value in properties matches the value in parameters
                    if value != documentValue
                    {
                        Logger.info("Matched filter value:\n \(value)")
                        Logger.info("Matched document value:\n \(documentValue)")

                        return true
                    }
                }
                }
                }
            }

            return false
        }



 Android -> MainActivity.java


        private void createPushFilter(String filterName) {

            PushReplicationFilter filter = new PushReplicationFilter() {

            @Override
                public boolean filterFunction(Map<String, Object> document, Map<String, Object> parameters) {

                    if (document == null || parameters == null) {

                        return false;
                    }

                    for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                        String key = entry.getKey();
                        String value = (String) entry.getValue();

                        if(document.get(key)==null) {
                            PredixSDKLogger.warning(this, "not replicating: " + document);
                            return false;
                        }
                        if (!(document.get(key) instanceof String)) {
                            continue;
                        }

                        String docValue = (String)document.get(key);

                        if (docValue.equals(value)) {
                            PredixSDKLogger.warning(this, "finally replicating: " + document);
                            return true;
                        }
                    }

                    return false;
                }

            };

            PredixMobileConfiguration.addNewFilter(filterName, filter);
        }


        private void createPushFilterExclude(String filterName) {

            PushReplicationFilter filter = new PushReplicationFilter() {

            @Override
                public boolean filterFunction(Map<String, Object> document, Map<String, Object> parameters) {

                    if (document == null || parameters == null) {

                        return false;
                    }

                    for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                        String key = entry.getKey();
                        String value = (String) entry.getValue();

                        if(document.get(key)==null) {
                            PredixSDKLogger.warning(this, "not replicating: " + document);
                            return false;
                        }
                        if (!(document.get(key) instanceof String)) {
                            continue;
                        }

                        String docValue = (String)document.get(key);

                        if (!docValue.equals(value)) {
                            PredixSDKLogger.warning(this, "finally replicating: " + document);
                            return true;
                        }
                    }

                    return false;
                }

            };

            PredixMobileConfiguration.addNewFilter(filterName, filter);
        }



        // Before instanse.start();

         createPushFilter("MyFilter");
         createPushFilterExclude("MyFilterExcludeDocs");


3). PredixMobileJavaSampleApp

    ReferenceApplication.java -> startPredixMobile(Pane root)

    after call to
    mobileManager.setViewInterface(dependencies);

         createPushFilter("MyFilter");
         createPushFilterExclude("MyFilterExcludeDocs");

         PredixMobileConfiguration.defaultPullReplicationChannels.add("app-FunctionalTestSuite_1_0_0");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-replacement-e2e-app_0_0_2");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-sample-webapp_0_0_1");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-offline-login_0_0_1");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("entity_jacob_ge_com");
         PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-e2e-app-test_0_0_1");



associate_channels_pull_replication_async.js


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



    IOS (AppDelegate.swift):

     PredixMobilityConfiguration.defaultPullReplicationChannels = ["app-FunctionalTestSuite_1_0_0",
                                                                     "webapp-e2e-app-test_0_0_1",
                                                                     "webapp-replacement-e2e-app_0_0_2",
                                                                     "webapp-sample-webapp_0_0_1",
                                                                     "webapp-offline-login_0_0_1",
                                                                     "entity_jacob_ge_com",
                                                                     "webapp-e2e-app-test_0_0_1"]


    Android -> MainActivity.java:

     PredixMobileConfiguration.defaultPullReplicationChannels.add("app-FunctionalTestSuite_1_0_0");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-e2e-app-test_0_0_1");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-replacement-e2e-app_0_0_2");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-sample-webapp_0_0_1");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-offline-login_0_0_1");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("entity_jacob_ge_com");
     PredixMobileConfiguration.defaultPullReplicationChannels.add("webapp-e2e-app-test_0_0_1");



   3. User has "channel_1_jacob", "channel_2_jacob" and "channel_3_jacob" created (use "pm channels" command)



Note:

set this var BACKEND_API_GATEWAY_URI to your value since it may affect some tests: https://github.build.ge.com/predix-mobile/px-end2end-test-web-app/blob/master/app/spec/config.js#L10
