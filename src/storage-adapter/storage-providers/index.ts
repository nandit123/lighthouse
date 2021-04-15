import Powergate from "./powergate";
const io = require("socket.io")();

// Here you can implement/manage multiple storage providers at once.
// Storage adapter just has to know about the function signatures.
// Everything other than that must be handled here.

// The WebSocket server publishes storage status data to the respective
// rooms denoted by Ethereum addresses (contract or user)

// TODO: Add websocket authentication

// TODO: Need to maintain a database of the current states of the jobs
// In case of a crash/shutdown, we can start from the saved state.

class StorageProvider {
  powergate: Powergate;
  ws: any;
  constructor(config: any) {
    this.powergate = new Powergate(config);
    io.on("connection", (client) => {});
    io.listen(3000);
  }

  async store(address: string, cid: string): Promise<string> {
    const jobId = await this.powergate.store(cid);

    // @todo store eth address somewhere along with the cid

    // start watching the jobId
    this.watchJob(jobId);

    // start watching the logs
    this.watchLogs(cid);

    return jobId;
  }

  watchJob(jobId: string): Function {
    return this.powergate.watchJob(jobId, () => {
      // update the job status via websocket server (room: address_jobStatus)
      // (optional) update the job status on blockchain
    });
  }

  watchLogs(cid: string): Function {
    return this.powergate.watchLogs(cid, () => {
      // publish the logs via websocket server (room: address_logs)
    });
  }

  async getStorageInfo(cid: string): Promise<object> {
    console.log('cid in storage-provider');
    return this.powergate.getStorageInfo(cid);
  }
}

export default StorageProvider;
