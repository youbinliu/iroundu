var mongoose = require("mongoose")
,mongodb = mongoose.mongo

var Db = mongodb.Db
,   Server = mongodb.Server
,   BSON = mongodb.BSON
,   Collection = mongodb.Collection
,   ObjectID = mongodb.ObjectID
,   GridStore = mongodb.GridStore


var FileUpload = function (root) {
    this.root = root
    this.db = new Db('iroundu', new Server("localhost", 27017, {auto_reconnect:true}, {}));
};

FileUpload.prototype.root = 'fs'

FileUpload.prototype.insert = function (data, callback) {
        var fileId = new ObjectID();
        var gridStore = new GridStore(this.db,fileId , 'w',{ root:this.root,"content_type":data.type,"chunk_size":data.length});
        gridStore.open(function (err, gridStore) {
            gridStore.write(data, function (err,gridStore) {
                gridStore.close(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {       
                        callback(result);
                    }
                });
            });
        });
};


FileUpload.prototype.read = function (fileId, callback) {
    var gridStore = new GridStore(this.db, new ObjectID(fileId),'r',{root:this.root});
    gridStore.open(function (err, gridStore) {
        if(err){
            //console.log(err);
            callback(err);
        }else{
            // Set the pointer of the read head to the start of the gridstored file
            gridStore.seek(0, function() {
                // Read the entire file
                gridStore.read(function(err,data) {
                    callback(null,gridStore.contentType,data)
                });
            })
        }
    });
};

FileUpload.prototype.delete = function(fileId){
    var gridStore = new GridStore(this.db, new ObjectID(fileId),'r',{root:this.root});
    gridStore.open(function (err, gridStore) {
        if(err){
            //console.log(err);
        }else{
            gridStore.unlink(function(err, result) {
                //callback(result)
            })
        }
    })
}

exports.FileUpload = FileUpload;