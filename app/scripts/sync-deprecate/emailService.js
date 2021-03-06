/**
 * Created by 204071207 on 6/10/16.
 */


var emailServiceTest = emailServiceTest || {};
emailServiceTest.subns = (function() {

    var base64EncodedFile = null;
    var attachemtRelativePath = "res/kitten.bmp";

    function getEmailAttachmentPath(attachmentRelativePath) {

        var list = window.location.pathname.split("/");
        list.pop(); // remove "index.html"
        list.push(attachmentRelativePath)
        var finalURL = list.join("/");

        return finalURL;

    };

    function readFileasBase64(path)
    {
        var fileObj = new File([path], path);

        var fileReader  = new FileReader();

        fileReader.addEventListener("load", function (data) {

            base64EncodedFile = data.currentTarget.result;
        }, false);

        fileReader.readAsDataURL(fileObj);
    };

    function sendEmail(httpBody) {


        _setUpHttpRequest(
            {
                "method": "POST"
                , "url": emailService
                , "data": httpBody
                , "json": isJson(httpBody)
            }
        );

    };


    describe('Bring up email composer from within the current app (emailService.js)::', function() {

        // Get path to email attachment

        beforeAll(function(done) {

            var path = getEmailAttachmentPath(attachemtRelativePath);

            var fileObj = new File([path], path);

            var fileReader  = new FileReader();

            fileReader.addEventListener("load", function (data) {

                base64EncodedFile = data.currentTarget.result;
                done();

            }, false);

            fileReader.readAsDataURL(fileObj);
        });


        it("Compose email without attachment", function () {

            var data_no_attachment = {

                "to" : ["to1@company.com", "to2@company.com"],
                "cc" : ["cc@company.com"],
                "bcc" : ["bcc@company.com"],
                "subject" : "Email Test",
                "body" : "Hello from Email Service Test!!!"
            };

            sendEmail(data_no_attachment);
            expect(g_httpStatus).toEqual(200);

        },ELCR_ONLY);


        it("Compose email with attachment", function () {

            console.log("base64EncodedFile VALUE: "+ base64EncodedFile);

            expect(base64EncodedFile).not.toEqual(null);

            var data_with_attachment = {

                "to" : ["to1@company.com", "to2@company.com"],
                "cc" : ["cc@company.com"],
                "bcc" : ["bcc@company.com"],
                "subject" : "Email Test",
                "body" : "Hello from Email Service Test!!!",
                "attachments" :
                    [
                        {
                            "filename": "kitten.bmp",
                            "mimetype" : "image/bmp",
                            "attachment": base64EncodedFile
                        }
                    ]
            };

            console.log("ATTACHMENT: "+ data_with_attachment.attachments[0].attachment);

            sendEmail(data_with_attachment);
            expect(g_httpStatus).toEqual(200);

        },ELCR_ONLY);


    });

})();
