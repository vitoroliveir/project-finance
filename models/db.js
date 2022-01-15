const Sequelize = require('sequelize')
require('dotenv/config')

//conectando ao banco 
const sequelize = new Sequelize(process.env.DB_NAME ,process.env.DB_USER ,process.env.DB_PASS,{
    host: process.env.DB_HOST,
    dialect: 'mysql'
})

sequelize
    .authenticate()
    .then(()=> console.log('conectado ao banco de dados'))
    .catch((err)=> console.log(`houve um erro ao conectar ao banco : ${err}`))


module.exports = {
    sequelize :sequelize,
    Sequelize:Sequelize
}