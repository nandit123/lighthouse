const io = require("socket.io-client");
// const socket = io("ws://localhost:3002"); //local
const socket = io("ws://13.126.82.18:3002"); // hosted

const fs = require("fs");

// handle the event sent with socket.send()
socket.on("message", data => {
  console.log(data);
});

socket.on("connect", () => {
  // or with emit() and custom event names
  socket.emit("cid", "QmTJYDuVWNnRn6g4AjRE5adZ9GwTm7Sgu2Zj75a3xibDRJ");
  // socket.emit("retrieveFile", "QmcpabSYeXqNQ3hPyr5vefGbxnqkDmCD5pWm4RRoQoMor4");
});

// handle the event sent with socket.emit()
socket.on("storageInfo", (storageInfo) => {
  console.log('storageInfo for cid:', storageInfo);
});

// handle the event sent with socket.emit()
socket.on("retrieveFile", (file) => {
  console.log('typeof', typeof file)
  // console.log('file:', file)
  // console.log('file Uint8Array:', file);
  fs.appendFile('retrievedFile', Buffer.from(new Uint8Array(file)), function(err) {
    if (err) {
      console.log('error creating file');
    } else {
      console.log('file created successfully');
    }
  })
});

