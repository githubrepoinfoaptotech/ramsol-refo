const sequelize = require("../db/db");
const Sequelize = require("sequelize");

const companyRegister=require("./companyRegister");
const clientTestimonial = sequelize.define("clientTestimonial", {
    id: { 
        type: Sequelize.UUID, 
        unique: true,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,  
    },  
    description:{
        type:Sequelize.STRING,
        allowNull:true
    } 
}); 
clientTestimonial.belongsTo(companyRegister);
companyRegister.hasMany(clientTestimonial);
// candidate.sync();  
module.exports = clientTestimonial;              