const Sequelize=require("sequelize");
const recruiter=require("../models/recruiter");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");
const requirement = require("./requirement");
const candidate = require("./candidate");
const recCredsRecord = require("./recCredsRecords");


const recordsValue=sequelize.define("recordsValue",{

    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    recCredsRecordId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: recCredsRecord, 
            key: 'id',
        }
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    reason:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    value:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
},
{indexes: [
    {
        unique: true,
        fields: ['id']
    },
    {
        fields: ["recCredsRecordId","status"]
    },

]}

);


recordsValue.belongsTo(recCredsRecord);
recCredsRecord.hasMany(recordsValue);


module.exports=recordsValue;