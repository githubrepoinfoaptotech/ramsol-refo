const Sequelize = require("sequelize");
const sequelize = require("../db/db");
const chatUser = require("./chatUser");
const uniqueid=require("uniqid");
const chatMedia = require("./chatMedia");
const candidate=require("./candidate");
const chatUserMessage = sequelize.define("chatUserMessage", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  messageId: {
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
  timeStamp: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  caption: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  template: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  vars: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  },
  mediaId: {
    type: Sequelize.STRING(250),
    allowNull: true
    
  },
  mediaCaption: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fileName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  size: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  uri: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  contactName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  contactNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  locationName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  locationAddress: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isRead: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  PHONE_NUMBER_ID: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  chatUserId: {
    type: Sequelize.UUID,
    allowNull: false,
    reference: {
      model: chatUser,
      key: "id",
    },
  },
  chatMediaId:{
    type:Sequelize.UUID,
    allowNull:true
  },
  candidateId:{
    type:Sequelize.UUID,
    allowNull:true
  }, 
  replyMessageId:{
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
          fields: ["mediaId"]
      }
  ]
}
);

chatUserMessage.belongsTo(chatUser);
chatUser.hasMany(chatUserMessage);

chatUserMessage.belongsTo(chatMedia, { foreignKey: 'chatMediaId' });
chatMedia.hasMany(chatUserMessage, { foreignKey: 'chatMediaId' }); 
//chatUserMessage.sync();
module.exports = chatUserMessage;