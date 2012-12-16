// like schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var LikeSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User' }
  , voice:{ type: Schema.Types.ObjectId, ref: 'Voice' }
  , createdTime:{type: Date, default: Date.now}
})

mongoose.model('Like', LikeSchema)