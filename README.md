# LightHouse Node ⛯
This project provides a way for Ethereum smart contracts to request Filecoin storage of CIDs in IPFS via Powergate. Hence, Ethereum developers can use this to request verifiable storage of data to Filecoin from Ethereum smart contracts
![alt text](https://github.com/nandit123/lighthouse/blob/master/res/lighthouse.png?raw=true)

The parser:

1. Takes data feed from external sources (Infura, VulcanizeDB).
2. Optionally stores the data feed (in case of Infura).
3. Parses the data feed into a set of parameters which can be passed to the storage-adapter.

The Storage adapter:

1. Accepts the arguments passed from the parser. (storage adapter is modular enough to be taken out of this repo and used as an dependency. It can be used by any other project.)
2. Uses the arguments passed to store the data (cid) according to the config.
3. Publishes storage status via websocket.

## How to run

1. Clone this repo
2. Open a terminal window and run `> npm install`
3. To start the lighthouse node run `> node src/index.js`

Now the lighthouse node is up and running, feel free to run it locally on your system or host on a server. 

This node also starts a socket.io server at port 3002 with which a socket.io client can interact to get the storage info of a file.

**Sample code for socket.io client -** 
```js
const io = require("socket.io-client");
const socket = io("ws://localhost:3002");

// handle the event sent with socket.send()
socket.on("message", data => {
  console.log(data);
});

socket.on("connect", () => {
  // or with emit() and custom event names
  socket.emit("cid", "QmbazJSQWTwmtAFqDgqxMG5JxGhg3kgYwdapaQDMM88HTP"); // put in your <cid> here for which storage-info is requested
});

// handle the event sent with socket.emit()
socket.on("storageInfo", (storageInfo) => {
  console.log('storageInfo for cid:', storageInfo);
});
```
