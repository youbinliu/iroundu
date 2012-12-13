// like schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var LikeSchema = new Schema({
    user: String
  , voice:String
  , createdTime:{type: Date, default: Date.now}
})

mongoose.model('Like', LikeSchema)