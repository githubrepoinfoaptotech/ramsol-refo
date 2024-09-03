const Sequelize=require("sequelize");
const recruiter=require("../models/recruiter");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");
const requirement = require("./requirement");
const candidate = require("./candidate");

const recCredsRecord=sequelize.define("recCredsRecord",{

    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    vendorId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: recruiter, 
            key: 'id',
         }
        },
    requirementId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    candidateId:{
        type:Sequelize.UUID,
        allowNull:false
    }
}
,
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ["vendorId",'candidateId','requirementId']
        },
  
    ]
  });

recCredsRecord.belongsTo(recruiter, {as:"vendor",foreignKey: 'vendorId', targetKey: 'id' });
recruiter.hasMany(recCredsRecord, {as:"vendor", foreignKey: 'vendorId', sourceKey: 'id' });

recCredsRecord.belongsTo(requirement);
requirement.hasMany(recCredsRecord);

recCredsRecord.belongsTo(candidate);
candidate.hasMany(recCredsRecord);



module.exports=recCredsRecord;