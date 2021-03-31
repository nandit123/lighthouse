"use strict";
exports.__esModule = true;
var kik = require('kikstart-graphql-client');
var query = "subscription SubscriptionEvents {\n    listen(topic: \"events\") {\n      relatedNode {\n        ... on ContractId1EventId1 {\n          eventId\n          mhKey\n          dataUploader\n          dataCid\n          dataConfig\n          id\n          headerId\n        }\n      }\n    }\n  }";
var client = new kik.GraphQLClient({
    uri: 'http://localhost:5101/graphql',
    wsUri: 'ws://localhost:5101/graphql'
});
var Vulcanize = /** @class */ (function () {
    function Vulcanize(url, storageAdapter) {
        this.storageAdapter = storageAdapter;
    }
    // make call to vulcanize graphql here to get the event
    Vulcanize.prototype.start = function () {
        console.log('entered vulcanize');
        client.runSubscription(query)
            .subscribe({
            next: function (res) { return console.log(JSON.stringify(res.data)); },
            error: function (error) { return console.error(error); },
            complete: function () { return console.log('done'); }
        });
    };
    return Vulcanize;
}());
exports["default"] = Vulcanize;
