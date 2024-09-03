const Sequelize = require("sequelize");
const sequelize = require("../db/db");
const clients = require("./client");
const user = require("./user");
const recruiter=require("./recruiter");
const uniqueid=require("uniqid");


const orgRecruiter=sequelize.define("orgRecruiter",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    clientId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: clients, 
            key: 'id',
        },
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    mobile:{
        type:Sequelize.STRING,
        allowNull:false
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    },
    recruiterId:{
        type:Sequelize.UUID,
        allowNull:true,
        references: {
            model: recruiter, 
            key: 'id',
         }
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ["mainId","email"]
        }
    ]
  }
)

orgRecruiter.belongsTo(clients);
clients.hasMany(orgRecruiter);

recruiter.belongsTo(orgRecruiter);
orgRecruiter.hasMany(recruiter);

module.exports=orgRecruiter;