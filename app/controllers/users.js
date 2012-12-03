var mongoose = require("mongoose")
,   User = mongoose.model("User")
var util = require("../../lib/util")

exports.authCallback = function(req,res,next){}

exports.login = function(req,res,next){
   if(util.isNullOrEmity(req.body.email) ||
       util.isNullOrEmity(req.body.password)){
           res.send({code:1,message:'密码，邮箱均为必填项'})
       }
    
    
    User.findOne({email:res.body.email,hashed_password:User.encryptPassword(req.body.password)}).exec(function(err,user){        
        if(user){
            req.logIn(user, function(err) {
              if (err) return next(err)
              res.send({code:0,message:'login ok'})
            })
           
        }else{
            res.send({code:1,message:'邮箱或者密码错误'})
        }
    })
}

exports.logout = function(req,res){
    req.logout();
    res.send({code:0,message:'logout ok'})
}

exports.register = function(req,res){
    
    if(util.isNullOrEmity(req.body.username) ||
       util.isNullOrEmity(req.body.password) || 
       util.isNullOrEmity(req.body.email)){
           res.send({code:1,message:'用户名，密码，邮箱均为必填项'})
       }
    
    if(!util.isEmail(req.body.email)){
        res.send({code:1,message:'邮箱格式不正确'})
    }
    
    User.findOne({email:res.body.email}).exec(function(err,user){        
        if(user)res.send({code:1,message:'邮箱已经被注册'})
    })
    
    User.findOne({username:this.body.username}).exec(function(err,user){
        if(user)res.send({code:1,message:'用户名已经被注册'})
    })
    
    var user = new User(req.body)
    user.provider = 'local'
    user.save(function(err){
        if (err)res.send({code:1,message:err.errors})
        else res.send({code:0,message:'create ok'})  
    })
    
}