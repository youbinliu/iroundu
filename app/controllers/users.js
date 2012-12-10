var mongoose = require("mongoose")
,   User = mongoose.model("User")
,   fs = require("fs")
,   util = require("../../lib/util")
,   ImageUpload = require("../../lib/imageUpload").ImageUpload

exports.authCallback = function(req,res,next){}

exports.test = function(req,res){
    res.json("test")
}

exports.login = function(req,res){
        
    if(req.user)return res.json({code:0,message:'已经登录了'})
    
    if(util.isNullOrEmity(req.body.email) ||
       util.isNullOrEmity(req.body.password)){
           return res.json({code:1,message:'密码，邮箱均为必填项'})
       }
    
     User.findOne({email:req.body.email},function(err,user){           
            if (!user) {
                return res.json({code:1,message:'用户名不存在'})
            }
            if (!user.authenticate(req.body.password)) {
                return res.json({code:1,message:'密码错误'})
            }
            
            req.login(user, function(err) {
                if (err)return res.json({code:1,message:"登录错误"})
                res.json({code:0,message:'登录成功'})
            })
            
        })
    
}

exports.logout = function(req,res){
    req.logout();
    res.json({code:0,message:'退出成功'})
}

exports.register = function(req,res){
    
    if(util.isNullOrEmity(req.body.username) ||
       util.isNullOrEmity(req.body.password) || 
       util.isNullOrEmity(req.body.email)){
           return res.json({code:1,message:'用户名，密码，邮箱均为必填项'})
       }
    
    if(!util.isEmail(req.body.email)){
        return res.json({code:1,message:'邮箱格式不正确'})
    }
    
    User.findOne({'email':req.body.email}).exec(function(err,user){        
        if(user)res.json({code:1,message:'邮箱已经被注册'})
        else{
             User.findOne({'username':req.body.username}).exec(function(err,user){
                if(user)res.json({code:1,message:'用户名已经被注册'})
                else{
                    var u = new User(req.body)
                    u.provider = 'local'
                    u.save(function(err){
                        if (err)res.json({code:1,message:err.errors})
                        else {
                            req.login(u, function(err) {
                                if (err)return res.json({code:1,message:"error"})
                                res.json({code:0,message:'注册成功，并且已登录'})
                            })
                        }
                    })
                }
            })
        }
    })
}

exports.uploadAvatar = function(req,res){
    var user = req.user
    
    if(!user)return res.json({code:1,message:'未授权'})
    
    var imageUpload = new ImageUpload();
    console.log(req.files.avatar)
    
    var data = fs.readFileSync(req.files.avatar.path);
    data.type = req.files.avatar.type;
    
    imageUpload.insert(data,function(result){
        console.log(result);
        var oldAvatar = user.avatar;
        
        user.avatar = result._id;        
        user.save(function(err){
            if(err)return console.log(err);
            else{
                console.log(oldAvatar);
                //if(oldAvatar!=="")imageUpload.delete(oldAvatar);
                return;
            }
        })
    })      
    res.send('上传中.');   
}

exports.avatar = function(req,res){    
    var imageUpload = new ImageUpload();
    imageUpload.read(req.params.aid, function (data) {
        
        res.contentType('image/jpeg');
        res.send(data);
    }); 
}