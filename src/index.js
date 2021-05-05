"use strict";
exports.__esModule = true;
var parsers_1 = require("./parsers");
// const io = require("socket.io")(3002);
// import StorageAdapter from "./storage-adapter"
// Get the variables from .env file
require("dotenv").config();
var infuraURL = process.env.INFURA_URL;
var vulcanizeURL = process.env.VULCANIZE_URL;
var powergateHost = process.env.POWERGATE_URL;
var config = {
    powergate: {
        host: powergateHost,
        config: {
            hot: {
                enabled: false,
                allowUnfreeze: false,
                ipfs: { addTimeout: 900 },
                unfreezeMaxPrice: 0
            },
            cold: {
                enabled: true,
                filecoin: {
                    repFactor: 1,
                    dealMinDuration: 518400,
                    excludedMinersList: [],
                    trustedMinersList: [],
                    countryCodesList: [],
                    renew: { enabled: false, threshold: 0 },
                    addr: "f3rpbm3bt4muydk3iq5ainss6phht4bjbe5dq6egrx4rwzqjgwc5eruyloozvf6qjunubo467neaqsvbzyxnna",
                    maxPrice: 100000000000,
                    fastRetrieval: true,
                    dealStartOffset: 8640,
                    verifiedDeal: false
                }
            },
            repairable: false
        }
    }
};
// Start parsers
var parser = new parsers_1["default"](config, infuraURL, vulcanizeURL);
parser.start();
parser.socket();
// io.on("connection", socket => {
//   // either with send()
//   socket.send("Welcome to Lighthouse!");
//   var storageInfo;
//   // handle the event sent with socket.emit()
//   socket.on("cid", (cid) => {
//     console.log("cid recieved:", cid);
//     let storageAdapter = new StorageAdapter(config);
//     storageInfo = storageAdapter.getStorageInfo(cid);
//     console.log('storageInfo is', storageInfo);
//     // or with emit() and custom event names
//     socket.emit("storageInfo", "this is some storage info");
//   });
// });
