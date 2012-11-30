var express = require('express')
,   fs = require('fs')
,   passport = require('passport')

var env = process.env.NODE_ENV || 'development'
,   userConf = require('./config/userConfig')[env]

var mongoose = require('mongoose')
,   Schema = mongoose.Schema
mongoose.connect(userConf.db)

var modelsPath = __dirname + '/app/models'
,   modelFiles = fs.readdirSync(modelsPath)
modelFiles.forEach(function(modelName){
    require(modelsPath+'/'+modelName)
})

require("./lib/passport").setup(passport,userConf)

var app = express()

require('./config/sysConfig').setup(app,passport)
require("./config/routes").setup(app,passport)


app.get('/',function(req,res){
    res.send("hello world");
});

app.listen(userConf.port);
console.log('Listening on port '+userConf.port);
