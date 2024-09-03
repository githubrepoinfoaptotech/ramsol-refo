const sequelize = require("../db/db");
const Sequelize = require("sequelize");

 

const companyRegister = sequelize.define("companyRegister", {
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
    foundedIn:{
        type:Sequelize.STRING,
        allowNull:true
    },
    ownerName:{
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
    presentLocation:{
        type:Sequelize.STRING,
        allowNull:true
    },
    branches:{
        type:Sequelize.STRING,
        allowNull:true
    },
    recruiterStrength:{
        type:Sequelize.STRING,
        allowNull:true
    },
    hiring_SDE:{
        type:Sequelize.STRING,
        allowNull:true
    },
    // clientTestimonial:{
    //     type:Sequelize.STRING,
    //     allowNull:true
    // },
    recruiterCoreSkills:{
        type:Sequelize.STRING,
        allowNull:true
    },
    minimumCadidatePlacementFee:{
        type:Sequelize.STRING,
        allowNull:true
    },
    contractStaffing:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    minimumMarkup:{
        type:Sequelize.STRING,
        allowNull:true
    },
    // hiringSupport:{
    //     type:Sequelize.STRING,
    //     allowNull:true
    // },
    profileSource:{
        type:Sequelize.STRING,
        allowNull:true
    },
    using_ATS:{
        type:Sequelize.STRING,
        allowNull:true
    },
    isapproved:{
        type:Sequelize.BOOLEAN,
        allowNull:true 
    },
    gst:{
        type:Sequelize.STRING,
        allowNull:true
    },
    clientList:{
        type:Sequelize.STRING,
        allowNull:true
    },
    hiringSupport:{
        type:Sequelize.STRING,
        allowNull:true
    },
    countriesHiringSupport:{
        type:Sequelize.STRING,
        allowNull:true
    },
    role:{
        type:Sequelize.STRING,
        allowNull:true  
    }
});


// candidate.sync();
module.exports = companyRegister;