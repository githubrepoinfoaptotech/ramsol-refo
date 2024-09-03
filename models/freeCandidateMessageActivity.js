const sequelize = require("../db/db");
const Sequelize = require("sequelize");
const chatUserMessage = require("./chatUserMessage");
const requirement=require("./requirement");
const candidate=require("./candidate");
const recruiter=require("./recruiter");
const freeCandidateMessageActivity = sequelize.define("freeCandidateMessageActivity", {
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
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: true, 
  },
  message:{
    type:Sequelize.TEXT,
    allowNull:true
  },
  screenShot:{
    type:Sequelize.STRING,
    allowNull:true
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


freeCandidateMessageActivity.belongsTo(requirement);
requirement.hasMany(freeCandidateMessageActivity);

freeCandidateMessageActivity.belongsTo(candidate);
candidate.hasMany(freeCandidateMessageActivity);

freeCandidateMessageActivity.belongsTo(recruiter);
recruiter.hasMany(freeCandidateMessageActivity);

module.exports = freeCandidateMessageActivity