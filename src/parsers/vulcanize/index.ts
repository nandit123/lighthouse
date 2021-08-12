import StorageAdapter from "../../storage-adapter";
var kik = require('kikstart-graphql-client');

const query = `
  subscription SubscriptionEvents {
    onEvent {
      block {
        hash
        number
      }
      tx {
        hash
        from
        to
      }
      event {
        __typename
        ... on StorageRequestEvent {
          uploader
          cid
          config
          fileCost
        }
      }
    }
  }
`
  
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
        console.log('cid:', res.data.onEvent.event.cid);
        console.log('config:', res.data.onEvent.event.config);
        console.log('address:', res.data.onEvent.event.uploader);
        console.log('fileCost:', res.data.onEvent.event.fileCost);
        const cid = res.data.onEvent.event.cid;
        const configString = res.data.onEvent.event.config;
        const address = res.data.onEvent.event.uploader;
        const fileCost = res.data.onEvent.event.fileCost;
        
        let config = JSON.parse(this.modifyConfig(configString));
        const jobId = this.storageAdapter.store(address, cid, config);
      },
      error: error => console.error(error),
      complete: () => console.log('done'),
    })
  }
}

export default Vulcanize;
