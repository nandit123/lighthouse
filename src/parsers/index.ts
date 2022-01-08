import Infura from "./infura";
import Vulcanize from "./vulcanize";
import StorageAdapter from "../storage-adapter";
import { globSource } from 'ipfs-http-client'

const io = require("socket.io")(3002, { cors: {origins: ["*"] } });
const fs = require("fs");
const rimraf = require("rimraf");
const IPFS = require('ipfs-core')
const ipfsClient = require('ipfs-http-client');
const express = require('express');

var Files = {};

class Parser {
  config: any;
  infura: Infura;
  vulcanize: Vulcanize;
  storageAdapter: StorageAdapter;
  constructor(config: any, infuraURL: string, vulcanizeURL: string) {
    this.config = config;
    this.storageAdapter = new StorageAdapter(this.config);
    this.infura = new Infura(infuraURL, this.storageAdapter);
    this.vulcanize = new Vulcanize(vulcanizeURL, this.storageAdapter);
  }

  start() {
    // Use Infura as a fallback source
    // When the Lighthouse node starts, if we get a response from Vulcanize
    // before the set Timeout, then we woud use Vulcanize, otherwise, use Infura
    this.vulcanize.start();
    this.vulcanize.listenEventStorageRequest(this.storageAdapter);
    this.vulcanize.cronJob(this.storageAdapter);
    this.infura.start();
    this.httpServer(this.storageAdapter);
  }

  getStorageInfo(cid) {
    return this.storageAdapter.getStorageInfo(cid);
  }

  socket() {
    console.log('socket started')
    io.on("connection", socket => {
      // either with send()
      socket.send("Welcome to Lighthouse!");
  
      // handle the event sent with socket.emit()
      socket.on("cid", async (cid) => {
        console.log("cid recieved:", cid);

        let storageInfo;
        try {
          console.log('storageInfo is', JSON.stringify(await this.storageAdapter.getStorageInfo(cid)));
          storageInfo = JSON.stringify(await this.storageAdapter.getStorageInfo(cid));
        } catch(e) {
          console.log('entered catch');
          storageInfo = { storageInfo: 'No Storage Deal found for this CID' };
        }
        // or with emit() and custom event names
        socket.emit("storageInfo", storageInfo);
      });

      // publish the storage status of cid onto the smart contract
      socket.on("publishStatus", async (cid) => {
        console.log("cid recieved:", cid);

        let storageInfo;
        try {
          console.log('storageInfo is', JSON.stringify(await this.storageAdapter.getStorageInfo(cid)));
          storageInfo = JSON.stringify(await this.storageAdapter.getStorageInfo(cid));
        } catch(e) {
          console.log('entered catch');
          storageInfo = { storageInfo: 'No Storage Deal found for this CID' };
        }
        // or with emit() and custom event names
        socket.emit("storageInfo", storageInfo);
      });

      socket.on("Start", async (data) => {
        var Name = data['Name'];
        var Path = data['Path'];
        Files[Name] = { // create a new entry in Files variable
          FileSize: data['Size'],
          Data: "",
          Downloaded: 0
        }
        await fs.mkdir(Path, (err) => {
          if (err) {
              return console.error(err);
          }
          console.log('Directory created: ', Path);
        });
        var Place = 0;
        try {
          var Stat = fs.statSync(Path + '/' + Name);
          if (Stat.isFile()) {
            Files[Name]['Downloaded'] = Stat.size;
            Place = Stat.size / 54288;
          }
        } catch (error) {
          console.log('It is a new file');
        }
        fs.open(Path + "/" + Name, "a", '0755', function (err, fd) {
          if (err) {
            console.log('file open error', err);
          } else {
            Files[Name]['Handler'] = fd; // we store file handler so we can write to it later
            socket.emit('MoreData', { 'Place': Place, Percent: 0 });
          }
        })
      });

      socket.on('Upload', async (data) => {
        console.log('entered Upload');
        var Name = data['Name'];
        var Path = data['Path'];
        Files[Name]['Downloaded'] += data['Data'].length;
        Files[Name]['Data'] += data['Data'];
        if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
        {
          await fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', async (err, Writen) => {
            //Get Thumbnail Here
            console.log('File downloaded fully !!', Name);
            socket.emit('FileDownloaded', 'Yes');

            try {
                let path = Path + '/' + Name;
                // let cidObject: any = await this.storageAdapter.stageFile(path);
                // console.log('cid is:', cidObject);
                socket.emit('FileInfo', { name: Name, size: Files[Name]['FileSize']});
                // fs.unlink(path, (err) => {
                //     if (err) throw err;
                //     console.log(path + ' was deleted')
                // });
            } catch (e) {
                console.log('stageFile error:', e);
            }
          });
        }
        else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
            await fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                Files[Name]['Data'] = ""; //Reset The Buffer
                var Place = Files[Name]['Downloaded'] / 524288;
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
            });
        }
        else
        {
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        }
      });

      socket.on("GetCid", async (path) => {
        console.log('GetCid for folder:', path);
        let cid: any = await this.storageAdapter.stageFolder(path);
        console.log('cid is:', cid);
        const ipfs = await ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' })
        cid = await ipfs.add(globSource(path));
        console.log('local cid:', cid);
        rimraf(path, function () { console.log("deleted folder:", path); });
        socket.emit('FolderCid', {cid: cid});
      });

      socket.on("GetCidSize", async(cid) => {
        console.log("Size for cid:", cid);
        const ipfs = await ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' })
        try {
          let cidInfo = await ipfs.files.stat("/ipfs/" + cid);
          console.log('cidinfo:', cidInfo);
          socket.emit('CidSize', { size: cidInfo.cumulativeSize });
        } catch (e) {
          socket.emit('CidSize', { size: "Error" });
        }
      });

      socket.on("retrieveFile", async (cid) => {
        console.log("cid recieved:", cid);

        let file;
        try {
          console.log('entered retrieveFile');
          // console.log('storageInfo is', JSON.stringify(await this.storageAdapter.getStorageInfo(cid)));
          file = (await this.storageAdapter.retrieveFile(cid)).buffer;
        } catch(e) {
          console.log('entered catch');
          file = 'error';
        }
        // or with emit() and custom event names
        socket.emit("retrieveFile", file);
      });
    });
  }

  httpServer(storageAdapter: StorageAdapter) {
    let app = express();
    app.get('/storageDealRecords', async function (req, res) {
      let records = await storageAdapter.storageDealRecords();
      res.status(200).send(records);
    })

    app.listen(3000, console.log('http server listening at port 3000'));
  }
}

export default Parser;
