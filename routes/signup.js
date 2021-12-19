const express = require("express")
const router =  express.Router()
const crypto = require('crypto');
const bodyparser = require('body-parser')
const user = require('../models/cadastro');
const balance = require("../models/balance")

router.get('/',(req,res)=>{
    res.render('cadastro')
})

router.post('/',(req,res)=>{
    //cadastro
        (async ()=>{
            const email = req.body.emailCadastro
            var password = req.body.passwordCadastro
            const passwordRepeat = req.body.password_confirmation

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
                    //cadastrando tabela com as informacoes para o balanço
                    balance.create({
                        id_usuario: user.id,
                        incomes: 0,
                        expenses: 0,
                        total: 0
        
                    }).then(()=>{
                        console.log("Balanço criado com sucesso.")
                        
                    }).catch((err)=>{
                        console.log("Erro: " + err)
                    })
    
                    console.log('Usuario cadastrado com sucesso.')
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


module.exports =  router