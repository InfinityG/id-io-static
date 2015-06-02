(function () {

    var injectParams = [];

    var localStorageFactory = function () {

        var factory = {};

        /*
         KEYS
         */

        factory.saveKeyPair = function (userName, keyPair) {
            var blob = factory.getBlob(userName);
            blob.wallet.keys = keyPair;

            factory.saveBlob(userName, blob);
        };

        factory.getKeyPair = function (userName) {
            var blob = factory.getBlob(userName);
            return blob.wallet.keys;
        };

        factory.deleteKeyPair = function (userName) {
            var blob = factory.getBlob(userName);
            blob.wallet.keys = {};
            factory.saveBlob(blob);
        };

        /*
         WALLET
         */
        factory.saveWallet = function (userName, wallet) {
            var blob = factory.getBlob(userName);
            blob.wallet = wallet;
            factory.saveBlob(userName, blob);
        };

        factory.getWallet = function (userName) {
            var blob = factory.getBlob(userName);

            return blob != null ? blob.wallet : null;
        };

        factory.deleteWallet = function (userName) {
            var blob = factory.getBlob(userName);
            blob.wallet = {};
            factory.saveBlob(blob);
        };

        ///*
        // SS_KEYS
        // */
        //factory.saveSsPair = function (userName, ssPair) {
        //    //adds a ssPair to a user
        //    var blob = factory.getBlob(userName);
        //    blob.ssKeys[ssPair[0]] = ssPair[1];
        //    factory.saveBlob(userName, blob);
        //};
        //
        //factory.saveSsPairs = function (userName, ssPairs) {
        //    //replaces all ssPairs for a user
        //    var blob = factory.getBlob(userName);
        //    blob.ssKeys = ssPairs;
        //    factory.saveBlob(userName, blob);
        //};
        //
        //factory.getSsPairs = function (userName) {
        //    var blob = factory.getBlob(userName);
        //    return blob.ssKeys;
        //};
        //
        //factory.deleteSsPair = function (userName, ssPair) {
        //    var blob = factory.getBlob(userName);
        //    delete blob.ssKeys[ssPair[0]];
        //    factory.saveBlob(blob);
        //};
        //
        //factory.deleteSsPairs = function (userName) {
        //    var blob = factory.getBlob(userName);
        //    blob.ssKeys = {};
        //    factory.saveBlob(blob);
        //};

        /*
        BLOBS
         */

        factory.saveBlob = function(userName, blob){
            var blobs = factory.getBlobs();

            // if no blobs array then create
            if(blobs == null)
                blobs = [];

            //replace blob if userName already exists
            for(var x=0; x<blobs.length; x++){
                if(blobs[x].userName == userName){
                    blobs.splice(x, 1);
                }
            }

            //add blob to blob array
            blobs.push({userName: userName, blob: blob});

            localStorage.removeItem('id-io.blobs');
            localStorage.setItem('id-io.blobs', JSON.stringify(blobs));
        };

        factory.deleteBlob = function(userName){
            var blobs = factory.getBlobs();

            for(var x=0; x<blobs.length; x++){
                if(blobs[x].userName == userName){
                    blobs.splice(x, 1);
                }
            }

            localStorage.removeItem('id-io.blobs');
            localStorage.setItem('id-io.blobs', JSON.stringify(blobs));
        };

        factory.getBlob = function(userName){
            var blobs = factory.getBlobs();

            if(blobs != null) {
                for (var x = 0; x < blobs.length; x++) {
                    if (blobs[x].userName == userName) {
                        return blobs[x].blob;
                    }
                }
            }

            return null;
        };

        factory.getBlobs = function(){
            var result = localStorage.getItem('id-io.blobs');
            return result != null ? JSON.parse(result) : null;
        };

        return factory;
    };

    localStorageFactory.$inject = injectParams;

    angular.module('id-io').factory('localStorageService', localStorageFactory);

}());