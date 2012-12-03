
var mongoose = require('mongoose')
  , User = mongoose.model('User')
var _v = 1

module.exports.setup = function (app, passport) {
  // user routes
  var users = require('../app/controllers/users')
  app.get('/'+_v+'/users/login', users.login)
  app.get('/'+_v+'/users/logout', users.logout)
  app.post('/'+_v+'/users/register', users.register) 
 
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

}
