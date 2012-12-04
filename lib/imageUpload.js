var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var GridStore = require('mongodb').GridStore;

var host = "127.0.0.1"
var port = 27017
var db = "iroundu"

var ImageUpload = function () {
    this.db = new Db(this.db, new Server(this.host, this.port, {auto_reconnect:true}, {}));
};

ImageUpload.prototype.setup = function(host,port,db){
    this.host = host
    this.port = port
    this.db = db
}

ImageUpload.prototype.insert = function (data, callback) {
    //process.nextTick(function(){
        var gridStore = new GridStore(this.db, new ObjectID(), 'w', {"content_type":"image/png","chunk_size":data.length});
        gridStore.open(function (err, gridStore) {
            gridStore.write(data, function () {
                gridStore.close(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('insert ok.');
                        callback(result);
                    }
                });
            });
        });
    //});
};

ImageUpload.prototype.read = function (fileId, callback) {
    console.log('read ...'+fileId);
    var gridStore = new GridStore(this.db, new ObjectID(fileId));
    console.log('gridStore ...'+gridStore);
    gridStore.open(function (err, gridStore) {
        if(err){
            console.log(err);
        }else{
            console.log('open ...');
            gridStore.read(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('read ok');
                    callback(data);
                }
            });
        }
    });
};

exports.ImageUpload = ImageUpload;