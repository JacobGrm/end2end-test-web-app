/**
 * Created by 204071207 on 5/20/16.
 */


var versionService_async = versionService_async || {};
versionService_async.subns = (function() {


    function getVersion(callback) {

        _setUpHttpRequestAsync(
            {
                "method":"GET"
                ,"url":versionService
            },callback
        );
    }

    function setVersion(data,callback) {

        _setUpHttpRequestAsync(
            {
                "method":"PUT"
                ,"url":versionService
                ,"data":data
                ,"json":isJson(data)
            },callback
        );
    }




    describe('Version service should returns information about the container (versionService_async.js)::', function() {

        // Get Properties for the application container common for all platforms
        beforeAll(function(done) {

            getVersion(done);
        });

        it("Verfify 200 status and Properties for the application container",function() {

            console.log("RESPONSE g_httpResponse: "+g_httpResponse);

            expect(g_httpStatus).toEqual(200);

            var objVer = JSON.parse(g_httpResponse);

            //expect(typeof objVer.application_build_version).not.toEqual("undefined", "application_build_version is wrong");
            expect(typeof objVer.server_hostname).not.toEqual("undefined", "server_hostname is wrong");
            expect(typeof objVer.device_OS).not.toEqual("undefined", "device_OS is wrong");
            expect(typeof objVer.device_OS_version).not.toEqual("undefined", "device_OS_version is wrong");
            expect(typeof objVer.database_version).not.toEqual("undefined", "database_version should be there");
            expect(typeof objVer.locale).not.toEqual("undefined", "locale is wrong");

            // Added to documentation by Jeremy
            expect(typeof objVer.predix_mobile_sdk_version).not.toEqual("undefined", "predix_mobile_sdk_version should be defined");
            expect(typeof objVer.predix_mobile_sdk_build_version).not.toEqual("undefined", "predix_mobile_sdk_build_version should be defined");

        });


        it("Verify keys provided for compatibility. May be deprecated in the future",function(){

            var objVer = JSON.parse(g_httpResponse);

            // To be deprecated in future
            expect(objVer.PredixMobileVersion).toEqual(objVer.predix_mobile_sdk_build_version, "PredixMobileVersion should be there");
            expect(typeof objVer.ContainerVersion).not.toEqual("undefined", "ContainerVersion should be there");
            expect(objVer.ContainerVersion).toEqual(objVer.application_build_version, "ContainerVersion should be the same as application_build_version");
            expect(objVer.SyncGateway).toEqual(objVer.server_hostname, "SyncGateway should be there");

        },IOS_ONLY);

        it("Verify Properties for the application container that are present in IOS only", function () {

            var objVer = JSON.parse(g_httpResponse);

            expect(typeof objVer.application_build_version).not.toEqual("undefined", "application_build_version is wrong");
            expect(typeof objVer.application_version).not.toEqual("undefined");
            expect(typeof objVer.application_bundle_id).not.toEqual("undefined");

        }, IOS_ONLY);


        it("Verify Properties for the application container that are present in IOS/Android only", function () {

            var objVer = JSON.parse(g_httpResponse);
            expect(typeof objVer.device_model).not.toEqual("undefined", "device_model is wrong");

        }, IOS_ONLY+ANDR_ONLY);


        it("Verify Properties for the application container that are present in Desktop Reference App", function () {

            var objVer = JSON.parse(g_httpResponse);
            expect(typeof objVer.java_version).not.toEqual("undefined", "java_version should be there");

        },MAC_ONLY);

        it("Verify Properties for the application container that are present in Electron only", function () {

            var objVer = JSON.parse(g_httpResponse);

            expect(typeof objVer.electron_version).not.toEqual("undefined", "electron_version should be there");
            expect(typeof objVer.java_version).not.toEqual("undefined", "java_version should be there");

        }, ELCR_ONLY);

        it("Attempt to issue PUT call to set version",function(done){

            var dataVer = {
                "SyncGateway": "pm-api-gateway.run.aws-usw02-pr.ice.predix.io",
                "ContainerVersion": "2.0",
                "PredixMobileVersion": "2.5.312"
            };

            setVersion(dataVer,done);
        });

        it("Only Get is allowed, otherwise should return 405", function () {

            expect(g_httpStatus).toEqual(405,"405 status expected");
        });


    });

})();
