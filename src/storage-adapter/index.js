"use strict";
exports.__esModule = true;
var storage_providers_1 = require("./storage-providers");
var StorageAdapter = /** @class */ (function () {
    /**
     *
     * @param config
     * {
     *  "powergate": {config here}
     * }
     */
    function StorageAdapter(config) {
        this.config = config;
        // initialize the storage provider
        this.storageProvider = new storage_providers_1["default"](this.config.powergate);
    }
    StorageAdapter.prototype.store = function (address, cid, config) {
        if (!config) {
            config = this.config;
        }
        if (!address) {
            // TODO: Log error
            throw Error("An Ethereum address should be passed as an argument in the store function");
        }
        return this.storageProvider.store(address, cid, config);
    };
    StorageAdapter.prototype.getStorageInfo = function (cid) {
        console.log('cid in storage-adapter');
        return this.storageProvider.getStorageInfo(cid);
    };
    StorageAdapter.prototype.retrieveFile = function (cid) {
        console.log('cid in storage-adapter');
        return this.storageProvider.retrieveFile(cid);
    };
    return StorageAdapter;
}());
exports["default"] = StorageAdapter;
