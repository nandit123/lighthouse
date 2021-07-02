import Infura from "./infura";
import Vulcanize from "./vulcanize";
import StorageAdapter from "../storage-adapter";
import { TextDecoder } from "util";
const io = require("socket.io")(3002);
const fs = require("fs");
const rimraf = require("rimraf");

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
    this.infura.start();
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
          storageInfo = { storageInfo: 'no-deal-found,' + e };
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
                let cidObject: any = await this.storageAdapter.stageFile(path);
                console.log('cid is:', cidObject);
                socket.emit('FileCid', {cid: cidObject.cid, name: Name, size: Files[Name]['FileSize']});
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
        rimraf(path, function () { console.log("deleted folder:", path); });
        socket.emit('FolderCid', {cid: cid});
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
}

export default Parser;
