var mongoose = require("mongoose")
,   User = mongoose.model("User")
,   Follow = mongoose.model("Follow")
,   fs = require("fs")
,   util = require("../../lib/util")
,   FileUpload = require("../../lib/FileUpload").FileUpload;

exports.authCallback = function(req,res,next){};

exports.test = function(req,res){
    res.render('users/test');
};

exports.login = function(req,res){
        
    if(req.user)return res.json({code:0,message:'已经登录了'});
    
    if(util.isNullOrEmity(req.body.email) ||
       util.isNullOrEmity(req.body.password)){
           return res.json({code:1,message:'密码，邮箱均为必填项'});
       }
    
     User.findOne({email:req.body.email},function(err,user){           
            if (!user) {
                return res.json({code:1,message:'用户名不存在'});
            }
            if (!user.authenticate(req.body.password)) {
                return res.json({code:1,message:'密码错误'});
            }
            
            req.login(user, function(err) {
                if (err)return res.json({code:1,message:"登录错误"});
                res.json({code:0,message:'登录成功'});
            });
            
        });
    
};

exports.logout = function(req,res){
    req.logout();
    res.json({code:0,message:'退出成功'});
};

exports.register = function(req,res){
    
    if(util.isNullOrEmity(req.body.username) ||
       util.isNullOrEmity(req.body.password) || 
       util.isNullOrEmity(req.body.email)){
           return res.json({code:1,message:'用户名，密码，邮箱均为必填项'});
       }
    
    if(!util.isEmail(req.body.email)){
        return res.json({code:1,message:'邮箱格式不正确'});
    }
    
    User.findOne({'email':req.body.email}).exec(function(err,user){        
        if(user)res.json({code:1,message:'邮箱已经被注册'});
        else{
             User.findOne({'username':req.body.username}).exec(function(err,user){
                if(user)res.json({code:1,message:'用户名已经被注册'});
                else{
                    var u = new User(req.body);
                    u.provider = 'local';
                    u.save(function(err){
                        if (err)res.json({code:1,message:err.errors});
                        else {
                            req.login(u, function(err) {
                                if (err)return res.json({code:1,message:"error"});
                                res.json({code:0,message:'注册成功，并且已登录'});
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.modifyPwd = function(req,res){
    var user = req.user;
    
    if(!user)return res.json({code:1,message:'未授权'});
    
    if(util.isNullOrEmity(req.body.password) || util.isNullOrEmity(req.body.oldPwd))
    return res.json({code:1,message:'必要信息缺失'});
    
    if(!user.authenticate(req.body.oldPwd))return res.json({code:1,message:'原密码错误'});
    
    user.password = req.body.password;        
    user.save(function(err){
        if(err)return res.json({code:1,message:'修改错误'+err.errors});
        else return res.json({code:0,message:'修改成功'});
    });
};

exports.uploadAvatar = function(req,res){
    var user = req.user;
    
    if(!user)return res.json({code:1,message:'未授权'});
    
    var fileUpload = new FileUpload('image');
    
    var data = fs.readFileSync(req.files.avatar.path);
    data.type = req.files.avatar.type;
    
    fileUpload.insert(data,function(result){
        
        var oldAvatar = user.avatar;
        
        user.avatar = result._id;        
        user.save(function(err){
            if(err)return console.log(err);
            else{
                if(oldAvatar!=="")fileUpload.delete(oldAvatar);
                return;
            }
        });
    });
    res.send('上传中.');   
};

exports.avatar = function(req,res){    
    var fileUpload = new FileUpload('image');
    
    fileUpload.read(req.params.aid, function (err,contentType,data) {
            if(err){
                res.send({code:1,message:"图片不存在"});
                return ;
            };
            res.contentType(contentType);
            res.send(data);
        }    
    ); 
};


exports.follow = function(req,res){
    var user = req.user;    
    if(!user)return res.json({code:1,message:'未授权'});
    
    if(util.isNullOrEmity(req.params.uid))return res.json({code:1,message:'参数错误'});
    
    User.findOne({_id:req.params.uid}).exec(function(err,uo){
        if(!uo)return res.json({code:1,message:'找不到用户'});
        
        Follow.findOne({user:user._id,follow:uo._id}).exec(function(err, follow) {
            if(follow)return res.json({code:1,message:'已经关注'});
            
            var f = new Follow();
            f.user = user._id;
            f.follow = uo._id;
            f.save(function(err){
                return res.json({code:0,message:'生成关注关系'});
            });
        });        
    });    
};

exports.disfollow = function(req,res){
    var user = req.user;    
    if(!user)return res.json({code:1,message:'未授权'});
    
    if(util.isNullOrEmity(req.params.uid))return res.json({code:1,message:'参数错误'});
    
    User.findOne({_id:req.params.uid}).exec(function(err,uo){
        if(!uo)return res.json({code:1,message:'找不到用户'});
        
        Follow.findOneAndRemove({follow:uo._id},function(err){
            return res.json({code:0,message:'取消关注关系'});
        });
    });    
};

exports.followCount = function(req,res){
    
    if(util.isNullOrEmity(req.params.uid))return res.json({code:1,message:'参数缺损'});
    
    Follow.count({user:req.params.uid},function(err,count){
        if(err)return res.json({code:1,message:'数据库出错'});
        else return res.json({code:0,message:count});
    });
    
};

exports.followedCount = function(req,res){
    
    if(util.isNullOrEmity(req.params.uid))return res.json({code:1,message:'参数缺损'});
    
    Follow.count({follow:req.params.uid},function(err,count){
        if(err)return res.json({code:1,message:'数据库出错'});
        else return res.json({code:0,message:count});
    });
    
};

exports.followlist = function(req,res){
   
    var perPage = 2;
    
    var page = req.params.page;
    if(util.isNullOrEmity(page))page = 0;
    
    if(util.isNullOrEmity(req.params.uid))return res.json({code:1,message:'参数缺损'});
    
    Follow.find({user:req.params.uid})
    .populate('follow')
    .sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, follows) {
        if (err) {return res.json({code:1,message:'数据库查询错误'})}
        else {return res.json(follows)}
    });
};

exports.followedlist = function(req,res){
    
    var perPage = 2;
    
    var page = req.params.page;
    if(util.isNullOrEmity(page))page = 0;
    
    if(util.isNullOrEmity(req.params.uid))return res.json({code:1,message:'参数缺损'});
    
    Follow.find({follow:req.params.uid})
    .populate('user')
    .sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, follows) {
        if (err) {return res.json({code:1,message:'数据库查询错误'})}
        else {return res.json(follows)}
    });
};


exports.isfollow = function(req,res){
    var user = req.user;    
    if(!user)return res.json({code:1,message:'未授权'});
    
    if(util.isNullOrEmity(req.params.uid))return res.json({code:1,message:'参数错误'});
    
    Follow.findOne({user:user._id,follow:req.params.uid})
    .exec(function(err,follow){
        if(follow)return res.json({code:0,message:"存在关注"});
        else return res.json({code:1,message:"不存在关注"});
    });
};


