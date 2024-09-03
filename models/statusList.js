const Sequelize=require("sequelize");
const user=require("./user");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");

const statusList=sequelize.define("statusList",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    statusCode:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true
    },
    statusName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    statusType:{
        type:Sequelize.STRING,
        allowNull:false
    },
    statusDescription:{
        type:Sequelize.STRING,
        allowNull:false
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id',"statusCode"]
        },
        {
            fields: ["statusName"]
        }
    ]
  }
);

module.exports=statusList;