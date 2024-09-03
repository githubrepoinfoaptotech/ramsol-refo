const Sequelize = require("sequelize");
const sequelize = require("../db/db");
const uniqueid = require("uniqid");
const recruiter = require("./recruiter");

const redeemHistory = sequelize.define("redeemHistory", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    redeemValue:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    inrValue:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    recruiterId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: recruiter, 
            key: 'id',
         }
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    invoice:{
        type:Sequelize.STRING,
        allowNull:true
    },
    invoiId:{
        type:Sequelize.UUID,
        allowNull:true
    },
    InvTxt:{
        type:Sequelize.STRING,
        allowNull:true
    },
    uniqueId:{
        type:Sequelize.STRING,
        allowNull:true
    },
    rejectReason:{
        type:Sequelize.STRING,
        allowNull:true
    },
    transactionNumber:{
        type:Sequelize.STRING,
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
            fields: ["uniqueId","mainId","recruiterId"]
        },
  
    ]
  }
);
redeemHistory.belongsTo(recruiter);
recruiter.hasMany(redeemHistory);


module.exports=redeemHistory;