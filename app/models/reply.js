// voice schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var ReplySchema = new Schema({
    voice:String
  , user: String
  , reply:{type:String,default:''}
  , file:String
  , createdAt:{type: Date, default: Date.now}
})


mongoose.model('Reply', ReplySchema)
