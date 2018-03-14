/**
 * Created by 204071207 on 2/23/16.
 */

/*

    Generated QR code image on http://createqrcode.appspot.com/
    to be scanned by the app.

 */

function barcodeScanner() {

    _setUpHttpRequest(
        {
            "method": "GET"
            , "url": barcodeScannerServiceURL
        }
    );
};

describe("Test barcode or QR code service (barcodeScannerService.js)::",function(){

    it("Verify barcode/QR code functionality",function(){

        barcodeScanner();
        expect(g_httpStatus).toEqual(200);
        var resp = JSON.parse(g_httpResponse);

        expect(typeof resp.barcode).not.toEqual(undefined);
    }, IOS_ONLY);

})