/**
 * Created by 204071207 on 11/24/15.
 */

var RUN_TESTS_ON_PAGE_LOAD = false;

/*** Env ****/

//Production
//var BACKEND_API_GATEWAY_URI = "https://bckquq.run.aws-usw02-pr.ice.predix.io"; // qa_space
//var BACKEND_API_GATEWAY_URI = "https://2uln02.run.aws-usw02-pr.ice.predix.io"; // qa_auto
var BACKEND_API_GATEWAY_URI = "https://98h7v1.run.aws-usw02-pr.ice.predix.io"; // qa_hybrid_db
//var BACKEND_API_GATEWAY_URI = "https://jg9m09.run.aws-usw02-pr.ice.predix.io"; // hybrid_empty
//var BACKEND_API_GATEWAY_URI = "https://ne66k1.run.aws-usw02-pr.ice.predix.io" // qa_test
//var BACKEND_API_GATEWAY_URI = "https://d4v3ar.run.aws-usw02-pr.ice.predix.io" // qa_jeremy

var REPORTER_URL = "e2ereporter.run.aws-usw02-pr.ice.predix.io"; //qa_hybrid_db
//var REPORTER_URL = "e2ereporter1.run.aws-usw02-pr.ice.predix.io"; //qa_space

var API_HOST = "pmapi";
var BUCKET_NAME = "pm";
var COUCHDB_HIGH_LEVEL = WEB_PROTOCOL+API_HOST+"/db/";
var LOCAL_COUCHDB_LOW_LEVEL = WEB_PROTOCOL+API_HOST+"/cdb/";
var LOCAL_COUCHDB_LOW_LEVEL_DB = LOCAL_COUCHDB_LOW_LEVEL+BUCKET_NAME+"/";
var LOCAL_COUCHDB_HIGH_LEVEL = COUCHDB_HIGH_LEVEL+BUCKET_NAME+"/";
var CLIENT_LOGGIN_SERVICE = WEB_PROTOCOL+API_HOST+"/log";

/***** SDK Posted Notifications *******/
var DATABASE_DOWNLOAD_NOTIFICATION = "DatabaseDownloadNotification";
var REACHABILITY_WATCHER_NOTIFICATION = "ReachabilityWatcherNotification";
var DOCUMENT_CHANGED_NOTIFICATION = "DocumentChangedNotification";
var DATABASE_CHANGED_NOTIFICATION = "DatabaseChangedNotification";
var DISK_SPACE_NOTIFICATION = "DiskSpaceNotification";
var LOW_MEMORY_NOTIFICATION = "LowMemoryNotification";


/**** Replacement app *****/
var REPLACEMENT_WEBAPP_ID = "webapp-replacement-e2e-app_0_0_2";
var REPLACEMENT_WEBAPP_NAME = "replacement-e2e-app";


/**** SERVICES ******/

var windowService = WEB_PROTOCOL+API_HOST+"/window/";
var connectivityService = WEB_PROTOCOL+API_HOST+"/connectivity/";
var notifyServiceLocal = WEB_PROTOCOL+API_HOST+"/notify/attime";
var loggingService = WEB_PROTOCOL+API_HOST+"/log";
var notifyService = WEB_PROTOCOL+API_HOST+"/notify/";
var userInformationService = WEB_PROTOCOL+API_HOST+"/user/";
var userSettingsService = WEB_PROTOCOL+API_HOST+"/usersettings/";
var openUrlService = WEB_PROTOCOL+API_HOST+"/openurl";
var touchIdService = WEB_PROTOCOL+API_HOST+"/touchid";
var secureStorageService = WEB_PROTOCOL+API_HOST+"/secstorage";
var barcodeScannerServiceURL = WEB_PROTOCOL+API_HOST+"/barcodescanner";
var versionService = WEB_PROTOCOL+API_HOST+"/version";
var emailService = WEB_PROTOCOL+API_HOST+"/email/compose";
var documentService = WEB_PROTOCOL+API_HOST+"/document/view";
var deviceOrientation = WEB_PROTOCOL+API_HOST+"/orientation";
var deviceProximity = WEB_PROTOCOL+API_HOST+"/proximity";


/***** CLIENT ENV ****/
var IOS_ONLY = 'iPhone'; // iPhone for IOS
var MAC_ONLY = 'MacIntel'; // Mac
var ELCR_ONLY = 'Win32'; // Electron on Windows
//var ANDR_ONLY = 'Linux'; // Android simulator
var ANDR_ONLY = 'Linux aarch64'; // Android device (Samsung Galaxy 7)


/***** Testing for conflicts created by command processor ******/
var g_initialDocumentId = "DOC_INITIAL_3988f6ac-652b-42cd-b7d7-6156d3202186";
var g_commandsSendCount = 50;
