const Sequelize = require("sequelize");
const sequelize = require("../db/db");
const clients = require("./client");
const user = require("./user");
const uniqueid=require("uniqid");


const levelOfHiring=sequelize.define("levelOfHiring",{
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
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:true
    },
    noOfHires:{
        type:Sequelize.STRING,
        defaultValue:true
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ["clientId","mainId"]
        }
    ]
  }
);

levelOfHiring.belongsTo(clients);
clients.hasMany(levelOfHiring);


module.exports=levelOfHiring;