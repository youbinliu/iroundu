var mongoose = require("mongoose")
,   User = mongoose.model("User")

exports.signin = function(req,res){
    res.send("signin")
}

exports.authCallback = function(req,res,next){}

exports.login = function(req,res,next){
    res.send('login')
}

exports.create = function(req,res){
    var user = new User(req.body)
    user.provider = 'local'
    user.save(function(err){
        if (err)res.send({message:err.errors})
        else res.send({message:user.id})
    })
    
}