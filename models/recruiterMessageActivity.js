const sequelize = require("../db/db");
const Sequelize = require("sequelize");
const chatUserMessage = require("./chatUserMessage");

const MessageActivity = sequelize.define("recruiterMessageActivity", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  recruiterId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  mainId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  PHONE_NUMBER_ID: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,

  },
  from: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  to: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  replyScreeshot:{
    type: Sequelize.STRING,
    allowNull: true,
  }
},
  {
    indexes: [
      { 
        unique: true,
        fields: ['id']
      }, 
      {
        fields: ["mainId"]
      },
    ]
  }
)

MessageActivity.belongsTo(chatUserMessage);
chatUserMessage.hasMany(MessageActivity);


module.exports = MessageActivity