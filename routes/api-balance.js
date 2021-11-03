const express = require('express')
const { route } = require('.')
const router = express.Router()
const user = require('../models/cadastro')
const balance = require('../models/balance')

router.get('/',(req,res)=>{
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

module.exports = router