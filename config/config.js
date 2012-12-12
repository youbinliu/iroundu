var express = require('express')
  , mongoStore = require('connect-mongodb')

exports.env ="development"

exports.settings = {
    development:{
        db:'mongodb://localhost/iroundu',
        port:80
    },
    test:{},
    production:{}
}



exports.appSet = function(app,passport){
    app.set('showStackError',true)   
    
    app.engine('.html', require('ejs').__express);
    app.set('views', __dirname + '../app/views');
    app.set('view engine', 'html');
    
    app.use(express.static(__dirname + '../public'));
    
    app.use(express.logger(':method :url :status'))
    
    app.use(express.cookieParser()); 
    
    app.use(express.bodyParser())

    app.use(express.methodOverride())

    app.use(express.session({
      secret: 'iroundu',
      store: new mongoStore({
        url: this.settings[this.env].db,
        collection : 'sessions',
        reapInterval: 60000*5
      }),
      cookie: {maxAge: 60000*60*24*7}
    }))
    
    app.use(passport.initialize())
    app.use(passport.session())
    
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

