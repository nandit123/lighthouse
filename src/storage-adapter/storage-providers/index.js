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
var powergate_1 = require("./powergate");
var io = require("socket.io")();
// Here you can implement/manage multiple storage providers at once.
// Storage adapter just has to know about the function signatures.
// Everything other than that must be handled here.
// The WebSocket server publishes storage status data to the respective
// rooms denoted by Ethereum addresses (contract or user)
// TODO: Add websocket authentication
// TODO: Need to maintain a database of the current states of the jobs
// In case of a crash/shutdown, we can start from the saved state.
var StorageProvider = /** @class */ (function () {
    function StorageProvider(config) {
        this.powergate = new powergate_1["default"](config);
        io.on("connection", function (client) { });
        io.listen(3001);
    }
    StorageProvider.prototype.store = function (address, cid, config) {
        return __awaiter(this, void 0, void 0, function () {
            var jobId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.powergate.store(cid, config)];
                    case 1:
                        jobId = _a.sent();
                        // @todo store eth address somewhere along with the cid
                        // start watching the jobId
                        this.watchJob(jobId);
                        // start watching the logs
                        this.watchLogs(cid);
                        return [2 /*return*/, jobId];
                }
            });
        });
    };
    StorageProvider.prototype.watchJob = function (jobId) {
        return this.powergate.watchJob(jobId, function () {
            // update the job status via websocket server (room: address_jobStatus)
            // (optional) update the job status on blockchain
        });
    };
    StorageProvider.prototype.watchLogs = function (cid) {
        return this.powergate.watchLogs(cid, function () {
            // publish the logs via websocket server (room: address_logs)
        });
    };
    StorageProvider.prototype.getStorageInfo = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('cid in storage-provider');
                return [2 /*return*/, this.powergate.getStorageInfo(cid)];
            });
        });
    };
    StorageProvider.prototype.stageFile = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('path in storage-provider');
                return [2 /*return*/, this.powergate.stageFile(path)];
            });
        });
    };
    StorageProvider.prototype.stageFolder = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('path in storage-provider');
                return [2 /*return*/, this.powergate.stageFolder(path)];
            });
        });
    };
    StorageProvider.prototype.retrieveFile = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('cid in storage-provider');
                return [2 /*return*/, this.powergate.retrieveFile(cid)];
            });
        });
    };
    return StorageProvider;
}());
exports["default"] = StorageProvider;
