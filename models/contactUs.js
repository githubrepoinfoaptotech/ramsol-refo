const sequelize = require("../db/db");
const Sequelize = require("sequelize");


const contactUs = sequelize.define("contactUs", {
    id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    mobile:{
        type:Sequelize.STRING,
        allowNull:true  
    },
    email:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    companyName:{
        type:Sequelize.STRING,
        allowNull:true  
    },
    message:{
        type:Sequelize.STRING,
        allowNull:true
    },
    context:{
        type:Sequelize.STRING,
        allowNull:true
    }
});


module.exports = contactUs;