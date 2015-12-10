var g_httpResponse;
var g_httpStatus;
var g_xmlhttp;


afterEach(function() {

    if(typeof g_xmlhttp != 'undefined')
        g_xmlhttp.abort();
});

var helper = {
    trigger: function(obj, name) {
        var e = document.createEvent('Event');
        e.initEvent(name, true, true);
        obj.dispatchEvent(e);
    }
};


function randomNumber(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function isJson(obj) {
    var t = typeof obj;
    return ['boolean', 'number', 'string', 'symbol', 'function'].indexOf(t) == -1;
};

/*
    API calls

 */

function _setUpHttpRequest(options) {

    g_xmlhttp = new XMLHttpRequest();
    g_xmlhttp.onreadystatechange = function() {

        if (g_xmlhttp.readyState == XMLHttpRequest.DONE ) {

            g_httpResponse = g_xmlhttp.responseText;
            g_httpStatus = g_xmlhttp.status;
        }
    };

    g_xmlhttp.open(options.method, options.url, false);


    if(options.json === true) {

        g_xmlhttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
        g_xmlhttp.setRequestHeader("Content-length", options.data.length);
        g_xmlhttp.send(JSON.stringify(options.data));

    } else if (options.json === false) {

        g_xmlhttp.setRequestHeader("Content-type","application/text;charset=UTF-8");
        g_xmlhttp.setRequestHeader("Content-length", options.data.length);
        g_xmlhttp.send(JSON.stringify(options.data));


    } else if (typeof  options.json === 'undefined') {

        g_xmlhttp.send();
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

function ISODateString(d) {
    function pad(n) {return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())+'T'
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())+'-'
        + pad(d.getTimezoneOffset()/60)
};





