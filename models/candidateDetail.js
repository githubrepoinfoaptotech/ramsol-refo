const Sequelize=require("sequelize");
const role=require("./role");
const jobSeeker=require("./jobSeeker");
const sequelize=require("../db/db"); 
const statusList = require("./statusList");
const uniqueid=require("uniqid");
const chatUser=require("./chatUser");

const candidateDetail=sequelize.define("candidateDetail",{
    id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        unique:true,
        primaryKey:true,
    },
    firstName:{
        type:Sequelize.STRING,
        allowNull:true
    },
    lastName:{
        type:Sequelize.STRING,
        allowNull:true
    },
    mobile:{
        type:Sequelize.STRING,
        allowNull:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:true
    },
    skills:{
        type:Sequelize.STRING,
        allowNull:true
    },
    resume:{
        type:Sequelize.STRING,
        allowNull:true
    },
    document:{
        type:Sequelize.STRING,
        allowNull:true
    },
    photo:{
        type:Sequelize.STRING,
        allowNull:true
    },
    currentLocation:{
        type:Sequelize.STRING,
        allowNull:true
    },
    preferredLocation:{
        type:Sequelize.STRING,
        allowNull:true
    },
    nativeLocation:{
        type:Sequelize.STRING,
        allowNull:true
    },
    educationalQualification:{
        type:Sequelize.STRING,
        allowNull:true
    },
    gender:{
        type:Sequelize.STRING,
        allowNull:true
    },
    alternateMobile:{
        type:Sequelize.STRING,
        allowNull:true
    },
    differentlyAbled:{
        type:Sequelize.STRING,
        allowNull:true
    },
    currentCtc:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    expectedCtc:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    experience:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    relevantExperience:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    dob:{
        type:Sequelize.STRING,
        allowNull:true
    },
    mainId:{
        type:Sequelize.UUID, 
        allowNull:false
    },
    noticePeriod:{
        type:Sequelize.STRING,
        allowNull:true
    },
    reasonForJobChange:{
        type:Sequelize.STRING,
        allowNull:true
    },
    candidateProcessed:{
        type:Sequelize.STRING,
        allowNull:true
    },
    reason:{
        type:Sequelize.STRING,
        allowNull:true
    },
    isExternal:{
        type:Sequelize.STRING,
        allowNull:true,
        defaultValue:"NO"
    },
    createdBy:{
        type:Sequelize.STRING,
        allowNull:true
    },
    currentCompanyName:{
        type:Sequelize.STRING,
        allowNull:true
    },
    panNumber:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linkedInProfile:{
        type:Sequelize.STRING,
        allowNull:true
    },
    showAllDetails:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false
    },
    detailsHandler: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
            isMailSent: false,
            token: ""
        }
    },
    education_gap:{
        type:Sequelize.STRING,
        allowNull:true
    },
    reloaction_reason:{
        type:Sequelize.STRING,
        allowNull:true
    },
    offer_details:{
        type:Sequelize.STRING,
        allowNull:true
    },
    career_gap:{
        type:Sequelize.STRING,
        allowNull:true
    },
    document_check:{
        type:Sequelize.STRING,
        allowNull:true
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id','email']
        },
        {
            fields: ['mainId', "mobile", "firstName","lastName"]
        }
    ]
}
);
// candidateDetail.belongsTo(jobSeeker);
// jobSeeker.hasOne(candidateDetail);
// statusList.belongsTo(candidateDetail,{forigenkey:"statusCode"});
// candidateDetail.hasOne(statusList,{forigenkey:"statusCode"});



module.exports=candidateDetail;