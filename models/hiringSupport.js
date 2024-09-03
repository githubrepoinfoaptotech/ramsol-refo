const sequelize = require("../db/db");
const Sequelize = require("sequelize");

const hiringSupport = sequelize.define("hiringSupport", {
    id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    title:{
        type:Sequelize.STRING,
        allowNull:true
    },
    description:{
        type:Sequelize.STRING,
        allowNull:true
    }
});

// candidate.sync();
module.exports = hiringSupport;