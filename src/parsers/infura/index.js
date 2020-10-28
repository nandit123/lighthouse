"use strict";
exports.__esModule = true;
var Web3 = require("web3");
var contract_1 = require("./contract");
var Infura = /** @class */ (function () {
    function Infura(url, storageAdapter) {
        this.storageAdapter = storageAdapter;
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(url));
        this.contract = new this.web3.eth.Contract([
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: "address",
                        name: "uploader",
                        type: "address"
                    },
                    {
                        indexed: false,
                        internalType: "string",
                        name: "cid",
                        type: "string"
                    },
                    {
                        indexed: false,
                        internalType: "string",
                        name: "config",
                        type: "string"
                    },
                    {
                        indexed: false,
                        internalType: "enum FPS.storageStatus",
                        name: "status",
                        type: "uint8"
                    },
                ],
                name: "CidStatusUpdate",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: "address",
                        name: "uploader",
                        type: "address"
                    },
                    {
                        indexed: false,
                        internalType: "string",
                        name: "cid",
                        type: "string"
                    },
                    {
                        indexed: false,
                        internalType: "string",
                        name: "config",
                        type: "string"
                    },
                ],
                name: "StorageRequest",
                type: "event"
            },
            {
                inputs: [
                    {
                        internalType: "string",
                        name: "cid",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "config",
                        type: "string"
                    },
                ],
                name: "store",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "string",
                        name: "cid",
                        type: "string"
                    },
                    {
                        internalType: "enum FPS.storageStatus",
                        name: "status",
                        type: "uint8"
                    },
                ],
                name: "updateStorageStatus",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
        ], contract_1.contractAddress, {
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
