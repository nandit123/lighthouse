import StorageAdapter from "../../storage-adapter";

class Vulcanize {
  storageAdapter: StorageAdapter;

  constructor(url: string, storageAdapter: any) {
    this.storageAdapter = storageAdapter;
  }

  start() {}
}

export default Vulcanize;
