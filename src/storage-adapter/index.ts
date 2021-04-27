import StorageProvider from "./storage-providers";

class StorageAdapter {
  config: any;
  storageProvider: StorageProvider;
  /**
   *
   * @param config
   * {
   *  "powergate": {config here}
   * }
   */

  constructor(config: object) {
    this.config = config;
    // initialize the storage provider
    this.storageProvider = new StorageProvider(this.config.powergate);
  }

  store(address: string, cid: string, config?: object): Promise<string> {
    if (!config) {
      config = this.config;
    }
    if (!address) {
      // TODO: Log error
      throw Error(
        "An Ethereum address should be passed as an argument in the store function"
      );
    }
    return this.storageProvider.store(address, cid, config);
  }

  getStorageInfo(cid: string): Promise<object> {
    console.log('cid in storage-adapter');
    return this.storageProvider.getStorageInfo(cid);
  }

  retrieveFile(cid: string): Promise<Uint8Array> {
    console.log('cid in storage-adapter');
    return this.storageProvider.retrieveFile(cid);
  }
}

export default StorageAdapter;
