var express = require('express')
,   fs = require('fs')
,   passport = require('passport')

var env = process.env.NODE_ENV || 'development'
,   userConf = require('./config/userConfig')[env]
,   sysConf = require('./config/sysConfig')

var mongoose = require('mongoose')
,   Schema = mongoose.Schema
mongoose.connect(userConf.db)

var modelsPath = __dirname + '/app/models'
,   modelFiles = fs.readdirSync(modelsPath)
modelFiles.forEach(function(modelName){
    require(modelsPath+'/'+modelName)
})



var app = express()

app.get('/',function(req,res){
    res.send("hello world");
});

app.listen(80);
console.log('Listening on port 80');
