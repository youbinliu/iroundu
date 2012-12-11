var express = require('express')
,   fs = require('fs')

var passport = require('passport')

var app = express()

var config = require('./config/config')


var mongoose = require('mongoose')
mongoose.connect(config.settings[config.env].db)

var modelsPath = __dirname + '/app/models'
,   modelFiles = fs.readdirSync(modelsPath)
modelFiles.forEach(function(modelName){
    require(modelsPath+'/'+modelName)
})

require("./lib/passport").setup(passport)
config.appSet(app,passport)
require("./config/routes").setup(app,passport)

app.get('/', function(req, res){
    res.render('index');
});

app.listen(config.settings[config.env].port);
console.log('Listening on port '+config.settings[config.env].port);
