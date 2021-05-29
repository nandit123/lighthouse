"use strict";
exports.__esModule = true;
var Web3 = require("web3");
var contract_1 = require("./contract");
var Infura = /** @class */ (function () {
    function Infura(url, storageAdapter) {
        this.storageAdapter = storageAdapter;
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(url));
        this.contract = new this.web3.eth.Contract(contract_1.abi, contract_1.contractAddress, {
            from: "0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579",
            gasPrice: "20000000000"
        });
    }
    Infura.prototype.start = function () {
        this.contract.events.StorageRequest(function (error, event) {
            if (error) {
                // TODO:  Log error
                throw Error(error);
            }
            else {
                console.log(event.returnValues);
            }
        });
    };
    return Infura;
}());
exports["default"] = Infura;
