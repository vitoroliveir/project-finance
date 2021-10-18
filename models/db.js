const Sequelize = require('sequelize')

//conectando ao banco 
const sequelize = new Sequelize('cadastro','root','33713079',{
    host: 'localhost',
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