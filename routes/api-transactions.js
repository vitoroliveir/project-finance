const express = require("express")
const router =  express.Router()
const user = require('../models/cadastro')
const transactions =  require('../models/transaction')

router.get('/',(req,res)=>{
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

    })()
})

module.exports =  router