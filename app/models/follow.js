// follow schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var FollowSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  , follow:{ type: Schema.Types.ObjectId, ref: 'User' }
  , createdTime:{type: Date, default: Date.now}
})

mongoose.model('Follow', FollowSchema)