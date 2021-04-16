import Infura from "./infura";
import Vulcanize from "./vulcanize";
import StorageAdapter from "../storage-adapter";
const io = require("socket.io")(3002);

class Parser {
  config: any;
  infura: Infura;
  vulcanize: Vulcanize;
  storageAdapter: StorageAdapter;
  constructor(config: any, infuraURL: string, vulcanizeURL: string) {
    this.config = config;
    this.storageAdapter = new StorageAdapter(this.config);
    this.infura = new Infura(infuraURL, this.storageAdapter);
    this.vulcanize = new Vulcanize(vulcanizeURL, this.storageAdapter);
  }

  start() {
    // Use Infura as a fallback source
    // When the Lighthouse node starts, if we get a response from Vulcanize
    // before the set Timeout, then we woud use Vulcanize, otherwise, use Infura
    this.vulcanize.start();
    this.infura.start();
  }

  getStorageInfo(cid) {
    return this.storageAdapter.getStorageInfo(cid);
  }

  socket() {
    console.log('socket started')
    io.on("connection", socket => {
      // either with send()
      socket.send("Welcome to Lighthouse!");
  
      // handle the event sent with socket.emit()
      socket.on("cid", async (cid) => {
        console.log("cid recieved:", cid);

        let storageInfo;
        try {
          console.log('entered si');
          console.log('storageInfo is', JSON.stringify(await this.storageAdapter.getStorageInfo(cid)));
          storageInfo = JSON.stringify(await this.storageAdapter.getStorageInfo(cid));
        } catch(e) {
          console.log('entered catch');
          storageInfo = { storageInfo: 'no-deal-found' }
        }
        // or with emit() and custom event names
        socket.emit("storageInfo", storageInfo);
      });
    });
  }
}

export default Parser;
