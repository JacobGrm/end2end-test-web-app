/**
 * Created by 204071207 on 5/20/16.
 */


var versionServiceTest = versionServiceTest || {};
versionServiceTest.subns = (function() {


    function getVersion() {

        _setUpHttpRequest(
            {
                "method":"GET"
                ,"url":versionService
            }
        );
    }

    function setVersion(data) {

        _setUpHttpRequest(
            {
                "method":"PUT"
                ,"url":versionService
                ,"data":data
                ,"json":isJson(data)
            }
        );
    }




    describe('Version service should returns information about the container (versionService.js)::', function() {


        it("Get Properties for the application container common for all platforms", function () {

            getVersion();
            expect(g_httpStatus).toEqual(200);

            var objVer = JSON.parse(g_httpResponse);

            expect(typeof objVer.application_build_version).not.toEqual("undefined");
            expect(typeof objVer.server_hostname).not.toEqual("undefined");
            expect(typeof objVer.device_model).not.toEqual("undefined");
            expect(typeof objVer.device_OS).not.toEqual("undefined");
            expect(typeof objVer.device_OS_version).not.toEqual("undefined");
            expect(typeof objVer.database_version).not.toEqual("undefined", "database_version should be there");
            expect(typeof objVer.locale).not.toEqual("undefined");

        });


        it("These keys provided for compatibility. May be deprecated in the future",function(){

            getVersion();
            expect(g_httpStatus).toEqual(200);

            var objVer = JSON.parse(g_httpResponse);

            // To be deprecated in future
            expect(objVer.PredixMobileVersion).toEqual(objVer.predix_mobile_sdk_build_version, "PredixMobileVersion should be there");
            expect(objVer.ContainerVersion).toEqual(objVer.application_build_version, "ContainerVersion should be there");
            expect(objVer.SyncGateway).toEqual(objVer.server_hostname, "SyncGateway should be there");

        });

        it("Get Properties for the application container that are present in IOS only", function () {

            getVersion();
            expect(g_httpStatus).toEqual(200);

            var objVer = JSON.parse(g_httpResponse);

            expect(typeof objVer.predix_mobile_sdk_version).not.toEqual("undefined");
            expect(typeof objVer.predix_mobile_sdk_build_version).not.toEqual("undefined");
            expect(typeof objVer.application_version).not.toEqual("undefined");
            expect(typeof objVer.application_bundle_id).not.toEqual("undefined");

        }, IOS_ONLY);


        it("Get Properties for the application container that are present in Electron only", function () {

            getVersion();
            expect(g_httpStatus).toEqual(200);

            var objVer = JSON.parse(g_httpResponse);

            expect(typeof objVer.electron_version).not.toEqual("undefined");
            expect(typeof objVer.java_version).not.toEqual("undefined", "java_version should be there");

        }, ELCR_ONLY);

        it("Only Get is allowed, otherwise should return 405", function () {

            var dataVer = {
                "SyncGateway": "pm-api-gateway.run.aws-usw02-pr.ice.predix.io",
                "ContainerVersion": "2.0",
                "PredixMobileVersion": "2.5.312"
            };

            setVersion(dataVer);
            expect(g_httpStatus).toEqual(405,"405 status expected");

        });


    });

})();
