import { StorageConfig } from "@textile/grpc-powergate-client/dist/ffs/rpc/rpc_pb";
import { Config } from "@textile/powergate-client/dist/index";

export interface PowergateConfig {
  host: Partial<Config>;
  config: StorageConfig.AsObject;
}

export type Data = string | Uint8Array;
