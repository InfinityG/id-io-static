/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', 'config', 'tokenService', 'keyService',
                            'cryptoService', 'blobService', 'localStorageService'];

    var registrationFactory = function ($http, $rootScope, config, tokenService, keyService,
                                        cryptoService, blobService, localStorageService) {

        var identityBase = config.identityHost, nacl = config.nacl, factory = {};

        factory.generateKeys = function(){
          return keyService.generateSigningKeyPair();
        };

        factory.register = function (userName, password, publicKey, secretKey) {

            var userData = {username: userName, password: password};

            //return $http.post(identityBase + '/users', userData, {'withCredentials': false})
            //    .then(function (response) {
            //        var data = response.data;
            //
            //        //generate an AES key
            //        var cryptoKey = keyService.generateAESKey(password, nacl);
            //
            //        //encrypt the secret
            //        var encryptedSecret = cryptoService.encryptString(cryptoKey, secretKey);
            //
            //        //generate wallet
            //        var wallet = {keys: {pk: publicKey, sk: encryptedSecret}};
            //
            //        //save in local storage
            //        localStorageService.saveWallet(userName, wallet);
            //
            //        //emit this to be used for encrypting newly generated secret signing keys
            //        $rootScope.$broadcast('registrationEvent', {userId: data.id, key: cryptoKey});
            //
            //    });

            //check the user doesn't already exist (TODO: this needs to check both localstorage and the blockchain)
            var wallet = localStorageService.getWallet(userName);

            if(wallet != null){
                $rootScope.$broadcast('registrationEvent', {
                    type: 'Error',
                    message: 'Username already exists!'
                });

                return;
            }


            //initialize blob for the user
            blobService.initializeBlob(userName);

            //generate an AES key
            var cryptoKey = keyService.generateAESKey(password, nacl);

            //encrypt the secret
            var encryptedSecret = cryptoService.encryptString(cryptoKey, secretKey);

            //generate wallet
            var wallet = {keys: {pk: publicKey, sk: encryptedSecret}};

            //save in local storage
            localStorageService.saveWallet(userName, wallet);

            $rootScope.$broadcast('registrationEvent', {
                type: 'Success',
                message: 'User registration successful!',
                userName: userName,
                key: cryptoKey
            });
        };

        return factory;
    };

    registrationFactory.$inject = injectParams;

    angular.module('id-io').factory('registrationService', registrationFactory);

}());