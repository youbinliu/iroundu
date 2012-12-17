
var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Voice = mongoose.model('Voice')
var _v = 1

module.exports.setup = function (app, passport) {
  // user routes
  var users = require('../app/controllers/users')
  var users_pre = '/'+_v+'/users/'
  app.post(users_pre+'login', users.login)
  app.get(users_pre+'logout', users.logout)
  app.post(users_pre+'register', users.register) 
  app.get(users_pre+'test', users.test)
  app.post(users_pre+'avatar',users.uploadAvatar)
  app.get(users_pre+'avatar/:aid',users.avatar)
  app.post(users_pre+'modifypwd',users.modifyPwd)
  
  //关注关系
  app.get(users_pre+"follow/:uid",users.follow)
  app.get(users_pre+"disfollow/:uid",users.disfollow)
  app.get(users_pre+'followlist/:uid/:page',users.followlist)
  app.get(users_pre+'followedlist/:uid/:page',users.followedlist)
  app.get(users_pre+'followcount/:uid',users.followCount)
  app.get(users_pre+'followedcount/:uid',users.followedCount)
  app.get(users_pre+'isfollow/:uid',users.isfollow)
  
  app.param('uid', function (req, res, next, uid) {
    User
      .findOne({ _id : uid })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + uid))
        req.profile = user
        next()
      })
  })
 /* 
  app.param('vid', function (req, res, next, vid) {
    Voice
      .findOne({ _id : vid })
      .exec(function (err, voice) {
        if (err) return next(err)
        if (!voice) return next(new Error('Failed to load Voice ' + vid))
        req.voice = voice
        next()
      })
  })
  */
  var voice = require("../app/controllers/voices");
  var voice_pre = '/'+_v+'/voices/'
  //新建一条语言信息
  app.post(voice_pre+'new',voice.add)
  //删除一条语言信息
  app.get(voice_pre+'delete/:vid',voice.delete)
  //列出用户uid的第page页语音信息
  app.get(voice_pre+'list/:uid/:page',voice.list)
  app.get(voice_pre+'count/:uid',voice.voiceCount)
  //回复一条语言信息
  app.post(voice_pre+'doreply/:vid',voice.doreply)
  //列出语言vid的第page页的回复信息
  app.get(voice_pre+'reply/:vid/:page',voice.reply)
  app.get(voice_pre+'delreply/:rid',voice.delreply)
  //展示一条语言信息
  app.get(voice_pre+'show/:vid',voice.show)
  //获取语言信息实体
  app.get(voice_pre+'of/:vid',voice.of)
  //喜欢关系
  app.get(voice_pre+"like/:vid",voice.like)
  app.get(voice_pre+"dislike/:vid",voice.dislike)
  app.get(voice_pre+'likelist/:uid/:page',voice.likelist)
  app.get(voice_pre+'likeedlist/:vid/:page',voice.likeedlist)
  app.get(voice_pre+'likecount/:uid',voice.likeCount)
  app.get(voice_pre+'likeedcount/:vid',voice.likeedCount)
  app.get(voice_pre+'islike',voice.islike)
  
  
}
