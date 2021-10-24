const Sequelize = require('sequelize')
const db =  require('./db')

const User = db.sequelize.define("usuarios",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
})

// User.sync({ force: true })

module.exports = User