const Sequelize=require("sequelize");
const sequelize=require("../db/db");
const client=require("./client");
const statusList=require("../models/statusList");
const user=require("./user");
const orgRecruiter = require("./orgRecruiter");
const uniqueid=require("uniqid");
const recruiter = require("./recruiter");
const levelOfHiring=require("../models/levelOfHiring");

const requirement=sequelize.define("requirement",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    clientId:{
        type:Sequelize.UUID,
        references: {
            model: client, 
            key: 'id',
         },
        allowNull:false
    },
    orgRecruiterId:{
        type:Sequelize.UUID,      
        allowNull:true,
        references:{
            model:orgRecruiter,
            key:'id'
        }
    },
    skills:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    requirementName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    uniqueId:{
        type:Sequelize.STRING,
        allowNull:false
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    statusCode:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references: {
            model: statusList, 
            key: 'statusCode',
         }
    },
    recruiterId:{
        type:Sequelize.UUID,
        allowNull:true,
        references: {
            model: recruiter, 
            key: 'id',
         }
    },
    requirementInt:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    requirementText:{
        type:Sequelize.STRING,
        allowNull:false
    },
    experience:{
        type:Sequelize.STRING,  
        allowNull:false
    },
    jdFile:{
        type:Sequelize.STRING,
        allowNull:true
    },
    jobLocation:{      //allowNull false
        type:Sequelize.STRING,
        allowNull:false
    },
    createdBy:{
        type: Sequelize.UUID,
    },
    updatedBy:{
        type: Sequelize.UUID,
    },
    gist:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    hideFromInternal:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    requirementJd:{
        type:Sequelize.STRING,
        allowNull:true
    },
    modeOfWork:{
        type:Sequelize.STRING,
        allowNull:true
    },
    specialHiring:{
        type:Sequelize.STRING,
        allowNull:true
    },
    levelOfHiringId:{
        type:Sequelize.UUID,
        allowNull:true,
        references: {
            model: levelOfHiring, 
            key: 'id',
         }
    },
    hideForFrontDisplay:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false
    },
    cvShareValue:{
        type:Sequelize.INTEGER,
        allowNull:true,
        defaultValue:0
    },
    cvInterviewDoneValue:{
        type:Sequelize.INTEGER,
        allowNull:true,
        defaultValue:0
    },
    cvJoinValue:{
        type:Sequelize.INTEGER,
        allowNull:true,
        defaultValue:0
    },
    isSendCpv:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:true
    },
    joinedSharePercentage:{
        type:Sequelize.INTEGER,
        allowNull:true,
        defaultValue:0
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ["mainId","uniqueId","levelOfHiringId"]
        }
    ]
  }
);
requirement.belongsTo(client);
client.hasMany(requirement);

requirement.belongsTo(levelOfHiring);
levelOfHiring.hasMany(requirement);

requirement.belongsTo(recruiter);
recruiter.hasMany(requirement);

requirement.belongsTo(orgRecruiter);
orgRecruiter.hasMany(requirement);


statusList.hasMany(requirement, { foreignKey: 'statusCode' });
requirement.belongsTo(statusList, { foreignKey: 'statusCode', targetKey:'statusCode' });


module.exports=requirement;