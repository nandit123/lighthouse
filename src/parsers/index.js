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
var infura_1 = require("./infura");
var vulcanize_1 = require("./vulcanize");
var storage_adapter_1 = require("../storage-adapter");
var io = require("socket.io")(3002);
var fs = require("fs");
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
    Parser.prototype.getStorageInfo = function (cid) {
        return this.storageAdapter.getStorageInfo(cid);
    };
    Parser.prototype.socket = function () {
        var _this = this;
        console.log('socket started');
        io.on("connection", function (socket) {
            // either with send()
            socket.send("Welcome to Lighthouse!");
            // handle the event sent with socket.emit()
            socket.on("cid", function (cid) { return __awaiter(_this, void 0, void 0, function () {
                var storageInfo, _a, _b, _c, _d, _e, _f, _g, e_1;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            console.log("cid recieved:", cid);
                            _h.label = 1;
                        case 1:
                            _h.trys.push([1, 4, , 5]);
                            console.log('entered si');
                            _b = (_a = console).log;
                            _c = ['storageInfo is'];
                            _e = (_d = JSON).stringify;
                            return [4 /*yield*/, this.storageAdapter.getStorageInfo(cid)];
                        case 2:
                            _b.apply(_a, _c.concat([_e.apply(_d, [_h.sent()])]));
                            _g = (_f = JSON).stringify;
                            return [4 /*yield*/, this.storageAdapter.getStorageInfo(cid)];
                        case 3:
                            storageInfo = _g.apply(_f, [_h.sent()]);
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _h.sent();
                            console.log('entered catch');
                            storageInfo = { storageInfo: 'no-deal-found,' + e_1 };
                            return [3 /*break*/, 5];
                        case 5:
                            // or with emit() and custom event names
                            socket.emit("storageInfo", storageInfo);
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on("retrieveFile", function (cid) { return __awaiter(_this, void 0, void 0, function () {
                var file, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("cid recieved:", cid);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            console.log('entered retrieveFile');
                            return [4 /*yield*/, this.storageAdapter.retrieveFile(cid)];
                        case 2:
                            // console.log('storageInfo is', JSON.stringify(await this.storageAdapter.getStorageInfo(cid)));
                            file = (_a.sent()).buffer;
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            console.log('entered catch');
                            file = 'error';
                            return [3 /*break*/, 4];
                        case 4:
                            // or with emit() and custom event names
                            socket.emit("retrieveFile", file);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return Parser;
}());
exports["default"] = Parser;
