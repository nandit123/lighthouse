# LightHouse Node ⛯
This project provides a way for Ethereum smart contracts to request Filecoin storage of CIDs in IPFS via Powergate. Hence, Ethereum developers can use this to request verifiable storage of data to Filecoin from Ethereum smart contracts. 

### Website
http://ec2-13-126-82-18.ap-south-1.compute.amazonaws.com/
### Blog Post
Read more about it on the blog here - https://nanditmehra123.medium.com/lighthouse-filecoin-ethereum-cross-chain-infra-project-66c041a1a1db
### Demo Video 
https://vimeo.com/552468707 <br>
https://www.youtube.com/watch?v=E2-cfbdSXtM

![alt text](https://github.com/nandit123/lighthouse/blob/master/res/lighthouse.png?raw=true)

<b>The parser</b> at src/parser:

1. Takes data feed from external sources VulcanizeDB.
2. Parses the data feed into a set of parameters which can be passed to the storage-adapter.

<b>The Storage adapter</b> at src/storage-adapter:

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

## Use Truffle box to Interact with Lighthouse
Demo Video - https://vimeo.com/552468707
- make a new directory - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>mkdir lighthouse</code><br>
- cd into that - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>cd lighthouse</code><br>
- run the following command - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>truffle unbox nandit123/lighthouse</code><br>
- Install the packages - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>npm i</code><br>
- Compile Smart Contracts - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>truffle compile</code><br>
- Migrate and Deploy - <br> 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>truffle migrate --network rinkeby</code><br>
- Now start truffle console using - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>truffle console</code><br>
- Run the following command to get the instance of the deployed smart contract - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>let specificInstance = await FPS.at("0xdFEa08D7c2B43498Bfe32778334c9279956057F0");</code><br>
- Now run this command to store data to filecoin - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>let result = specificInstance.store("sampleCid", "SampleConfig");</code><br>
- You can get the transaction hash of the previous call by typing in - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>result</code><br>

- To get the storageInfo replace your cid in the client.js file and run - <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>node client.js</code>
