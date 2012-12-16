// voice schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var VoiceSchema = new Schema({
    user: String
  , reply:{type:String,default:''}
  , file:String
  , voiceLength:{type:Number,default:0}
  , likeAmount: {type:Number,default:0}
  , playAmount: {type:Number,default:0}
  , longitude: {type:Number,default:0}
  , latitude: {type:Number,default:0}
  , createdAt:{type: Date, default: Date.now}
})

// validations
var validatePresenceOf = function (value) {
  return value && value.length
}

// methods
VoiceSchema.method('', function() {
  
})


mongoose.model('Voice', VoiceSchema)
