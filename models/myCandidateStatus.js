const Sequelize = require("sequelize");
const sequelize = require("../db/db");
const chatUser = require("./chatUser");
const uniqueid=require("uniqid");
const chatMedia = require("./chatMedia");
const statusList=require("./statusList");
const candidate=require("./candidate");

const myCandidateStatus = sequelize.define("myCandidateStatus", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    candidateId:{
        type:Sequelize.UUID,
        allowNull:false, 
        references: { 
            model: candidate, 
            key: 'id',
         },
    },
    statusCode:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references: {
            model: statusList, 
            key: 'statusCode',
         },
    },
    createdBy:{
        type:Sequelize.UUID,
        allowNull:true
    },
    updatedBy:{
        type:Sequelize.UUID,
        allowNull:true
    },
    mainId:{
        type:Sequelize.UUID,
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
            fields: ["mainId","createdAt","statusCode"]
        },

    ]
  }
);

myCandidateStatus.belongsTo(candidate);
candidate.hasMany(myCandidateStatus); 



statusList.hasMany(myCandidateStatus, { foreignKey: 'statusCode' });
myCandidateStatus.belongsTo(statusList, { foreignKey: 'statusCode', targetKey:'statusCode' });



module.exports = myCandidateStatus;