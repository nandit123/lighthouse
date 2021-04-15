import { StorageConfig } from "@textile/grpc-powergate-client/dist/powergate/user/v1/user_pb";
import { Config } from "@textile/powergate-client/dist/index";

export interface PowergateConfig {
  host: Partial<Config>;
  config: StorageConfig.AsObject;
}

export type Data = string | Uint8Array;
