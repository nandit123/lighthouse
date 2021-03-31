import Infura from "./infura";
import Vulcanize from "./vulcanize";
import StorageAdapter from "../storage-adapter";

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
}

export default Parser;
