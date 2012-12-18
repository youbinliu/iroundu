var mongoose = require("mongoose")
,   User = mongoose.model('User')
,   Message = mongoose.model('Message')
,   util = require("../../lib/util")


exports.add = function(req,res){
    var user = req.user;
    if(!user)return res.json({code:1,message:'未授权'});
    
    var msg = new Message(req.body);
    msg.from = user._id;
    msg.save(function(err,m){
        if(err)return res.json({code:1,message:'数据库操作错误'});
        else return res.json({code:0,message:m._id});
    });    
}

exports.delete = function(req,res){
    var user = req.user;
    if(!user)return res.json({code:1,message:'未授权'});
    
    var mid = req.params.mid;
    Message.findOne({_id:mid}).exec(function(err,msg){
        if(err || !msg)return res.json({code:1,message:'数据库错误'});
        
        if(String(msg.from) === String(user.id)){
            msg.fromshow = 0;
        }else if(String(msg.to) === String(user._id)){
            msg.toshow = 0;
        }else{
            return res.json({code:1,message:'权限错误'})
        }
        msg.save();
        return res.json({code:0,message:'删除成功'});
    })
}

exports.list = function(req,res){
    var user = req.user;
    if(!user)return res.json({code:1,message:'未授权'});
    
    
    var perPage = 2;
    var page = req.params.page;
    if(util.isNullOrEmity(page))page = 0;
    
    var q = Message.find();
    q.or([{ from: user._id,fromshow:1}, { to: user._id,toshow:1 }]);
    q.sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, msgs) {
        if (err) return res.json({code:1,message:'数据库查询错误'});
        else return res.json({code:0,message:msgs});
    });
}

exports.reply = function(req,res){
    var user = req.user;
    if(!user)return res.json({code:1,message:'未授权'});
    
    console.log("current user:"+user.username);
    
    var mid = req.params.mid;
    
    var replyMsg = {who:'',body:''};
    Message.findOne({_id:mid}).exec(function(err,msg){
        if(err || !msg)return res.json({code:1,message:'数据库错误'});
        if(String(msg.from) == String(user._id)){
            replyMsg.who = 'from';
        }else if(String(msg.to) == String(user._id)){
            replyMsg.who = 'to';
        }else{
            return res.json({code:1,message:'权限错误'})
        }
        replyMsg.body = req.body.body;
        msg.reply.push(replyMsg);
        msg.save(function(err,m){
            return res.json({code:0,message:'发送成功'});
        })
        
    })
}

