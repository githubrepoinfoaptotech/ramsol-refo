const sequelize = require("../db/db");
const Sequelize = require("sequelize");
const candidateDetails = require("./candidateDetail");
const recruiter = require("./recruiter");
const requirement = require("./requirement");
const statusList = require("./statusList");
const Source = require("./source");
const candidateCpv=require("../models/candidateCpv");

const candidate = sequelize.define("candidate", {
    id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    candidateDetailId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: candidateDetails,
            key: 'id',
        }
    },
    isAnswered: {
        type: Sequelize.STRING,
        allowNull: true
    },
    recruiterId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: recruiter,
            key: 'id',
        }
    },
    requirementId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: requirement,
            key: 'id',
        }
    },
    mainId: {
        type: Sequelize.UUID,
        allowNull: true
    },
    statusCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: statusList,
            key: 'statusCode',
        },
    },
    candidateInt: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    candidateText: {
        type: Sequelize.STRING,
        allowNull: true
    },
    uniqueId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    invoiceValue: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    joiningDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    invoicedDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    joinedDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    droppedReason:{
        type: Sequelize.STRING,
        allowNull: true
    },
    ditchReason:{
        type: Sequelize.STRING,
        allowNull: true
    },
    creditNoteReason:{
        type: Sequelize.STRING,
        allowNull: true
    },
    offerDeclinedReason:{
        type: Sequelize.STRING,
        allowNull: true
    },
    candidateRecruiterDiscussionRecording:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    candidateSkillExplanationRecording:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    candidateMindsetAssessmentLink:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    candidateAndTechPannelDiscussionRecording:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    isCandidateCpv:{
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    hideContactDetails:{
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    isShareCredsSent:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false
    },
    isInterviewDoneCredsSent:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false
    },
    isJoinedCredsSent:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false
    },
},
    {
        indexes: [
            {
                unique: true,
                fields: ['id']
            },
            {
                fields: ['mainId','createdAt','uniqueId','recruiterId']
            }
        ]
    }
    
    
    )

candidate.belongsTo(candidateDetails);
candidateDetails.hasOne(candidate);

candidate.belongsTo(recruiter);
recruiter.hasMany(candidate);

candidate.belongsTo(requirement);
requirement.hasMany(candidate);

candidate.belongsTo(Source);
Source.hasOne(candidate);

statusList.hasMany(candidate, { foreignKey: 'statusCode' });
candidate.belongsTo(statusList, { foreignKey: 'statusCode', targetKey: 'statusCode' });

candidate.belongsTo(candidateCpv);
candidateCpv.hasOne(candidate);

module.exports = candidate;