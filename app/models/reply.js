// voice schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var ReplySchema = new Schema({
    voice:String
  , user: String
  , reply:String
  , file:String
  , voiceLength:{type:Number,default:0}
  , createdAt:{type: Date, default: Date.now}
})


mongoose.model('Reply', ReplySchema)
