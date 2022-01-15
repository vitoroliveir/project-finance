const Sequelize =  require('sequelize')
const db = require('./db')

const Balance = db.sequelize.define('balance',{
    id_usuario:{
        type: Sequelize.INTEGER
    },
    incomes:{
        type: Sequelize.INTEGER
    },
    expenses:{
        type: Sequelize.INTEGER
    },
    total:{
        type: Sequelize.INTEGER
    }
})

/* Balance.sync({ force: true }) */

module.exports = Balance