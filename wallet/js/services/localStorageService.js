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

        /*
         CONNECTIONS
         */

        factory.getConnections = function (userName) {
            var blob = factory.getBlob(userName);
            var result = blob.connections;

            result.sort(function (a, b) {
                return a.first_name > b.first_name;
            });

            return result;
        };

        factory.saveConnections = function (userName, connections) {
            var blob = factory.getBlob(userName);
            blob.connections = connections;
            factory.saveBlob(userName, blob);
        };

        factory.saveConnection = function (userName, connection) {
            var blob = factory.getBlob(userName);
            var connections = blob.connections;

            // if this is an update, then remove and re-add
            if(connection.id != null && connection.id > 0)
            {
                for(var x=0; x<connections.length; x++){
                    if(connections[x].id == connection.id){
                        connections.splice(x, 1);
                        break;
                    }
                }
            }

            connections.push(connection);
            factory.saveBlob(userName, blob);
        };

        factory.getConnection = function (userName, id) {
            var connections = factory.getConnections(userName);

            for (var i = 0; i < connections.length; i++) {
                if (connections[i].id == id)
                    return connections[i];
            }
        };

        factory.deleteConnection = function (userName, id) {
            var blob = factory.getBlob(userName);
            var connections = blob.connections;

            for (var i = 0; i < connections.length; i++) {
                if (connections[i].id == id) {
                    connections.splice(i, 1);
                }
            }

            factory.saveBlob(userName, blob);
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