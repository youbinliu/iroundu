// message schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var ReplyMsgSchema = new Schema({
    who:String
  , body:String
  , createdAt:{type:Date,default:Date.now}
})

var MessageSchema = new Schema({
    from:{type: Schema.Types.ObjectId, ref: 'User' }
  , to: {type: Schema.Types.ObjectId, ref: 'User' }
  , body:String
  , reply:[ReplyMsgSchema]
  , fromshow:{type:Number,default:1}
  , toshow:{type:Number,default:1}
  , createdAt:{type: Date, default: Date.now}
})


mongoose.model('Message', MessageSchema)

