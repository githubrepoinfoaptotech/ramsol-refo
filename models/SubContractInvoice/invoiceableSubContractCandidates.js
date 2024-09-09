const candidate = require("../candidate");
const sequelize = require("../../db/db");
const Sequelize = require("sequelize");
const recruiter = require("../recruiter");

const invoiceableSubContractCandidates=sequelize.define("invoiceableSubContractCandidates", {
    id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    candidateId:{
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: candidate,
            key: 'id',
        }
    },
    amount:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING,
        defaultValue:"TO-INVOICE"
    },
    mainId:{
        type: Sequelize.UUID,
        allowNull: false
    },
    invoiceId:{
        type: Sequelize.UUID,
        allowNull: true
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ['createdAt','candidateId']
        }
    ]
});


invoiceableSubContractCandidates.belongsTo(candidate);
candidate.hasOne(invoiceableSubContractCandidates);

invoiceableSubContractCandidates.belongsTo(recruiter);
recruiter.hasMany(invoiceableSubContractCandidates);

module.exports=invoiceableSubContractCandidates;
