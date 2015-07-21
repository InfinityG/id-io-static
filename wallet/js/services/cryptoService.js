(function () {
    var injectParams = ['$rootScope'];

    var cryptoFactory = function ($rootScope) {

        var factory = {};

        /********************************
         SYMMETRIC ENCRYPTION - AES
         ********************************/

        factory.generateAESKey = function (password, nacl) {
            try {
                return cryptoUtil.AES.generateAESKey(password, nacl);
            }catch(e){
                raiseKeyError();
            }
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
                return cryptoUtil.AES.encryptBufferToBase64(cryptoKey, buffer);
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

        factory.validateSignature = function (messageDigest, signature, publicKey) {
            return cryptoUtil.ECDSA.validateSignature(messageDigest, signature, publicKey);
        };

        /***************************************
         Error events
         ***************************************/

        function raiseKeyError() {
            // invoke modal
            $rootScope.$broadcast('modalEvent', {
                type: 'Error',
                message: "Key error!",
                status: 0,
                redirect : false,
                redirectUrl : null
            });
        }

        function raiseDecryptionError() {
            // invoke modal
            $rootScope.$broadcast('modalEvent', {
                type: 'Error',
                message: "Decryption error!",
                status: 0,
                redirect : false,
                redirectUrl : null
            });
        }

        function raiseEncryptionError() {
            // invoke modal
            $rootScope.$broadcast('modalEvent', {
                type: 'Error',
                message: "Encryption error",
                status: 0,
                redirect : false,
                redirectUrl : null
            });
        }

        function raisePasswordError() {
            // invoke modal
            $rootScope.$broadcast('modalEvent', {
                type: 'Error',
                message: "Invalid password!",
                status: 0,
                redirect : true,
                redirectUrl : '/login'
            });
        }

        return factory;
    };

    cryptoFactory.$inject = injectParams;

    angular.module('id-io').factory('cryptoService', cryptoFactory);

}());