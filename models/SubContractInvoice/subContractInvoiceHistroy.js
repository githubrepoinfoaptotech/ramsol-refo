const candidate = require("../candidate");
const sequelize = require("../../db/db");
const Sequelize = require("sequelize");
const recruiter = require("../recruiter");


const subcontractInvoiceHistory=sequelize.define("subcontractInvoiceHistory", {
    id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    invoice:{
        type:Sequelize.STRING
    },
    totalValue:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
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
});

subcontractInvoiceHistory.belongsTo(recruiter);
recruiter.hasMany(subcontractInvoiceHistory);
module.exports = subcontractInvoiceHistory;