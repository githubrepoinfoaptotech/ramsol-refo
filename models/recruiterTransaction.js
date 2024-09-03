const sequelize=require("../db/db");
const Sequelize=require("sequelize");
const Pricing = require("./pricing");
const recruiter=require("./recruiter");
const statusList=require("./statusList");
const Transaction=sequelize.define("recruiterTransaction",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    paymentTypes:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    referenceNo:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    refInt:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    refText:{
        type:Sequelize.STRING,
        allowNull:true
    },
    cgst:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    sgst:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    gst:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    totalTaxPerc:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    basicAmount:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    totalAmount:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    hsn_sac:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    companyName:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    companyAddress:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    statusCode:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references: {
            model: statusList, 
            key: 'statusCode',
         }
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ["mainId"]
        }
    ]
  }
)

Transaction.belongsTo(Pricing);
Pricing.hasMany(Transaction);

Transaction.belongsTo(recruiter);
recruiter.hasMany(Transaction);

statusList.hasMany(Transaction, { foreignKey: 'statusCode' });
Transaction.belongsTo(statusList, { foreignKey: 'statusCode', targetKey:'statusCode' });

module.exports=Transaction;



