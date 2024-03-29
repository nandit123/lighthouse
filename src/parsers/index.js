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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var infura_1 = require("./infura");
var vulcanize_1 = require("./vulcanize");
var storage_adapter_1 = require("../storage-adapter");
var ipfs_http_client_1 = require("ipfs-http-client");
var io = require("socket.io")(3002, { cors: { origins: ["*"] } });
var fs = require("fs");
var rimraf = require("rimraf");
var IPFS = require('ipfs-core');
var ipfsClient = require('ipfs-http-client');
var express = require('express');
var Files = {};
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
        this.vulcanize.listenEventStorageRequest(this.storageAdapter);
        this.vulcanize.cronJob(this.storageAdapter);
        this.infura.start();
        this.httpServer(this.storageAdapter);
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
                            storageInfo = { storageInfo: 'No Storage Deal found for this CID' };
                            return [3 /*break*/, 5];
                        case 5:
                            // or with emit() and custom event names
                            socket.emit("storageInfo", storageInfo);
                            return [2 /*return*/];
                    }
                });
            }); });
            // publish the storage status of cid onto the smart contract
            socket.on("publishStatus", function (cid) { return __awaiter(_this, void 0, void 0, function () {
                var storageInfo, _a, _b, _c, _d, _e, _f, _g, e_2;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            console.log("cid recieved:", cid);
                            _h.label = 1;
                        case 1:
                            _h.trys.push([1, 4, , 5]);
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
                            e_2 = _h.sent();
                            console.log('entered catch');
                            storageInfo = { storageInfo: 'No Storage Deal found for this CID' };
                            return [3 /*break*/, 5];
                        case 5:
                            // or with emit() and custom event names
                            socket.emit("storageInfo", storageInfo);
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on("Start", function (data) { return __awaiter(_this, void 0, void 0, function () {
                var Name, Path, Place, Stat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Name = data['Name'];
                            Path = data['Path'];
                            Files[Name] = {
                                FileSize: data['Size'],
                                Data: "",
                                Downloaded: 0
                            };
                            return [4 /*yield*/, fs.mkdir(Path, function (err) {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    console.log('Directory created: ', Path);
                                })];
                        case 1:
                            _a.sent();
                            Place = 0;
                            try {
                                Stat = fs.statSync(Path + '/' + Name);
                                if (Stat.isFile()) {
                                    Files[Name]['Downloaded'] = Stat.size;
                                    Place = Stat.size / 54288;
                                }
                            }
                            catch (error) {
                                console.log('It is a new file');
                            }
                            fs.open(Path + "/" + Name, "a", '0755', function (err, fd) {
                                if (err) {
                                    console.log('file open error', err);
                                }
                                else {
                                    Files[Name]['Handler'] = fd; // we store file handler so we can write to it later
                                    socket.emit('MoreData', { 'Place': Place, Percent: 0 });
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('Upload', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var Name, Path, Place, Percent;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('entered Upload');
                            Name = data['Name'];
                            Path = data['Path'];
                            Files[Name]['Downloaded'] += data['Data'].length;
                            Files[Name]['Data'] += data['Data'];
                            if (!(Files[Name]['Downloaded'] == Files[Name]['FileSize'])) return [3 /*break*/, 2];
                            return [4 /*yield*/, fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) { return __awaiter(_this, void 0, void 0, function () {
                                    var path;
                                    return __generator(this, function (_a) {
                                        //Get Thumbnail Here
                                        console.log('File downloaded fully !!', Name);
                                        socket.emit('FileDownloaded', 'Yes');
                                        try {
                                            path = Path + '/' + Name;
                                            // let cidObject: any = await this.storageAdapter.stageFile(path);
                                            // console.log('cid is:', cidObject);
                                            socket.emit('FileInfo', { name: Name, size: Files[Name]['FileSize'] });
                                            // fs.unlink(path, (err) => {
                                            //     if (err) throw err;
                                            //     console.log(path + ' was deleted')
                                            // });
                                        }
                                        catch (e) {
                                            console.log('stageFile error:', e);
                                        }
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 2:
                            if (!(Files[Name]['Data'].length > 10485760)) return [3 /*break*/, 4];
                            return [4 /*yield*/, fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
                                    Files[Name]['Data'] = ""; //Reset The Buffer
                                    var Place = Files[Name]['Downloaded'] / 524288;
                                    var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                                    socket.emit('MoreData', { 'Place': Place, 'Percent': Percent });
                                })];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            Place = Files[Name]['Downloaded'] / 524288;
                            Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                            socket.emit('MoreData', { 'Place': Place, 'Percent': Percent });
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            socket.on("GetCid", function (path) { return __awaiter(_this, void 0, void 0, function () {
                var cid, ipfs, globSourceOptions, _a, _b, file, e_3_1;
                var e_3, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            console.log('GetCid for folder:', path);
                            return [4 /*yield*/, this.storageAdapter.stageFolder(path)];
                        case 1:
                            cid = _d.sent();
                            console.log('cid is:', cid);
                            return [4 /*yield*/, ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' })];
                        case 2:
                            ipfs = _d.sent();
                            console.log('ipfs instance created');
                            globSourceOptions = {
                                recursive: true
                            };
                            console.log('path:', path);
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 8, 9, 14]);
                            _a = __asyncValues(ipfs.addAll(ipfs_http_client_1.globSource('./' + path, globSourceOptions)));
                            _d.label = 4;
                        case 4: return [4 /*yield*/, _a.next()];
                        case 5:
                            if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 7];
                            file = _b.value;
                            console.log(file);
                            _d.label = 6;
                        case 6: return [3 /*break*/, 4];
                        case 7: return [3 /*break*/, 14];
                        case 8:
                            e_3_1 = _d.sent();
                            e_3 = { error: e_3_1 };
                            return [3 /*break*/, 14];
                        case 9:
                            _d.trys.push([9, , 12, 13]);
                            if (!(_b && !_b.done && (_c = _a["return"]))) return [3 /*break*/, 11];
                            return [4 /*yield*/, _c.call(_a)];
                        case 10:
                            _d.sent();
                            _d.label = 11;
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            if (e_3) throw e_3.error;
                            return [7 /*endfinally*/];
                        case 13: return [7 /*endfinally*/];
                        case 14:
                            rimraf(path, function () { console.log("deleted folder:", path); });
                            socket.emit('FolderCid', { cid: cid });
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on("GetCidSize", function (cid) { return __awaiter(_this, void 0, void 0, function () {
                var ipfs, cidInfo, e_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("Size for cid:", cid);
                            return [4 /*yield*/, ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' })];
                        case 1:
                            ipfs = _a.sent();
                            console.log('ipfsClient created');
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            console.log('inside try block');
                            return [4 /*yield*/, ipfs.files.stat("/ipfs/" + cid)];
                        case 3:
                            cidInfo = _a.sent();
                            console.log('cidinfo:', cidInfo);
                            socket.emit('CidSize', { size: cidInfo.cumulativeSize });
                            return [3 /*break*/, 5];
                        case 4:
                            e_4 = _a.sent();
                            console.log("getCIDSize error:", e_4);
                            socket.emit('CidSize', { size: "Error" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            socket.on("retrieveFile", function (cid) { return __awaiter(_this, void 0, void 0, function () {
                var file, e_5;
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
                            e_5 = _a.sent();
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
    Parser.prototype.httpServer = function (storageAdapter) {
        var app = express();
        app.get('/storageDealRecords', function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var records;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, storageAdapter.storageDealRecords()];
                        case 1:
                            records = _a.sent();
                            res.status(200).send(records);
                            return [2 /*return*/];
                    }
                });
            });
        });
        app.listen(3000, console.log('http server listening at port 3000'));
    };
    return Parser;
}());
exports["default"] = Parser;
