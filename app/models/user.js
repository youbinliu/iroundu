// user schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')
  
var UserSchema = new Schema({
    email: String
  , username: String
  , provider: String
  , hashed_password: String
  , salt: String
  ,createdTime:{type: Date, default: Date.now}
})

// virtual attributes
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

// validations
var validatePresenceOf = function (value) {
  return value && value.length
}

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('email').validate(function (email) {
  return email.length && /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)
}, '邮箱格式不正确')

UserSchema.path('username').validate(function (username) { 
  return username.length
}, '用户名不能为空')


// pre save hooks
UserSchema.pre('save', function(next) {
  this.model('email').findOne({email:this.email},function(err,user){
      if(err)next(err)
      if(user)next({message:'邮箱已经被注册了'})
  })
  
  this.model('user').findOne({username:this.username},function(err,user){
      if(err)next(err)
      if(user)next({message:'用户名已经存在'})
  })
  next()
})

// methods
UserSchema.method('authenticate', function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password
})

UserSchema.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + ''
})

UserSchema.method('encryptPassword', function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
})

mongoose.model('User', UserSchema)
