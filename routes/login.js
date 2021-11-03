const express = require('express')
const router =  express.Router()
const crypto = require('crypto');
const bodyparser = require('body-parser')
const user = require('../models/cadastro');
const session = require('express-session')

router.get('/',(req,res)=>{
    //logando com a sessao
    if(req.session.login){
        res.redirect('/index')
    }else{
        res.render('login')
    }
})

router.post('/',(req,res)=>{
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
        
        if(usuario == null){
            console.log('E-mail nao cadastrado.')

        }else{
            if(usuario.password === password){
                //criando a sessao
                req.session.login = email
                res.redirect('/index')

            }else{
                console.log('Senha incorreta.')
            }
            
        }
    })()  
    
    
})

module.exports =  router