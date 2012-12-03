var express = require('express')
,   fs = require('fs')
,passport = require('passport')

config = require('./config/config')

var mongoose = require('mongoose')
,   Schema = mongoose.Schema
mongoose.connect(config.settings[config.env].db)

var modelsPath = __dirname + '/app/models'
,   modelFiles = fs.readdirSync(modelsPath)
modelFiles.forEach(function(modelName){
    require(modelsPath+'/'+modelName)
})

require("./lib/passport").setup(passport,config)

var app = express()

config.appSet(app,passport)
require("./config/routes").setup(app,passport)


app.get('/',function(req,res){
    res.send("hello world");
});

app.listen(config.settings[env].port);
console.log('Listening on port '+config.settings[env].port);
