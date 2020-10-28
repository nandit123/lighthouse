import { createPow, ffsTypes } from "@textile/powergate-client";
import { Pow } from "@textile/powergate-client/dist/index";
import Provider from "./provider";
import { PowergateConfig, Data } from "../interfaces";

class Powergate implements Provider {
  pow: Pow;

  constructor(config: PowergateConfig) {
    this.pow = createPow(config.host);
  }

  async store(cid: string): Promise<string> {
    // store the data in FFS using the default storage configuration
    const { jobId } = await this.pow.ffs.pushStorageConfig(cid);
    return jobId;
  }

  watchJob(jobId: string, callback: Function): Function {
    return this.pow.ffs.watchJobs((job) => {
      callback(job);
      /* if (job.status === ffsTypes.JobStatus.JOB_STATUS_CANCELED) {
        console.log("job canceled");
      } else if (job.status === ffsTypes.JobStatus.JOB_STATUS_FAILED) {
        console.log("job failed");
      } else if (job.status === ffsTypes.JobStatus.JOB_STATUS_SUCCESS) {
        console.log("job success!");
      } */
    }, jobId);
  }

  watchLogs(cid: string, callback: Function): Function {
    // watch all FFS events for a cid
    return this.pow.ffs.watchLogs((logEvent) => {
      callback(logEvent);
      //console.log(`received event for cid ${logEvent.cid}`);
    }, cid);
  }
}

export default Powergate;
