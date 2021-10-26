const Sequelize = require("sequelize")
const db =  require("./db")


const Transactions = db.sequelize.define("transaction",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario:{
        type: Sequelize.INTEGER
    },
    description:{
        type: Sequelize.STRING
    },
    amount:{
        type: Sequelize.INTEGER
    },
    date:{
        type: Sequelize.DATE
    }

})

// Transactions.sync({ force: true })

module.exports = Transactions