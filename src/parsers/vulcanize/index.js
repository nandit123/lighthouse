"use strict";
exports.__esModule = true;
var kik = require('kikstart-graphql-client');
var query = "subscription SubscriptionEvents {\n    listen(topic: \"events\") {\n      relatedNode {\n        ... on ContractId1EventId1 {\n          eventId\n          mhKey\n          dataUploader\n          dataCid\n          dataConfig\n          id\n          headerId\n        }\n      }\n    }\n  }";
var client = new kik.GraphQLClient({
    uri: 'https://rinkeby-watcher.vdb.to/graphql',
    wsUri: 'wss://rinkeby-watcher.vdb.to/graphql'
});
var Vulcanize = /** @class */ (function () {
    function Vulcanize(url, storageAdapter) {
        this.storageAdapter = storageAdapter;
    }
    Vulcanize.prototype.modifyConfig = function (config) {
        config = config.replace(/ /g, '');
        config = config.replace(/([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)/g, "\"$1\":\"$2\"");
        config = config.replace(/(\w+:)|(\w+ :)/g, function (matchedStr) {
            return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
        });
        return config;
    };
    // make call to vulcanize graphql here to get the event
    Vulcanize.prototype.start = function () {
        var _this = this;
        console.log('entered vulcanize');
        client.runSubscription(query)
            .subscribe({
            next: function (res) {
                console.log(JSON.stringify(res.data));
                console.log('cid:', res.data.listen.relatedNode.dataCid);
                console.log('config:', res.data.listen.relatedNode.dataConfig);
                console.log('address:', res.data.listen.relatedNode.dataUploader);
                var cid = res.data.listen.relatedNode.dataCid;
                // let config = JSON.parse(res.data.listen.relatedNode.dataConfig); // parse the config stringified object
                var configString = res.data.listen.relatedNode.dataConfig;
                var config = JSON.parse(_this.modifyConfig(configString));
                var address = '0x' + res.data.listen.relatedNode.dataUploader;
                var jobId = _this.storageAdapter.store(address, cid, config);
                console.log('cid:', res.data.listen.relatedNode.dataCid, '& jobId:', jobId);
            },
            error: function (error) { return console.error(error); },
            complete: function () { return console.log('done'); }
        });
    };
    return Vulcanize;
}());
exports["default"] = Vulcanize;
