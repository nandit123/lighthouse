import Parser from "./parsers";
const io = require("socket.io")(3002);

// Get the variables from .env file
require("dotenv").config();

const infuraURL = process.env.INFURA_URL;
const vulcanizeURL = process.env.VULCANIZE_URL;
const powergateHost = process.env.POWERGATE_URL;
const config = {
  powergate: {
    host: powergateHost,
    config: {
      hot: {
        enabled: true,
        allowUnfreeze: false,
        ipfs: { addTimeout: 30 },
      },
      cold: {
        enabled: true,
        filecoin: {
          repFactor: 1,
          dealMinDuration: 1000,
          excludedMinersList: [],
          trustedMinersList: [],
          countryCodesList: [],
          renew: { enabled: false, threshold: 0 },
          addr:
            "t3uznjltjse5r7736d3ish3khoh5doriczc6uosp3q675mvzqchvw6ids3isqj45xbvhlpxhsv2ffwk2lkvfgq",
          maxPrice: 0,
        },
      },
      repairable: false,
    },
  },
};

// Start parsers

const parser = new Parser(config, infuraURL, vulcanizeURL);
parser.start();

io.on("connection", socket => {
  // either with send()
  socket.send("Welcome to Lighthouse!");

  // or with emit() and custom event names
  socket.emit("storageInfo", "this is some storage info");

  // handle the event sent with socket.emit()
  socket.on("cid", (cid) => {
    console.log("cid recieved:", cid);
    // do something with this cid
  });
});