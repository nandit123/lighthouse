const Web3 = require("web3");
import { abi, contractAddress } from "./contract";
import StorageAdapter from "../../storage-adapter";

class Infura {
  web3: Web3;
  contract: any;
  storageAdapter: StorageAdapter;

  constructor(url: string, storageAdapter: StorageAdapter) {
    this.storageAdapter = storageAdapter;

    this.web3 = new Web3(new Web3.providers.WebsocketProvider(url));
    this.contract = new this.web3.eth.Contract(
      abi,
      contractAddress,
      {
        from: "0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579",
        gasPrice: "20000000000",
      }
    );
  }

  start() {
    console.log('hello yo');
    this.contract.events.StorageRequest((error, event) => {
      if (error) {
        // TODO:  Log error
        throw Error(error);
      } else {
        console.log(event.returnValues);
      }
    });
  }
}

export default Infura;
