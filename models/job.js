const Sequelize=require("sequelize");
const sequelize=require("../db/db");
const statusCode=require("./statusCode");
const uniqueid=require("uniqid");

const jobs=sequelize.define("jobs",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    jobTitle:{
        type:Sequelize.STRING,
        allowNull:false
    },
    jobDescription:{
        type:Sequelize.STRING,
        allowNull:false
    },
    jobGist:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    jobDescriptionFile:{
        type:Sequelize.STRING,
        allowNull:true
    },
    statusCode:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references: {
            model: statusCode, 
            key: 'statusCode',
         },
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    }
});
statusCode.belongsTo(jobs,{forigenkey:"statusCode"});
jobs.hasOne(statusCode,{forigenkey:"statusCode"});
module.exports=jobs;