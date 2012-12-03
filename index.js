var express = require('express')
,   fs = require('fs')

var passport = require('passport')
require("./lib/passport").setup(passport)

var app = express()

var config = require('./config/config')
config.appSet(app,passport)

var mongoose = require('mongoose')
mongoose.connect(app.get("db"))

var modelsPath = __dirname + '/app/models'
,   modelFiles = fs.readdirSync(modelsPath)
modelFiles.forEach(function(modelName){
    require(modelsPath+'/'+modelName)
})

require("./config/routes").setup(app,passport)

app.listen(app.get('port'));
console.log('Listening on port '+app.get('port'));
