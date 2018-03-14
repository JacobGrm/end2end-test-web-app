  var timingCommandDocName = "command_ts_" + randomNumber(100,1000);
  var command_route = "/test_cmdp/";
  var MAX_ITERATIONS = 300;
  var MAX_TESTS = 2;
  var modJsonDocument;
  function createTestDocument()
  {
    var now = new Date(); //now.getTime() - using UTC ts
    var data = {
      "type": "command",
      "~userid": g_user,
      "channels": ["entity_jacob_ge_com"],
      "~status": "pending",
      "request": {
        "uri": command_route,
        "method": "PUT",
        "headers": {},
        "body": {
          "counter" : 1,
          "result": [
            {
              "TS_CL_PUSH": now.getTime()
            }
          ]
        }
      }
    };
    console.log("Created document " + JSON.stringify(data));
    return data;
    /*
    {
  "body": {
    "counter": 1,
    "result": [
      {
        "TS_CL_PUSH": 1449182422211,
        "TS_CMDP_RCVD": 1449182422212,
        "TS_CL_RCVD": 1449182422213
      },
      {
        "TS_CL_PUSH": 1449182422211,
        "TS_CMDP_RCVD": 1449182422212,
        "TS_CL_RCVD": 1449182422213
      },
      {
        "TS_CL_PUSH": 1449182422211,
        "TS_CMDP_RCVD": 1449182422212,
        "TS_CL_RCVD": 1449182422213
      }
    ]
  }
}
  */
  }

  // var CLIENT_PUSH_TS = 'TS_CL_PUSH';
  // var CLIENT_RCVD_TS = 'TS_CL_RCVD';
  // var CMD_PROCESSOR_RCVD_TS = 'TS_CMDP_RCVD';

  function increaseCounter(jsonDoc)
  {
    if (jsonDoc.request.body.hasOwnProperty('counter')) {
      jsonDoc.request.body.counter += 1;
      console.log('counter increased.');
    }
    else
    {
      jsonDoc.request.body['counter'] = 1;
    }
  }

  function getCMDPTS(jsonDoc)
  {
    var toReturn;
    if (jsonDoc.hasOwnProperty('response') && jsonDoc.response.hasOwnProperty('body'))
    {
      console.log('found response and body tag.resp body:'+ JSON.stringify(jsonDoc.response.body));
      if (jsonDoc.response.body.hasOwnProperty('TS_CMDP_RCVD'))
      {
        toReturn = jsonDoc.response.body['TS_CMDP_RCVD'];
        console.log('value of TS_CMDP_RCVD: '+ toReturn);
      }
      else {
          console.log('unable to find TS_CMDP_RCVD');
      }
    }

    return toReturn;
  }


  function updateDocument(jsonDoc)
  {
    if (jsonDoc.hasOwnProperty('request')
    && jsonDoc.request.hasOwnProperty('body')) {

      // increaseCounter(jsonDoc);

      if (jsonDoc.request.body.hasOwnProperty('result') &&  0 < jsonDoc.request.body.result.length) {
        console.log('doc has old results.');
        var results = jsonDoc.request.body.result;
        var lastResult = results[results.length -1];

        if (lastResult.hasOwnProperty('TS_CL_RCVD')) {
          console.log('last result has TS_CL_RCVD, so adding a new task');
          // TS_CL_RCVD is there, we need to create a new result item.
          results.push({
            'TS_CL_PUSH' : new Date().getTime()
          });
          increaseCounter(jsonDoc);
        }
        else if (lastResult.hasOwnProperty('TS_CMDP_RCVD')) {
            console.log('last result has TS_CMDP_RCVD'+JSON.stringify(lastResult));
          // TS_CMDP_RCVD is there, we need to
          // add client received TS
          lastResult['TS_CL_RCVD'] = new Date().getTime();
          //  create a new result item.
          // results.push({
          //   'TS_CL_PUSH' : new Date().getTime()
          // });
          // increaseCounter(jsonDoc);
        }
        else if (!lastResult.hasOwnProperty('TS_CMDP_RCVD') && lastResult.hasOwnProperty('TS_CL_PUSH')){
            console.log('last result does not have TS_CMDP_RCVD'+JSON.stringify(lastResult));
            // look for response and get CMD_PROCESSOR_RCVD_TS
            var cmdp_ts = getCMDPTS(jsonDoc)
            // add CMD_PROCESSOR_RCVD_TS
            lastResult['TS_CMDP_RCVD'] = cmdp_ts;
        }
        // results.forEach(function(item){
        //   console.log(item.TS_CL_PUSH);
        // });
      }
      else
      {
        console.log('warming up ||=^=^=^=^=>>');
        jsonDoc.request.body['result'].push({
          'TS_CL_PUSH' : new Date().getTime()
        });
        increaseCounter(jsonDoc);
      }
    }
    console.log('jsonDoc now is:'+ JSON.stringify(jsonDoc));
    return jsonDoc;
  }
  function markItPending(jsonDoc)
  {
    if (jsonDoc.hasOwnProperty('~status'))
    {
      jsonDoc['~status'] = "pending";
    }
    return jsonDoc;
  }

  function createAndSendTestDoc() {
    console.log('docName:' + timingCommandDocName);
    var testdoc = createTestDocument()
    _setUpHttpRequest(
        {
          "method": "PUT"
          , "url": LOCAL_COUCHDB_LOW_LEVEL_DB + timingCommandDocName
          , "data": testdoc
          , "json": isJson(testdoc)
        }
    );


  }

  function pushDocument(documentName, jsonDocument)
  {
    console.log('pushing doc in local db...');
    _setUpHttpRequest(

      {
        "method":"PUT"
        ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + documentName
        ,"data":jsonDocument
        ,"json":isJson(jsonDocument)
      }
    );
  }
  function fetchDocument() {
    console.log('sending GET for: '+timingCommandDocName);
    _setUpHttpRequest(

      {
        "method":"GET"
        ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + timingCommandDocName
      }
    );

  }

  function pollLocalDBTillDocIsInPendingState()
  {
    var count = 0;
    while (JSON.parse(g_httpResponse)['~status'] === "pending") {
      sleep(1000);
      console.log("zzzz sleeping... " + count);
      if(count++==MAX_ITERATIONS) break;
      fetchDocument();
    }
  }

  _setUpHttpRequest({method:'GET',url:WEB_PROTOCOL+'pmapi/user/name'});
  g_user = g_httpResponse;

  /*
  TESTS
  */

  describe('PredixMobile API Timing Tests [createTimingDocument]::', function() {

    describe('Create and process a command::', function() {

      it("Create a timing command by posting to the local CouchDb", function () {
        createAndSendTestDoc();
        expect(g_httpStatus).toEqual(201,"the status should not be a failure.");
        expect(g_httpResponse.indexOf("true")).not.toEqual(-1,"true should be found in the response.");
      });
    });

    describe('fetch a command doc::', function() {
      it("Verify command synced to the backend, processed and sycned back to the client", function () {

        fetchDocument();
        pollLocalDBTillDocIsInPendingState();
        console.log('passed one iteration, g_httpResponse :' + g_httpResponse);
        console.log('trying to add CMD_PROCESSOR_RCVD_TS--->');
        modJsonDocument = updateDocument(JSON.parse(g_httpResponse));
        console.log('trying to add TS_CL_RCVD--->');
        updateDocument(modJsonDocument);
        expect(modJsonDocument['~status']).not.toEqual("pending");
        expect(g_httpStatus).toEqual(200,"the status should not be a failure");
        expect(g_httpResponse.indexOf(timingCommandDocName)).not.toEqual(-1);
        //pushDocument(docName, modJsonDocument);
        console.log('Done warm-up test.');
      });

    });

    // Considering above one as a warm up :-)
    for (var i = 0; i < MAX_TESTS; i++) {

      describe('pushing doc again:', function() {
        console.log('TEST NUMBER:'+ i);

        it("pushing modified doc...", function () {
          // var jsonDocument = updateDocument(JSON.parse(g_httpResponse)); // will create new test and add TS_CL_PUSH
          console.log('updating again so that it can create a new result and add TS_CL_PUSH.');
          updateDocument(modJsonDocument); // adding TS_CL_PUSH
          console.log('marking it pending.');
          markItPending(modJsonDocument);
          console.log('pushinh it to local db.');
          pushDocument(timingCommandDocName, modJsonDocument);
        });

        it("fetching it again ...", function () {
          console.log('fetching the doc again.');
          fetchDocument();
          pollLocalDBTillDocIsInPendingState();
          console.log('passed one iteration, g_httpResponse :' + g_httpResponse);
          console.log('trying to add CMD_PROCESSOR_RCVD_TS to newly parsed doc. --->');
          modJsonDocument = updateDocument(JSON.parse(g_httpResponse));
          //updateDocument(modJsonDocument); //CMD_PROCESSOR_RCVD_TS
          console.log('trying to add TS_CL_RCVD--->');
          updateDocument(modJsonDocument);

          expect(modJsonDocument['~status']).not.toEqual("pending");
          expect(g_httpStatus).toEqual(200);
          expect(g_httpResponse.indexOf(timingCommandDocName)).not.toEqual(-1);
          // pushDocument(docName, modJsonDocument);
          console.log('completed test number: '+i);
        });

      });
    }

  });
