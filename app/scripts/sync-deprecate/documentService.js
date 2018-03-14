/**
 * Created by 204071207 on 6/16/16.
 */



var documentServiceTest = documentServiceTest || {};
documentServiceTest.subns = (function() {


    var documentRelativePath = "res/sampleDoc.pdf";
    var documentAbsolutePath = null;

    function getDocumentPath(docRelativePath) {

        var list = window.location.pathname.split("/");
        list.pop(); // remove "index.html"
        list.push(docRelativePath)
        var finalURL = list.join("/");

        return finalURL;

    };

    function openDocumentInViewer(httpBody) {


        _setUpHttpRequest(
            {
                "method": "POST"
                , "url": documentService
                , "data": httpBody
                , "json": isJson(httpBody)
            }
        );

    };


    describe('Launch native viewer to view document (documentService.js)::', function() {


        it("Open document from the web in pdf viewer", function () {

            documentAbsolutePath = "http://www.orimi.com/pdf-test.pdf";

            var data = {

                "url": documentAbsolutePath,
                "sharing" : "yes"
            };

            console.log("Web doc url: " + data.url);

            openDocumentInViewer(data);
            expect(g_httpStatus).toEqual(200);

        },ELCR_ONLY);


        // This test may be failing in windows if path to
        // local .pdf file is too long
        it("Open local document in pdf viewer", function () {

            // Get path to local document
            documentAbsolutePath = getDocumentPath(documentRelativePath);

            var data = {

                "url": documentAbsolutePath,
                "sharing" : "yes"
            };

            console.log("Local doc path: " + data.url);

            openDocumentInViewer(data);
            expect(g_httpStatus).toEqual(200, "Check path to pdf file. Test will fail if path is too long");

        },ELCR_ONLY);


        it("Status 400 if required request parameters are missing", function () {

            // missed "url": documentAbsolutePath,
            var data = {

                "sharing" : "yes"
            };


            openDocumentInViewer(data);
            expect(g_httpStatus).toEqual(400);

        },ELCR_ONLY);


    });

})();

