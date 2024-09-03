const sequelize = require("../db/db");
const Sequelize = require("sequelize");
const recruiter = require("./recruiter");
const requirement = require("./requirement");




const existingCandidates = sequelize.define("existingCandidates", {
    id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: true
    },
    email:{
        type: Sequelize.STRING,
        allowNull: true
    },
    mobile:{
        type: Sequelize.STRING,
        allowNull: true
    },
    mainId:{
        type: Sequelize.STRING,
        allowNull: true 
    },
    createdBy:{
        type: Sequelize.STRING,
        allowNull: true 
    }
},
    {
        indexes: [
            {
                unique: true,
                fields: ['id']
            },
            {
                fields: ['name','email','mobile']
            }
        ]
    } 
     
    
);


// candidate.sync();
module.exports = existingCandidates;