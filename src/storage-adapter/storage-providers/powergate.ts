import { createPow, powTypes } from "@textile/powergate-client";

import { Pow } from "@textile/powergate-client/dist/index"

import Provider from "./provider";
import { PowergateConfig, Data } from "../interfaces";

class Powergate implements Provider {
  pow: Pow;
  token: Promise<string>;

  constructor(config: PowergateConfig) {
    console.log('constructor host:', config.host);
    let host = config.host;
    this.pow = createPow({ host });
    this.setUserToken();
  }

  getUserToken(): Promise<string> {
    return new Promise(resolve => {
      async () => {
        // @todo logic here for relation between ethereum address and user id/token
        const { user } = await this.pow.admin.users.create() // save this token for later use!
        resolve(user.token);
      }
    });
  }

  async setUserToken() {
    console.log('setUserToken called:', process.env.POW_TOKEN);
    this.pow.setToken(process.env.POW_TOKEN);
    // this.pow.setToken(await this.token);
  }

  async store(cid: string, config?: any): Promise<string> {
    try {
      let storageInfo = await this.getStorageInfo(cid);
      console.log('already deal made with this cid');
      return 'already deal made with this cid';
    } catch (e) { // no storage info
      // store the data using the default storage configuration
      if(config['default'] !== 'yes') {
        // config exists
        console.log('config exists:', config);
        try {
          const { jobId } = await this.pow.storageConfig.apply(cid, { override: true, storageConfig: config });
          return jobId
        } catch (e) {
          console.log('error in making a deal request:', e);
        }
      } else {
        console.log('apply default config');
        // take default config
        const { jobId } = await this.pow.storageConfig.apply(cid, { override: true });
        return jobId;
      }
    }
  }

  watchJob(jobId: string, callback: Function): Function {
    return this.pow.storageJobs.watch((job) => {
      callback(job);
      if (job.status === powTypes.JobStatus.JOB_STATUS_CANCELED) {
        console.log("job canceled");
      } else if (job.status === powTypes.JobStatus.JOB_STATUS_FAILED) {
        console.log("job failed");
      } else if (job.status === powTypes.JobStatus.JOB_STATUS_SUCCESS) {
        console.log("job success!");
        console.log("The job is:", job);
      }  
    }, jobId);
  }

  watchLogs(cid: string, callback: Function): Function {
    // watch all FFS events for a cid
    return this.pow.data.watchLogs((logEvent) => {
      console.log(`received event for cid ${logEvent.cid}`)
      callback(logEvent);
    }, cid);
  }

  async getStorageInfo(cid: string): Promise<object> {
    console.log('cid in powergate');
    // store the data using the default storage configuration
    // const storageInfo = await this.pow.storageInfo.get(cid);
    // return storageInfo;
    return new Promise((resolve, reject) => {
      console.log('cid:', cid);
      resolve(this.pow.data.cidInfo(cid));
    })
  }

  async retrieveFile(cid: string): Promise<Uint8Array> {
    console.log('cid in powergate');
    // store the data using the default storage configuration
    // const storageInfo = await this.pow.storageInfo.get(cid);
    // return storageInfo;
    return new Promise((resolve, reject) => {
      console.log('cid in powergate-promise');
      resolve(this.pow.data.get(cid));
    })
  }
}

export default Powergate;
