var mongoose = require("mongoose")
,   Voice = mongoose.model("Voice")
,   Reply = mongoose.model('Reply')
,   User = mongoose.model('User')
,   Like = mongoose.model('Like')
,   fs = require("fs")
,   util = require("../../lib/util")
,   FileUpload = require("../../lib/FileUpload").FileUpload
,   _ = require('underscore');


//message file or text
//messageType 
exports.add = function(req,res){
    
    var user = req.user;    
    if(!user)return res.json({code:1,message:'未授权'});
    
    //if(util.isNullOrEmity(req.body.longitude) ||
    //   util.isNullOrEmity(req.body.latitude) || 
    //   util.isNullOrEmity(req.files.message)){
    //       return res.json({code:1,message:'信息不完整'})
    //}
    
    var fileUpload = new FileUpload('voice');
    
    var data ;
    if(req.body.messageType === 'text'){
        data = new Buffer(req.body.message, "utf8");
        data.type = 'text/plain';
    }else{
        data = fs.readFileSync(req.files.voice.path);
        data.type = req.files.voice.type;
    }    
    
    fileUpload.insert(data,function(result){        
        var v = new Voice(req.body);
        v.user = user._id;
        v.file = result._id;
              
        v.save(function(err){
            if(err)return console.log(err);
        });
    });
    res.send('发布中.');   
     
};

exports.delete = function(req,res){
  var vid = req.params.vid;
  Voice.findOne({ _id : vid }).exec(function (err, voice) {
        if (err) return console.log(err);
        if (!voice) return res.json({code:1,message:'not find the voice'});
        //删除voice文件
        var file = voice.file;
        if(file){
            var fileUpload = new FileUpload('voice'); 
            fileUpload.delete(file);
        }
        //删除喜欢关系
        Like.remove({ voice: vid }, function (err) {
          if (err) return console.log(err);
        });
        //删除voice
        voice.remove();
        res.json({code:0,message:'删除成功'});
  });
  
};

exports.list = function(req,res){
    var perPage = 5;
    
    var page = req.body.page;
    if(util.isNullOrEmity(page))page = 0;
    
    Voice.find({user:req.params.uid})
    .sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, voices) {
        if (err) return res.json({code:1,message:'数据库查询错误'});
        else return res.json(voices);
    });
    
    
};
exports.doreply = function(req,res){
    var user = req.user;
    if(!user)return res.json({code:1,message:'未授权'});
        
    var vid = req.params.vid;
    var fileUpload = new FileUpload('voice');
    
    var data ;
    if(res.body.messageType === 'text'){
        data = new Buffer(res.body.message, "utf8");
        data.type = 'text/plain';
    }else{
        data = fs.readFileSync(req.files.voice.path);
        data.type = req.files.voice.type;
    }    
    
    fileUpload.insert(data,function(result){        
        var r = new Reply(req.body);
        r.user = user._id;
        r.file = result._id;
              
        r.save(function(err){
            if(err)return console.log(err);
        });
    });      
    res.send('发布中.');   
     
};

exports.reply = function(req,res){
    var perPage = 5;
    
    var page = req.params.page;
    if(util.isNullOrEmity(page))page = 0;
    
    Reply.find({voice:req.params.vid})
    .sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, replys) {
        if (err) {return res.json({code:1,message:'数据库查询错误'})}
        else {return res.json(replys)}
    });
    
};

exports.show = function(req,res){    
    var vid = req.params.vid;
    Voice.findOne({_id:vid}).exec(function(err, voice) {
        if(err)return res.json({code:1,message:'数据库查询失败'});
        if(!voice)return res.json({code:1,message:'not find voice'});
        else return res.json(voice);
    })
    
}

exports.of = function(req,res){    
    var fileUpload = new FileUpload('voice');
    
    fileUpload.read(req.params.vid, function (err,contentType,data) {
            if(err){
                res.send({code:1,message:"实体不存在"});
                return ;
            };
            res.contentType(contentType);
            res.send(data);
        }    
    ); 
}



