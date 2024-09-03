const sequelize = require("../db/db");
const Sequelize = require("sequelize");
const requirement=require("./requirement");
const candidate=require("./candidate");
const recruiterCandidateActivity = sequelize.define("recruiterCandidateActivity", {
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

recruiterCandidateActivity.belongsTo(requirement);
requirement.hasMany(recruiterCandidateActivity);

recruiterCandidateActivity.belongsTo(candidate);
candidate.hasMany(recruiterCandidateActivity);

module.exports = recruiterCandidateActivity;    