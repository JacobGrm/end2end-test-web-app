/**
 * Created by 204071207 on 2/8/16.
 */


    function getDeviceBiometricIdSupport() {

        _setUpHttpRequest(
            {
                "method": "GET"
                , "url": touchIdService
            }
        );
    };

    /**** TESTS *****/

    describe('Simple validation of device owner via biometrics (touchIdService.js)::', function () {

        it('Determine if device supports biometric identification', function () {

            getDeviceBiometricIdSupport();
            expect(g_httpStatus).toEqual(200, "Status code should be 200");

            var dic = JSON.parse(g_httpResponse);
            expect(dic.supported).not.toEqual('undefined');

            // not supported or simulator
            if (dic.supported === 'false') {

                console.log('biometric identification NOT supported....');
                expect(dic["fail-reason"]).toEqual('TouchIDNotEnrolled', 'Fail reason should be supplied when touchId not supported');
            }
            else {

                console.log('biometric identification supported....');
                expect(dic["fail-reason"]).toEqual(undefined, 'Fail-reason should not be there if touchId supported');
            }
        });

    });

