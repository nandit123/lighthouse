"use strict";
exports.__esModule = true;
var infura_1 = require("./infura");
var vulcanize_1 = require("./vulcanize");
var storage_adapter_1 = require("../storage-adapter");
var Parser = /** @class */ (function () {
    function Parser(config, infuraURL, vulcanizeURL) {
        this.config = config;
        this.storageAdapter = new storage_adapter_1["default"](this.config);
        this.infura = new infura_1["default"](infuraURL, this.storageAdapter);
        this.vulcanize = new vulcanize_1["default"](vulcanizeURL, this.storageAdapter);
    }
    Parser.prototype.start = function () {
        // Use Infura as a fallback source
        // When the Lighthouse node starts, if we get a response from Vulcanize
        // before the set Timeout, then we woud use Vulcanize, otherwise, use Infura
        this.vulcanize.start();
        this.infura.start();
    };
    return Parser;
}());
exports["default"] = Parser;
