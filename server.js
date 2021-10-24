const express = require("express")
const app = express()
const port = 8080
const crypto = require('crypto');
const Sequelize = require('sequelize')
const bodyparser = require('body-parser')
const db = require('./models/db')
const user = require('./models/cadastro');
const session = require('express-session')
var path =  require("path")
const transactions =  require("./models/transaction")
const balance = require("./models/balance")



//Configurações
    //Public
        app.use(express.static('.'))

    //html view
        app.engine('html', require('ejs').renderFile);
        app.set('view engine','html')
        app.set('views',path.join(__dirname, '/view'))

    //body-parses
        app.use(bodyparser.json());
        app.use(bodyparser.urlencoded({ extended: true }));
    //session
        app.use(session({secret:'asa8dgs89gksf97gasdf496a4s'}));

//rotas
    
    app.get('/',(req,res)=>{
        //logando com a sessao
        if(req.session.login){
            res.redirect('/index')
        }else{
            res.render('login')
        }
    })

    app.post('/',(req,res)=>{
        //login 
        (async ()=>{ 
            const email = req.body.emailLogin
            var password =  req.body.passwordLogin
            password = await crypto.createHash('md5').update(password).digest('hex')

            const usuario = await user.findOne({
                where:{
                    email: email
                }
            })

            if(usuario == 0){
                console.log('email nao cadastrado')

            }else{
                if(usuario.password === password){
                    //criando a sessao
                    req.session.login = email
                    res.redirect('/index')

                    const id_usuario =  usuario.id

                }else{
                    console.log('senha incorreta')
                }
                
            }
        })()  
        
        
    })

    app.get('/index',(req,res)=>{
        res.render('index')
    })

    app.post('/index',(req,res)=>{
        //transacoes
        (async ()=>{
            const description = req.body.description
            const amount = req.body.amount
            const date = req.body.date
            let incomes = 0
            let expenses = 0 
            let total = 0 

            const usuario = await user.findOne({
                where:{
                    email: req.session.login
                }
            })

            await transactions.create({
                id_usuario: usuario.id,
                description: description,
                amount: amount,
                date: date,


            }).then(()=>{
                console.log('Transacão inserida com sucesso.')
                res.redirect('/index')
            }).catch((err)=>{
                console.log(`Erro: ${err}`)
            })

            await transactions.findAll({
                where:{
                    id_usuario: usuario.id
                }
            }).then((dado)=>{
                dado.forEach((transaction )=> {

                    total += transaction.amount

                    if(transaction.amount > 0){
                        incomes += transaction.amount

                    }else if(transaction.amount < 0){
                        expenses += transaction.amount

                    }

                   return total, incomes, expenses
                })
            }).catch((err)=>{
                console.log("Erro: " + err)
            })

            await balance.update({
                incomes: incomes,
                expenses: expenses,
                total: total
                },
                {
                    where:{
                        id_usuario: usuario.id
                    }
                }
            ).then(()=>{
                console.log("balaço atualizado com sucesso")
            }).catch((err)=>{
                console.log("Erro: " + err)
            }) 
            

        })()
    })

    app.get('/api-transactions',(req,res)=>{
        (async ()=>{

            const usuario = await user.findOne({
                where:{
                    email: req.session.login
                }
            })

            await transactions.findAll({
                where:{
                    id_usuario: usuario.id
                }
            }).then((dados)=>{
                return res.json(dados) 
            }).catch((err)=>{
                console.log(`erro: ${err}`)
            })

            await balance.findAll({
                where:{
                    id_usuario: usuario.id
                }
            }).then((dados)=>{
                return res.json(dados)
            }).catch((err)=>{
                console.log(`erro: ${err}`)
            })

        })()
    })

    app.get('/api-balance',(req,res)=>{
        (async ()=>{

            const usuario = await user.findOne({
                where:{
                    email: req.session.login
                }
            })

            await balance.findAll({
                where:{
                    id_usuario: usuario.id
                }
            }).then((dados)=>{
                return res.json(dados)
            }).catch((err)=>{
                console.log(`erro: ${err}`)
            })

        })()
    })

    app.get('/signup',(req,res)=>{
        res.render('cadastro')
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
            
                    }).then((user)=>{
                        balance.create({
                            id_usuario: user.id,
                            incomes: 0,
                            expenses: 0,
                            total: 0
            
                        }).then(()=>{
                            console.log("balaço criado com sucesso")
                            
                        }).catch((err)=>{
                            console.log("Erro: " + err)
                        })
        
                        console.log('Cadastrado com sucesso')
                        res.redirect('/')
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