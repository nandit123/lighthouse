"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var kik = require('kikstart-graphql-client');
var Web3 = require("web3");
var abiEventStorageRequest = {
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "name": "uploader",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "cid",
            "type": "string"
        },
        {
            "indexed": false,
            "name": "config",
            "type": "string"
        },
        {
            "indexed": false,
            "name": "fileCost",
            "type": "uint256"
        }
    ],
    "name": "StorageRequest",
    "type": "event"
};
var abiEventStorageStatusRequest = {
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "name": "requester",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "cid",
            "type": "string"
        }
    ],
    "name": "StorageStatusRequest",
    "type": "event"
};
var query = "subscription SubscriptionEvents {\n    listen(topic: \"events\") {\n      relatedNode {\n        ... on ContractId1EventId1 {\n          eventId\n          mhKey\n          dataUploader\n          dataCid\n          dataConfig\n          id\n          headerId\n        }\n      }\n    }\n  }";
function modifyConfig(config) {
    config = config.replace(/ /g, '');
    config = config.replace(/([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)/g, "\"$1\":\"$2\"");
    config = config.replace(/(\w+:)|(\w+ :)/g, function (matchedStr) {
        return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
    });
    return config;
}
var client = new kik.GraphQLClient({
    uri: 'https://lighthouse.vdb.to/graphql',
    wsUri: 'wss://lighthouse.vdb.to/graphql'
});
var Vulcanize = /** @class */ (function () {
    function Vulcanize(url, storageAdapter) {
        this.storageAdapter = storageAdapter;
    }
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
                var configString = res.data.listen.relatedNode.dataConfig;
                var config = JSON.parse(modifyConfig(configString));
                var address = '0x' + res.data.listen.relatedNode.dataUploader;
                var jobId = _this.storageAdapter.store(address, cid, config);
                console.log('cid:', cid); //, '& jobId:', jobId)
            },
            error: function (error) { return console.error(error); },
            complete: function () { return console.log('done'); }
        });
    };
    Vulcanize.prototype.listenEventStorageRequest = function (storageAdapter) {
        console.log('Listening to Event Storage Request');
        var unindexedEventsStorageRequest = abiEventStorageRequest.inputs.filter(function (event) { return event.indexed === false; });
        var unindexedEventsStorageStatusRequest = abiEventStorageStatusRequest.inputs.filter(function (event) { return event.indexed === false; });
        var web3 = new Web3(process.env.ALCHEMY_WSS);
        var web3Http = new Web3(process.env.ALCHEMY_HTTPS);
        console.log('Alchemy_wss:', process.env.ALCHEMY_WSS);
        web3.eth.subscribe("logs", { "address": process.env.LIGHTHOUSE_SMART_CONTRACT }, function (error, result) {
            return __awaiter(this, void 0, void 0, function () {
                var data, event_1, cid, configString, config, address, jobId, event_2, cid, requester, storageInfo, dealProposals, dealList, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!error) return [3 /*break*/, 4];
                            console.log('result:', result);
                            data = result.data;
                            console.log('now going to decode the data:', result.data);
                            if (!data.fileCost) return [3 /*break*/, 1];
                            event_1 = web3Http.eth.abi.decodeLog(unindexedEventsStorageRequest, data);
                            console.log('event:', event_1);
                            console.log('address:', event_1.uploader);
                            console.log('cid:', event_1.cid);
                            console.log('config:', event_1.config);
                            console.log('fileCost:', event_1.fileCost);
                            cid = event_1.cid;
                            configString = event_1.config;
                            config = JSON.parse(modifyConfig(configString));
                            console.log('modifiedConfig:', config);
                            address = event_1.uploader;
                            jobId = storageAdapter.store(address, cid, config);
                            console.log('cid:', cid); //, '& jobId:', jobId)
                            return [3 /*break*/, 3];
                        case 1:
                            event_2 = web3Http.eth.abi.decodeLog(unindexedEventsStorageStatusRequest, data);
                            console.log('event:', event_2);
                            console.log('requester:', event_2.requester);
                            console.log('cid:', event_2.cid);
                            cid = event_2.cid;
                            requester = event_2.requester;
                            return [4 /*yield*/, storageAdapter.getStorageInfo(cid)];
                        case 2:
                            storageInfo = _a.sent();
                            console.log('storageInfo:', storageInfo); // need dealID and active status
                            try {
                                console.log('cold filecoin:', storageInfo.cidInfo.currentStorageInfo.cold.filecoin);
                                dealProposals = storageInfo.cidInfo.currentStorageInfo.cold.filecoin.proposalsList;
                                console.log('dealProposals:', dealProposals);
                                dealList = [];
                                for (i = 0; i < dealProposals.length; i++) {
                                    console.log('dealID:', dealProposals[i]["dealId"]);
                                    dealList.push(dealProposals[i]["dealId"]);
                                }
                                console.log('deal list:', dealList);
                                console.log('hot:', storageInfo.cidInfo.currentStorageInfo.hot);
                            }
                            catch ( // no on-chain deal
                            _b) { // no on-chain deal
                                console.log('hot:', storageInfo.cidInfo.currentStorageInfo.hot);
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            console.log('Event Storage Request', error);
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        });
    };
    return Vulcanize;
}());
exports["default"] = Vulcanize;
