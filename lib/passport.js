var mongoose = require("mongoose")
,   LocalStrategy = require("passprot-local").Strategy
,   User = mongoose.model('User')

passprot.use(new LocalStrategy({
    usernameField:'email',
    passwordFiled:'password'
},function(email,password,done){
    User.findOne({email:email},function(err,user){
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null,false,{message:'Unknow User'})
        }
        if (!user.authenticate(password)) {
            return done(null,false,{message:'Invalid password'})
        }
        return done(null,user)
    })
    
}))