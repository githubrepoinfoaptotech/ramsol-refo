const Sequelize=require("sequelize");
const role=require("../models/role");
const sequelize=require("../db/db");
// const uniqueid=require("uniqid");

const recruiterSettings=sequelize.define("recruiterSettings",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    fbBaseUrl:{
        type:Sequelize.STRING,
        allowNull:true
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:true
    },
    phoneNumberId:{
        type:Sequelize.STRING,
        allowNull:true
    },
    waToken:{
        type:Sequelize.STRING,
        allowNull:true
    },
    recruiterId:{
        type:Sequelize.UUID,
        allowNull:true
    },
    image:{
        type:Sequelize.STRING,
        allowNull:true
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:true
    },
    fromMonth:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    toMonth:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    isEnableFree:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    isEnablePaid:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    isEnableEmail:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    isCandidateResetEnable:{  
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    address:{
        type:Sequelize.STRING,
        allowNull:true
    },
    // taxPerc:{
    //     type:Sequelize.FLOAT,
    //     allowNull:true
    // },
    // hsn_sac:{
    //     type:Sequelize.FLOAT,
    //     allowNull:true
    // }

},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ["mainId","phoneNumberId","waToken","fbBaseUrl"]
        }
    ]
  }
);
// recruiterSettings.sync().then(()=>{
//     console.log("done");
// })
module.exports=recruiterSettings;