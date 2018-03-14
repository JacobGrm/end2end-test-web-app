var g_httpResponse;
var g_httpStatus;
var g_user;

function resetGlobalVar(){

    // set to undefined
    g_httpResponse=(function () { return; })();
    g_httpStatus=(function () { return; })();

};


beforeAll(function(){

   //setUser();
    g_user = "jacob_ge_com";
});


function randomNumber(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
};


// The returned value is no lower than (and may possibly equal) min, and is less than (but not equal to) max.
function randomNumberExclusive(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;
};



function generateUniqueId(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
};

function sleep(dur) {
    var d = new Date().getTime() + dur;
    while(new Date().getTime() <= d ) {
        //Do nothing
    }

};

function stripQuotes(str) {

    return str.replace(/^"(.*)"$/, '$1');

};

function generateJSON_UniqueKeys(numberOfKeys) {

    jsonObj = {};

    for(var i=0; i<numberOfKeys; i++) {

        jsonObj["key_"+randomNumber(100,1000)]="value_"+i;
    }

    return jsonObj;

};

/**
 * As all primitive data structures in Javascript are JSON, this method always returns true.
 * This method is only invoked from mime-type decision logic, which should always be application/json.
 */
function isJson(obj) {
    // var t = typeof obj;
    // return ['boolean', 'number', 'string', 'symbol', 'function', 'undefined'].indexOf(t) == -1;
    // sending to the server is always JSON in newest API revision.
    return true;
};
/**
 * This method is only invoked in response type detection, and so is named accordingly.  
 * Functionality is effectively "isHigherOrderJSON".
 */
function isJsonReceived(obj) {
    var t = typeof obj;
    return ['boolean', 'number', 'string', 'symbol', 'function', 'undefined'].indexOf(t) == -1;
}

/*
    API calls

 */

function _setUpHttpRequest(options) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {

            g_httpResponse = xmlhttp.responseText;
            g_httpStatus = xmlhttp.status;
        }
    };

    xmlhttp.open(options.method, options.url, false);


    if(options.json === true) {

        xmlhttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
        xmlhttp.send( JSON.stringify(options.data) );

    } else if (options.json === false) {

        xmlhttp.setRequestHeader("Content-type","application/text;charset=UTF-8");
        xmlhttp.send(options.data);

    } else if (typeof  options.json === 'undefined') {

        xmlhttp.send();
    }

};


function _setUpHttpRequestAsync(options, callback) {

    console.log("_setUpHttpRequestAsync call: "+options.method+ " "+options.url+ " "+JSON.stringify(options.data));

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {

            resetGlobalVar();

            g_httpResponse = xmlhttp.responseText;
            g_httpStatus = xmlhttp.status;

            if(typeof callback != 'undefined') {

                expect(g_httpStatus).not.toEqual('undefined'); // to supress jasmine warning
                callback();
            }
        }
    };

    xmlhttp.open(options.method, options.url, true);


    if(options.json === true) {

        xmlhttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
        xmlhttp.send( JSON.stringify(options.data) );

    } else if (options.json === false) {

        xmlhttp.setRequestHeader("Content-type","application/text;charset=UTF-8");
        xmlhttp.send(options.data);

    } else if (typeof  options.json === 'undefined') {

        xmlhttp.send();
    }

};



function logWrite(data) {

    _setUpHttpRequest(
        {
            "method":"PUT"
            ,"url":CLIENT_LOGGIN_SERVICE
            ,"data":data
            ,"json":isJson(data)
        }
    );
};

function constructStringOfLen(len, ch) {
    var str = "";
    for (var i = 0; i < len; i++) {
        str += ch;
    }
    return str;
};

function createCbDocument(id, data) {

    _setUpHttpRequest(

        {
            "method":"PUT"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
            ,"data":data
            ,"json":isJson(data)
        }
    );
};


function createCbDocumentAsync(id, data, callback) {

    _setUpHttpRequestAsync(

        {
            "method":"PUT"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + id
            ,"data":data
            ,"json":isJson(data)
        },callback
    );
};


function getDocuments(filter ) {

    //console.log("calling getDocuments() with filter: "+LOCAL_COUCHDB_LOW_LEVEL_DB + filter)

    _setUpHttpRequest(

        {
            "method":"GET"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + filter
        }
    );

};


function getDocumentsAsync(filter, callback ) {

    _setUpHttpRequestAsync(

        {
            "method":"GET"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + filter
        },callback
    );

};

