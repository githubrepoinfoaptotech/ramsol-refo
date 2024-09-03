const Sequelize=require("sequelize");
const user=require("../models/user");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");

const recruiter=sequelize.define("recruiter",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    userId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: user, 
            key: 'id',
         }
    },
    employeeId:{
        type:Sequelize.STRING,
        allowNull:true
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    firstName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    lastName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    mobile:{
        type:Sequelize.STRING,     //change to allowNull:false
        allowNull:true,
    },
    companyName:{
        type:Sequelize.STRING,
    },
    companyAddress:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    companyWebsite:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    headOfficeLocation:{
        type: Sequelize.STRING,
        allowNull: true,
      },
    branchOfficeLocation:{
        type: Sequelize.STRING,
        allowNull: true,
      },
    capabilities:{
        type: Sequelize.STRING,
        allowNull: true,
      },
    recruiterCapacity:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    firstLogin:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:true
    },
    recCreds:{
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:0
    },
    totalExp:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    currentLocation:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    willingToWork:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    hoursToWork:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    nda:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    minimumCommercialFee:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    contractStaffing:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    sourceProfileFrom:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    aboutATS:{
        type: Sequelize.TEXT,
        allowNull: true,
    },
    GSTNumber:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    minimumMarkup:{
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
            fields: ["mainId","mobile"]
        }
    ]
  }
);
recruiter.belongsTo(user);
user.hasOne(recruiter);
module.exports=recruiter;