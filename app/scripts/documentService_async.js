/**
 * Created by 204071207 on 6/16/16.
 */

/*

       Should be "ELECTRON ONLY" test
        In the case of iOS/Android/Java the user would need to use the
        CDB service or the new DB service coming in Delmar (note from Jeremy)
        3/28/2017

 */

var documentService_async = documentService_async || {};
documentService_async.subns = (function() {


    var documentRelativePath = "res/sampleDoc.pdf";
    var documentAbsolutePath = null;

    function getDocumentPath(docRelativePath) {

        var list = window.location.pathname.split("/");
        list.pop(); // remove "index.html"
        list.push(docRelativePath)
        var finalURL = list.join("/");

        return finalURL;

    };

    function openDocumentInViewer(httpBody, callback) {


        _setUpHttpRequestAsync(
            {
                "method": "POST"
                , "url": documentService
                , "data": httpBody
                , "json": isJson(httpBody)
            },callback
        );

    };


    describe(" **** ELECTRON ONLY ***** Launch native viewer to view document (documentService_async.js)::", function() {


        it("Open document from the web in pdf viewer", function (done) {

            documentAbsolutePath = "http://www.orimi.com/pdf-test.pdf";

            var data = {

                "url": documentAbsolutePath,
                "sharing" : "yes"
            };

            console.log("Web doc url: " + data.url);

            openDocumentInViewer(data,done);

        },ELCR_ONLY);

        it("Verify API call returned 200 status (DE24658 PMJ)", function () {

            expect(g_httpStatus).toEqual(200, "Status is not 200 (DE24658 PMJ)");

        },ELCR_ONLY);


        // This test may be failing in windows if path to
        // local .pdf file is too long
        it("Open local document in pdf viewer", function (done) {

            // Get path to local document
            //documentAbsolutePath = getDocumentPath(documentRelativePath);
            documentAbsolutePath = "C:/tmp/sampleDoc.pdf";

            var data = {

                "url": documentAbsolutePath,
                "sharing" : "yes"
            };

            console.log("Local doc path: " + data.url);

            openDocumentInViewer(data,done);

        },ELCR_ONLY);

        it("Verify status 200 if doc was open in a viewer", function () {

            expect(g_httpStatus).toEqual(200, "Check path to pdf file. Test will fail if path is too long");

        },ELCR_ONLY);

        it("Status 400 if required request parameters are missing", function (done) {

            // missed "url": documentAbsolutePath,
            var data = {

                "sharing" : "yes"
            };

            openDocumentInViewer(data,done);

        },ELCR_ONLY);

        it("Verify API call returned 400 status", function () {

            expect(g_httpStatus).toEqual(400);

        },ELCR_ONLY);

    });

})();

