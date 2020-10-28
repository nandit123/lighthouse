# LightHouse Node ⛯

> insert cool logo 😎

The parser:

1. Takes data feed from external sources (Infura, VulcanizeDB).
2. Optionally stores the data feed (in case of Infura).
3. Parses the data feed into a set of parameters which can be passed to the storage-adapter.

The Storage adapter:

1. Accepts the arguments passed from the parser. (storage adapter is modular enough to be taken out of this repo and used as an dependency. It can be used by any other project.)
2. Uses the arguments passed to store the data (cid) according to the config.
3. Publishes storage status via websocket.
