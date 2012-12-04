var mongoose = require("mongoose")
,mongodb = mongoose.mongo
var Db = mongodb.Db
,   Connection = mongodb.Connection
,   Server = mongodb.Server
,   BSON = mongodb.BSON
,   ObjectID = mongodb.ObjectID
,   GridStore = mongodb.GridStore


var ImageUpload = function () {
    this.db = new Db('iroundu', new Server("localhost", 27017, {auto_reconnect:true}, {}));
};

ImageUpload.prototype.insert = function (data, callback) {
    //process.nextTick(function(){
        var gridStore = new GridStore(this.db, new ObjectID(), 'w', {"content_type":data.type,"chunk_size":1024});
        gridStore.open(function (err, gridStore) {
            gridStore.write(data, function () {
                gridStore.close(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        callback(result);
                    }
                });
            });
        });
    //});
};

ImageUpload.prototype.read = function (fileId, callback) {
    var gridStore = new GridStore(this.db, new ObjectID(fileId),'r');
    gridStore.open(function (err, gridStore) {
        if(err){
            console.log(err);
        }else{
            gridStore.read(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    callback(data);
                }
            });
        }
    });
};

exports.ImageUpload = ImageUpload;