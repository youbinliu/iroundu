
var mongoose = require('mongoose')
  , User = mongoose.model('User')
var _v = 1

module.exports.setup = function (app, passport) {
  // user routes
  var users = require('../app/controllers/users')
  var users_pre = '/'+_v+'/users/'
  app.post(users_pre+'login', users.login)
  app.get(users_pre+'logout', users.logout)
  app.post(users_pre+'register', users.register) 
  app.get(users_pre+'test', users.test)
  app.post(users_pre+'avatar',users.uploadAvatar)
  app.get(users_pre+'avatar/:aid',users.avatar)
  app.post(users_pre+'modifypwd',users.modifyPwd)
  
  app.param('userId', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        next()
      })
  })
  
  var voice = require("../app/controllers/voices");
  var voice_pre = '/'+_v+'voices/'
  app.post(voice_pre+'new',voice.add)
  app.get(voice_pre+'delete/:vid',voice.delete)
  app.get(voice_pre+'list/:uid/:pid',voice.list)
  app.post(voice_pre+'doreply/:vid/'.voice.doreply)
  app.get(voice_pre+'reply/:vid/:pid',voice.reply)
  app.get(voice_pre+'show/:vid',voice.show)
  
  
}
