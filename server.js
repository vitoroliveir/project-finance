const express = require("express")
const app = express()
const port = 8080
const bodyparser = require('body-parser')
const session = require('express-session')
var path =  require("path")
const login =  require('./routes/login')
const signup = require('./routes/signup')
const index =  require('./routes/index')
const apiTransaction =  require('./routes/api-transactions')
const apiBalance =  require('./routes/api-balance')


//Configurações
    //Public
        app.use(express.static('.'))

    //html view
        app.engine('html', require('ejs').renderFile);
        app.set('view engine','html')
        app.set('views', path.join(__dirname, '/view'))

    //body-parser
        app.use(bodyparser.json());
        app.use(bodyparser.urlencoded({ extended: true }));

    //session
        app.use(session({secret:'asa8dgs89gksf97gasdf496a4s'}));

//rotas
    app.use('/', login)
    app.use('/signup', signup)
    app.use('/index', index)
    app.use('/api-transactions', apiTransaction)
    app.use('/api-balance', apiBalance)
   


app.listen(port,()=>{
    console.log('Servidor ligado........')
})