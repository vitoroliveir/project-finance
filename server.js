const express = require("express")
const app = express()
const port = 8080
const crypto = require('crypto');
const Sequelize = require('sequelize')
const bodyparser = require('body-parser')
const db = require('./models/db')
const user = require('./models/cadastro');
const session = require('express-session')


//Configurações
    //Public
        app.use(express.static('.'))

    //html view
        app.engine('html', require('ejs').renderFile);
        app.set('view engine','html')

    //body-parses
        app.use(bodyparser.json());
        app.use(bodyparser.urlencoded({ extended: true }));
    //session
        app.use(session({secret:'asa8dgs89gksf97gasdf496a4s'}));

//rotas
    
    app.get('/',(req,res)=>{
        //logando com a sessao
        if(req.session.login){
            res.render('../view/index.html')
        }else{
            res.render('../view/login.html')
        }
    })

    app.post('/',(req,res)=>{
        //login 
        (async ()=>{ 
            const email = req.body.emailLogin
            var password =  req.body.passwordLogin
            password = await crypto.createHash('md5').update(password).digest('hex')

            const emailExiste = await user.findOne({
                where:{
                 email : email,
                }
            })

            if(emailExiste == 0){
                console.log('email nao cadastrado')

            }else{
                const usuario = await user.findOne({
                    where:{
                        email: email
                    }
                })

                if(usuario.password === password){
                    //criando a sessao
                    req.session.login = email
                    res.render('../view/index.html')
                    
                }else{
                    console.log('senha incorreta')
                }
                
            }
        })()   
        
    })

    app.get('/signup',(req,res)=>{
        res.render('../view/cadastro.html')
    })
    
    app.post('/signup',(req,res)=>{
        //cadastro
            (async ()=>{
                const email = req.body.emailCadastro

                var password = req.body.passwordCadastro

                const passwordRepeat = req.body.password2Cadastro

                const emailExist = await user.findAll({
                    where:{
                    email : email 
                    }
                })

                if(password === passwordRepeat && emailExist == 0){

                    password = await crypto.createHash('md5').update(password).digest('hex')

                    await user.create({
                        name : req.body.name,
                        email : email,
                        password: password
            
                    }).then(()=>{
                        console.log('Cadastrado com sucesso')
                    }).catch((err)=>{
                        console.log(`erro: ${err}`)
                    })

                }else if(password != passwordRepeat){
                    console.log('As senha não são iguais.')

                }else if(emailExist != 0){
                    console.log('E-mail já cadastrado.')
                } 

            })()
    })
    


app.listen(port,()=>console.log('server ligado........'))