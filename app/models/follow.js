// follow schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var FollowSchema = new Schema({
    user: String
  , follow:String
  , createdTime:{type: Date, default: Date.now}
})

mongoose.model('Follow', FollowSchema)