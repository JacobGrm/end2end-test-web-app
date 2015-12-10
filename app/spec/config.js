/**
 * Created by 204071207 on 11/24/15.
 */

var CURRENT_USER = "jacob_ge_com";
// Env
var BACKEND_API_GATEWAY_URI = "https://jacob_grimberg-pm-api-gateway.grc-apps.svc.ice.ge.com";
//var BACKEND_API_GATEWAY_URI = "https://QA_PREDIX-pm-api-gateway.grc-apps.svc.ice.ge.com";

var API_HOST = "pmapi";
var BUCKET_NAME = "pm";
var COUCHDB_HIGH_LEVEL = "http://"+API_HOST+"/db/";
var LOCAL_COUCHDB_LOW_LEVEL = "http://"+API_HOST+"/cdb/"+BUCKET_NAME+"/";
var LOCAL_COUCHDB_HIGH_LEVEL = COUCHDB_HIGH_LEVEL+BUCKET_NAME+"/";
var CLIENT_LOGGIN_SERVICE = "http://"+API_HOST+"/log";

/***** SDK Posted Notifications *******/
var DATABASE_DOWNLOAD_NOTIFICATION = "DatabaseDownloadNotification";
var REACHABILITY_WATCHER_NOTIFICATION = "ReachabilityWatcherNotification";

