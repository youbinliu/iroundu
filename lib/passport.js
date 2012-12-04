var mongoose = require("mongoose")
,   LocalStrategy = require("passport-local").Strategy
,   User = mongoose.model('User')

exports.setup = function(passport){
    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordFiled:'password'
    },function(email,password,done){
        User.findOne({email:email},function(err,user){
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null,false,{message:'用户名不存在'})
            }
            if (!user.authenticate(password)) {
                return done(null,false,{message:'密码错误'})
            }
            return done(null,user)
        })
        
    }))
    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findOne(id, function (err, user) {
        done(err, user);
      });
    });
    
}