function poll(fn, callback, errback, timeout, interval) {

    var endTime = Number(new Date()) + (timeout || 10000);
    interval = interval || 1000;

    (function p() {
        // If the condition is met, we're done!
        if(fn()) {
            callback();
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {

            setTimeout(p, interval);
        }
        // Didn't match and too much time, reject!
        else {
            errback(new Error('timed out for ' + fn + ': ' + arguments));
        }
    })();
    
};

function displayWebApp(appName){

    _setUpHttpRequest(
        {
            "method":"POST"
            ,"url":windowService+"pane"+"?webapp="+appName
        }
    );
};


function displayWebAppAsync(appName, callback){

    _setUpHttpRequestAsync(
        {
            "method":"POST"
            ,"url":windowService+"pane"+"?webapp="+appName
        },callback
    );
};


function setUser(){

    _setUpHttpRequest({method:'GET',url:'http://pmapi/user/name'});
    g_user = g_httpResponse;

};

// Turn execution of tests ON/OFF depending on platform
var origit = it;
it = function(testcase_desc, closure, platform) {

    if(typeof platform === 'string' && platform.indexOf(window.navigator.platform) === -1)
        return;

    return origit(testcase_desc, closure);
};


function getReplicationConfiguration(callback) {

    _setUpHttpRequestAsync(
        {
            "method":"GET"
            ,"url":LOCAL_COUCHDB_HIGH_LEVEL+"replication"
        },callback
    );
};


//******* Secure Storage Service methods ****** //

function saveDataToStorage(data) {


    _setUpHttpRequest(
        {
            "method": "POST"
            , "url": secureStorageService
            , "data": data
            , "json": isJson(data)
        }
    );

};

function saveDataToStorageAsync(data,callback) {


    _setUpHttpRequestAsync(
        {
            "method": "POST"
            , "url": secureStorageService
            , "data": data
            , "json": isJson(data)
        },callback
    );

};


function getStorageData(key, dataPrompt) {

    if (typeof dataPrompt === 'undefined')
        dataPrompt = "";
    else
        dataPrompt = "/" + dataPrompt;

    _setUpHttpRequest(
        {
            "method": "GET"
            , "url": secureStorageService + "/" + key + "?prompt=" + dataPrompt
        }
    );
};


function getStorageDataAsync(key, callback, dataPrompt) {

    var url = null;

    if (typeof dataPrompt === 'undefined') {
        url = encodeURI(secureStorageService + "/" + key);
    }else{
        url = encodeURI(secureStorageService + "/" + key + "?prompt=" + dataPrompt);
    }

    _setUpHttpRequestAsync(
        {
            "method": "GET"
            , "url": url
        },callback
    );
};


function getCurrentUserName(callback) {

    _setUpHttpRequestAsync(
        {
            "method":"GET"
            ,"url":userInformationService + "username"
        },callback
    );
};


function deleteDocument(id,callback) {

    _setUpHttpRequestAsync(

        {
            "method":"DELETE"
            ,"url":encodeURI(LOCAL_COUCHDB_HIGH_LEVEL + "document/"+id)
        },callback
    );
};


function createDocumentPOST(dic,callback,id) {

    if (typeof id === 'undefined')
        id = "";
    else
        id = "/" + id;

    _setUpHttpRequestAsync(

        {
            "method":"POST"
            ,"url":encodeURI(LOCAL_COUCHDB_HIGH_LEVEL + "document"+id)
            ,"data":dic
            ,"json":isJson(dic)
        },callback
    );
};


function modifyDocumentPUT(id,dic,callback) {

    _setUpHttpRequestAsync(

        {
            "method":"PUT"
            ,"url":encodeURI(LOCAL_COUCHDB_HIGH_LEVEL + "document/"+id)
            ,"data":dic
            ,"json":isJson(dic)
        },callback
    );
};


function getRegisteredNotifcationListeners(name, callback) {

    if(typeof name === 'undefined')
        name = "";
    else
        name = "/"+name;

    _setUpHttpRequestAsync(
        {
            "method":"GET"
            ,"url":notifyService+"events"+name
        },callback
    );
};


function unsubscribeFromNotification(name,callback) {

    _setUpHttpRequestAsync(
        {
            "method":"DELETE"
            ,"url":notifyService+"events/"+name
        },callback
    );
};


//******* End Secure Storage Service methods ****** //


function addPushReplicationFilter(data, callback) {

    _setUpHttpRequestAsync(

        {
            "method":"PUT"
            ,"url":LOCAL_COUCHDB_HIGH_LEVEL + "replication/push"
            ,"data":data
            ,"json":isJson(data)
        },callback
    );
};

function createDocumentsBulkAsync(data, callback) {

    _setUpHttpRequestAsync(

        {
            "method":"POST"
            ,"url":LOCAL_COUCHDB_LOW_LEVEL_DB + "_bulk_docs"
            ,"data":data
            ,"json":isJson(data)
        },callback
    );
};





