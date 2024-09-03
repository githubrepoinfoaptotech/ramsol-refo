const Sequelize = require("sequelize");
const sequelize = require("../db/db");
const uniqueid=require("uniqid");

const chatUser = sequelize.define("chatUser", {
  id: {
    allowNull: false,
    type: Sequelize.UUID,
    unique:true,
    primaryKey:true,
    defaultValue:Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,
    
  },
  profilePhoto: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  recruiterId: {
    type: Sequelize.UUID,
    allowNull: true,
  },
   lastUpdated:{
    type:Sequelize.DATE,
    defaultValue:Sequelize.NOW
  },
  mainId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  PHONE_NUMBER_ID: {
    type: Sequelize.STRING,
    allowNull: true,
  },
},
{
  indexes: [
      {
          unique: true,
          fields: ['id']
      },
      {
          fields: ['phoneNumber',"mainId"]
      }
  ]
}
);

module.exports = chatUser;
