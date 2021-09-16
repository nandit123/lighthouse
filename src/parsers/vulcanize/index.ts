import StorageAdapter from "../../storage-adapter";

var kik = require('kikstart-graphql-client');
var Web3 = require("web3") 

const abiEventStorageRequest = {
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "name": "uploader",
      "type": "address"
    },
    {
      "indexed": false,
      "name": "cid",
      "type": "string"
    },
    {
      "indexed": false,
      "name": "config",
      "type": "string"
    },
    {
      "indexed": false,
      "name": "fileCost",
      "type": "uint256"
    }
  ],
  "name": "StorageRequest",
  "type": "event"
};

const abiEventStorageStatusRequest = {
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "name": "requester",
      "type": "address"
    },
    {
      "indexed": false,
      "name": "cid",
      "type": "string"
    }
  ],
  "name": "StorageStatusRequest",
  "type": "event"
};

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

function modifyConfig(config) {
    config = config.replace(/ /g,'');
    config = config.replace(/([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)/g, "\"$1\":\"$2\"");
    config = config.replace(/(\w+:)|(\w+ :)/g, function(matchedStr) {
      return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
    });
    return config;
}

async function publishStorageStatus(web3, PUBLIC_KEY, PRIVATE_KEY, lighthouseContract, contractAddress, cid, dealIds, active) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get latest nonce

  let gasEstimate;
  try {
    gasEstimate = await lighthouseContract.methods.publishStorageStatus(cid, dealIds, active).estimateGas({from: PUBLIC_KEY}); // estimate gas
  } catch (e) {
    console.log('error:', e)
  }
  console.log('gasEstimate:', gasEstimate);
  // Create the transaction
  const tx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gas': gasEstimate, 
    'maxFeePerGas': 1000000108,
    'data': lighthouseContract.methods.publishStorageStatus(cid, dealIds, active).encodeABI()
  };

  // Sign the transaction
  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise.then((signedTx) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
      if (!err) {
        console.log("The hash of your transaction is: ", hash);
      } else {
        console.log("Something went wrong when submitting your transaction:", err)
      }
    });
  }).catch((err) => {
    console.log("Promise failed:", err);
  });
}

const client = new kik.GraphQLClient({
  uri: 'https://lighthouse.vdb.to/graphql',
  wsUri: 'wss://lighthouse.vdb.to/graphql',
});

class Vulcanize {
  storageAdapter: StorageAdapter;

  constructor(url: string, storageAdapter: any) {
    this.storageAdapter = storageAdapter;
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
        let configString = res.data.listen.relatedNode.dataConfig;
        let config = JSON.parse(modifyConfig(configString));
        let address = '0x' + res.data.listen.relatedNode.dataUploader;

        const jobId = this.storageAdapter.store(address, cid, config);
        console.log('cid:', cid); //, '& jobId:', jobId)
      },
      error: error => console.error(error),
      complete: () => console.log('done'),
    })
  }

  listenEventStorageRequest(storageAdapter: StorageAdapter) {
    console.log('Listening to Event Storage Request')
    const unindexedEventsStorageRequest = abiEventStorageRequest.inputs.filter(event => event.indexed === false);
    const unindexedEventsStorageStatusRequest = abiEventStorageStatusRequest.inputs.filter(event => event.indexed === false);
    
    const web3 = new Web3(process.env.ALCHEMY_WSS);
    const web3Http = new Web3(process.env.ALCHEMY_HTTPS);

    console.log('Alchemy_wss:', process.env.ALCHEMY_WSS);
    web3.eth.subscribe("logs", {"address": process.env.LIGHTHOUSE_SMART_CONTRACT}, async function(error, result){
      if (!error) {
        console.log('result:', result);
        let data = result.data;
        console.log('now going to decode the data:', result.data);
        
        try { // storage request event
          let event = web3Http.eth.abi.decodeLog(unindexedEventsStorageRequest, data);
          console.log('event:', event);
          console.log('address:', event.uploader);
          console.log('cid:', event.cid);
          console.log('config:', event.config);
          console.log('fileCost:', event.fileCost);

          let cid = event.cid;
          let configString = event.config;
          let config = JSON.parse(modifyConfig(configString));
          console.log('modifiedConfig:', config);
          let address = event.uploader;

          const jobId = storageAdapter.store(address, cid, config);
          console.log('cid:', cid); //, '& jobId:', jobId)
        } catch { // storage status request event
          const PUBLIC_KEY = process.env.PUBLIC_KEY;
          const PRIVATE_KEY = process.env.PRIVATE_KEY;

          let event = web3Http.eth.abi.decodeLog(unindexedEventsStorageStatusRequest, data);
          console.log('event:', event);
          console.log('requester:', event.requester);
          console.log('cid:', event.cid);

          let cid = event.cid;
          let requester = event.requester;
          
          let storageInfo: any = await storageAdapter.getStorageInfo(cid);
          console.log('storageInfo:', storageInfo); // need dealID and active status
          try {
            console.log('cold filecoin:', storageInfo.cidInfo.currentStorageInfo.cold.filecoin);
            let dealProposals = storageInfo.cidInfo.currentStorageInfo.cold.filecoin.proposalsList;
            console.log('dealProposals:', dealProposals);
            let dealList = [];
            let active;

            for (let i = 0; i < dealProposals.length; i++) {
              console.log('dealID:', dealProposals[i]["dealId"]);
              dealList.push(dealProposals[i]["dealId"]);
              active = true;
            }
            console.log('deal list:', dealList);
            // console.log('hot:', storageInfo.cidInfo.currentStorageInfo.hot);
            const contractAbi = require("./../../../contracts/abi/LighthouseV2.json"); // for Hardhat
            const contractAddress = process.env.LIGHTHOUSE_SMART_CONTRACT;
            const lighthouseContract = new web3.eth.Contract(contractAbi, contractAddress);

            await publishStorageStatus(web3Http, PUBLIC_KEY, PRIVATE_KEY, lighthouseContract, contractAddress, cid, dealList.toString(), active)
          } catch { // no on-chain deal
            console.log('hot:', storageInfo.cidInfo.currentStorageInfo.hot);
          }
        }
      } else {
        console.log('Event Storage Request', error);
      }
    });
  }
}

export default Vulcanize;
