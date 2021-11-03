const express = require("express")
const router =  express.Router()
const bodyparser = require('body-parser')
const user = require('../models/cadastro');
const transactions =  require("../models/transaction")
const balance = require("../models/balance")


router.get('/',(req,res)=>{
    if(req.session.login){
        res.render('index')
    }else{
        res.redirect('/')
    }
})

router.post('/',(req,res)=>{
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
        
        if(description.trim() === ""|| amount.trim() === "" || date.trim() == ""){
            console.log("Por favor, preencha todos os campos.")
            
        }else{
            //inserindo trançacoes
            await transactions.create({
                id_usuario: usuario.id,
                description: description,
                amount: amount,
                date: date,

            }).then(()=>{
                console.log('Transação inserida com sucesso.')
                res.redirect('/index')
            }).catch((err)=>{
                console.log(`Erro: ${err}`)
            })
        
            

            //calculo do balanço
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

            //atualizando balanço
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
                console.log("Balanço atualizado com sucesso.")
            }).catch((err)=>{
                console.log("Erro: " + err)
            }) 
        }

    })()
})

router.delete('/:id',(req,res)=>{
    (async ()=>{

        
        const usuario = await user.findOne({
            where:{
                email: req.session.login
            }
        })

        //calculo do balanço
        const updateBalance = () =>{
            let incomes = 0
            let expenses = 0 
            let total = 0 

            transactions.findAll({
                where:{
                    id_usuario: usuario.id
                }
            }).then((dado)=>{
                    dado.forEach((transaction )=> {

                        total += transaction.amount
    
                        if(transaction.amount > 0 ){
                            incomes += transaction.amount
    
                        }else if(transaction.amount < 0 ){
                            expenses += transaction.amount
    
                        }
    
                    return total, incomes, expenses
                    })
                
                
            }).then(()=>{
                balance.update({
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
                    console.log("Balanço atualizado com sucesso.")
                }).catch((err)=>{
                    console.log("Erro: " + err)
                }) 
            }).catch((err)=>{
                console.log("Erro: " + err)
            })
 
        }

        //deletar Transação
        await transactions.destroy({
            where:{
                id: req.params.id,
                id_usuario: usuario.id
            }
        }).then(()=>{
            console.log("Transação deletada com sucesso.")
            updateBalance()
            res.redirect("/index")
        }).catch((err)=>{
            console.log("erro: "+ err)

        })
    })()

})

module.exports =  router