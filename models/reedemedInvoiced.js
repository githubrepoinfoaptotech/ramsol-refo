const Sequelize=require("sequelize");
const user=require("../models/user");
const redeemHistory=require("../models/redeemHistory");
const recCredsRecords=require("../models/recCredsRecords");
const recordsValue=require("../models/recordsVaule");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");


const reedemedInvoiced=sequelize.define("reedemedInvoiced",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    historyId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: redeemHistory, 
            key: 'id',
         }
    },
    recordValueId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: recordsValue, 
            key: 'id',
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
            fields: ["recordValueId","historyId"]
        },
  
    ]
  }
);

reedemedInvoiced.belongsTo(redeemHistory, {as:"history",foreignKey: 'historyId', targetKey: 'id' });
redeemHistory.hasMany(reedemedInvoiced, {as:"history", foreignKey: 'historyId', sourceKey: 'id' });


reedemedInvoiced.belongsTo(recordsValue, {as:"recordValue",foreignKey: 'recordValueId', targetKey: 'id' });
recordsValue.hasMany(reedemedInvoiced, {as:"recordValue", foreignKey: 'recordValueId', sourceKey: 'id' });


module.exports=reedemedInvoiced;