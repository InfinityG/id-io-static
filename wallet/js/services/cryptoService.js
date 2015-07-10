(function () {
    var injectParams = ['$rootScope'];

    var cryptoFactory = function ($rootScope) {

        var factory = {};

        /********************************
         SYMMETRIC ENCRYPTION - AES
         ********************************/

        factory.generateAESKey = function (password, nacl) {
            return cryptoUtil.AES.generateAESKey(password, nacl);
        };

        factory.validateAESKey = function (cryptoKey, cipherText) {
            try {
                return cryptoUtil.AES.validateAESKey(cryptoKey, cipherText);
            } catch (e) {
                raisePasswordError();
            }
        };

        factory.encryptSecret = function (cryptoKey, buffer) {
            try {
                cryptoUtil.AES.encryptBufferToBase64(cryptoKey, buffer);
            } catch (e) {
                raiseEncryptionError();
            }
        };

        factory.decryptSecret = function (cryptoKey, cipherText) {
            try {
                return cryptoUtil.AES.decryptBase64ToBuffer(cryptoKey, cipherText);
            } catch (e) {
                raiseDecryptionError();
            }
        };


        /******************************************
         ASYMMETRIC ENCRYPTION - ECDSA SIGNATURES
         *****************************************/

        factory.generateSigningKeyPair = function () {
            return cryptoUtil.ECDSA.createSigningKeyPair();
        };

        factory.createMessageDigest = function (message) {
            return cryptoUtil.ECDSA.createMessageDigest(message);
        };

        // returns a base64 encoded signed message
        factory.signMessage = function (messageDigest, privateKeyBuffer) {
            return cryptoUtil.ECDSA.signMessage(messageDigest, privateKeyBuffer);
        };

        /***************************************
         Error events
         ***************************************/

        function raiseDecryptionError() {
            //event for modals
            $rootScope.$broadcast('encryptionEvent', {
                type: 'Error',
                status: 0,
                message: "Decryption error!"
            });
        }

        function raiseEncryptionError() {
            //event for modals
            $rootScope.$broadcast('encryptionEvent', {
                type: 'Error',
                status: 0,
                message: "Decryption error!"
            });
        }

        function raisePasswordError() {
            //event for modals
            $rootScope.$broadcast('encryptionEvent', {
                type: 'Error',
                message: "Invalid password!"
            });
        }

        return factory;
    };

    cryptoFactory.$inject = injectParams;

    angular.module('id-io').factory('cryptoService', cryptoFactory);

}());