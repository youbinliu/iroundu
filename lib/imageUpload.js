var mongoose = require("mongoose")
,mongodb = mongoose.mongo
var Db = mongodb.Db
,   Connection = mongodb.Connection
,   Server = mongodb.Server
,   BSON = mongodb.BSON
,   ObjectID = mongodb.ObjectID
,   GridStore = mongodb.GridStore


var ImageUpload = function () {
    console.log(this.db)
    this.db = new Db('iroundu', new Server("localhost", 27017, {auto_reconnect:true}, {}));
};

ImageUpload.prototype.insert = function (data, callback) {
    //process.nextTick(function(){
        var gridStore = new GridStore(this.db, new ObjectID(), 'w', {"content_type":"image/jpg","chunk_size":data.length});
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