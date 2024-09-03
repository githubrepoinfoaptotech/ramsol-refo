const sequelize = require("../db/db");
const Sequelize = require("sequelize");

const candidate=require("../models/candidate");

const candidateCpv = sequelize.define("candidateCpv", {
    id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    companyName:{
        type:Sequelize.STRING,
        allowNull:true
    },
    webSiteUrl:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    jobDescription:{
        type:Sequelize.TEXT,
        allowNull:true 
    },
    jobTitle:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    jobResponsibilities:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    currentLocation:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    inProjectOrBench:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    jobLocation:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    currentCompanyName:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    shiftTimings:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    noticePeriod:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    payrollOrContract:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    currentCtcAndTakeHome:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    expectedCtcAndTakeHome:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    modeOfWork:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    existingOfferDetails:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    jobChangeReason:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    documentsAvailabilty:{
        type:Sequelize.STRING,
        allowNull:true 
    },
    isVerified:{
        type:Sequelize.BOOLEAN,
        allowNull:true 
    },
    
    candidateConformation:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
    }
});


module.exports = candidateCpv;