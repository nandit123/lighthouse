import StorageAdapter from "../../storage-adapter";
var kik = require('kikstart-graphql-client');

const query = `subscription SubscriptionEvents {
    listen(topic: "events") {
      relatedNode {
        ... on ContractId1EventId1 {
          eventId
          mhKey
          dataUploader
          dataCid
          dataConfig
          id
          headerId
        }
      }
    }
  }`
  
const client = new kik.GraphQLClient({
  uri: 'https://lighthouse.vdb.to/graphql',
  wsUri: 'wss://lighthouse.vdb.to/graphql',
});

class Vulcanize {
  storageAdapter: StorageAdapter;

  constructor(url: string, storageAdapter: any) {
    this.storageAdapter = storageAdapter;
  }

  modifyConfig(config) {
    config = config.replace(/ /g,'');
    config = config.replace(/([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)/g, "\"$1\":\"$2\"");
    config = config.replace(/(\w+:)|(\w+ :)/g, function(matchedStr) {
      return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
    });
    return config;
  }
  // make call to vulcanize graphql here to get the event
  start() {
    console.log('entered vulcanize');
    client.runSubscription(query)
    .subscribe({
      next: res => {
        console.log(JSON.stringify(res.data));
        console.log('cid:', res.data.listen.relatedNode.dataCid);
        console.log('config:', res.data.listen.relatedNode.dataConfig);
        console.log('address:', res.data.listen.relatedNode.dataUploader);
        let cid = res.data.listen.relatedNode.dataCid;
        // let config = JSON.parse(res.data.listen.relatedNode.dataConfig); // parse the config stringified object
        let configString = res.data.listen.relatedNode.dataConfig;
        let config = JSON.parse(this.modifyConfig(configString));
        let address = '0x' + res.data.listen.relatedNode.dataUploader;
        const jobId = this.storageAdapter.store(address, cid, config);
        console.log('cid:', res.data.listen.relatedNode.dataCid); //, '& jobId:', jobId)
      },
      error: error => console.error(error),
      complete: () => console.log('done'),
    })
  }
}

export default Vulcanize;
