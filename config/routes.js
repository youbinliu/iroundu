
var mongoose = require('mongoose')
  , User = mongoose.model('User')

module.exports.setup = function (app, passport) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  //app.get('/signup', users.signup)
  //app.get('/logout', users.logout)
  app.post('/users', users.create) 
  //app.get('/users/:userId', users.show)
 
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

 
  // home route
  //app.get('/', articles.index)

}
