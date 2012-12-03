var express = require('express')
  , mongoStore = require('connect-mongodb')
//
//exports.env = "development"
//
//exports.settings = {
//    development:{
//        db:'mongodb://localhost/iroundu',
//        port:80
//    },
//    test:{},
//    production:{}
//}



exports.appSet = function(app,passport){
    bootSysConfig(app,passport)
}

function bootSysConfig(app,passport){
    app.set('showStackError',true)    
    
    app.configure(function(){
        app.set('db', 'mongodb://localhost/iroundu');
        app.set('port',80)
    })
    // development only
    app.configure('development', function(){
        app.set('db', 'mongodb://localhost/iroundu');
        app.set('port',80)
    })
    app.configure('production', function(){
        app.set('db', 'mongodb://localhost/iroundu');
        app.set('port',80)
    })
    
    app.use(express.logger(':method :url :status'))

    app.use(express.bodyParser())

    app.use(express.methodOverride())

    app.use(express.session({
      secret: 'iroundu',
      store: new mongoStore({
        url: app.get('db'),
        collection : 'sessions'
      })
    }))
    
    app.use(passport.initialize())

    app.use(app.router)
    
    app.use(function(err,req,res,next){
        if(~err.message.indexOf('not found'))return next()
        console.error(err.stack)
        res.status(500).send('500');
    })

    app.use(function(req,res,next){
        res.status(404).send('404')
    })
    
    app.set('showStackError',false)


}
