const Sequelize=require("sequelize");
const sequelize=require("../db/db"); 
const uniqueid=require("uniqid");
const candidateDetail=require("./candidateDetail");

const resumeInfo=sequelize.define("resumeInfo",{
    id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        unique:true,
        primaryKey:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:true
    },
    mail:{
        type:Sequelize.STRING,
        allowNull:true
    },
    mobile:{
        type:Sequelize.STRING,
        allowNull:true
    },
    date_of_birth:{
        type:Sequelize.STRING,
        allowNull:true
    },
    address:{
         type:Sequelize.TEXT,
       
        allowNull:true
    },
    current_location:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    linkedIn_profile_link:{
        type:Sequelize.STRING,
        allowNull:true
    },
    career_objective_profile_summary:{
       type:Sequelize.TEXT,
        allowNull:true
    },
     education_qualification: {
        type: Sequelize.ARRAY(Sequelize.JSON), // ARRAY of JSON objects
        allowNull: true,
    },
    work_experience: {
        type: Sequelize.ARRAY(Sequelize.JSON), // ARRAY of JSON objects
        allowNull: true,
    },
    projects: {
        type: Sequelize.ARRAY(Sequelize.JSON), // ARRAY of JSON objects
        allowNull: true,
    },
    skills:{
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull:true
    },
    achievements:{
       type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull:true
    },
    certifications:{
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull:true
    },
   languages_known: {
        type: Sequelize.ARRAY(Sequelize.TEXT), // Example: ARRAY of strings
        allowNull: true,
    },

    
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
resumeInfo.belongsTo(candidateDetail);
candidateDetail.hasOne(resumeInfo);




module.exports=resumeInfo;