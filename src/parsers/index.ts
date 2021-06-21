import Infura from "./infura";
import Vulcanize from "./vulcanize";
import StorageAdapter from "../storage-adapter";
const io = require("socket.io")(3002);
const fs = require("fs");

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
  
      var storageInfo;
      // handle the event sent with socket.emit()
      socket.on("cid", async (cid) => {
        console.log("cid recieved:", cid);

        console.log('storageInfo is', JSON.stringify(await this.storageAdapter.getStorageInfo(cid)));
        let storageInfo = JSON.stringify(await this.storageAdapter.getStorageInfo(cid));
        // or with emit() and custom event names
        socket.emit("storageInfo", storageInfo);
      });

      socket.on("Start", function (data) {
        var Name = data['Name'];
        Files[Name] = { // create a new entry in Files variable
          FileSize: data['Size'],
          Data: "",
          Downloaded: 0
        }
        var Place = 0;
        try {
          var Stat = fs.statSync('Temp/' + Name);
          if (Stat.isFile()) {
            Files[Name]['Downloaded'] = Stat.size;
            Place = Stat.size / 54288;
          }
        } catch (error) {
          console.log('It is a new file');
        }
        fs.open("Temp/" + Name, "a", '0755', function (err, fd) {
          if (err) {
            console.log('file open error', err);
          } else {
            Files[Name]['Handler'] = fd; // we store file handler so we can write to it later
            socket.emit('MoreData', { 'Place': Place, Percent: 0 });
          }
        })
      });

      socket.on('Upload', function (data){
        console.log('entered Upload');
        var Name = data['Name'];
        Files[Name]['Downloaded'] += data['Data'].length;
        Files[Name]['Data'] += data['Data'];
        if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
        {
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                //Get Thumbnail Here
            });
        }
        else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
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
    });
  }
}

export default Parser;
