const Sequelize=require("sequelize");
const uniqueid=require("uniqid");

const sequelize=require("../db/db");

const uniid=uniqueid();
const role=sequelize.define("role",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      roleName: {
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
      },
    title:{
        type:Sequelize.STRING,
        allowNull:true,
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ]
  }
);

module.exports=role;