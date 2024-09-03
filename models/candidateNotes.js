const Sequelize=require("sequelize");
const sequelize=require("../db/db");
const candidate=require("./candidate");
const recruiter=require("./recruiter");
const candidateNote=sequelize.define("candidateNote",{
    id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        unique:true,
        primaryKey:true,
    },
    mainId:{
        type:Sequelize.UUID, 
        allowNull:false
    },
    message:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    approve:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    approvedBy:{
        type:Sequelize.UUID, 
        allowNull:true,
        references: {
            model: recruiter, 
            key: 'id',
         }

    },
    status:{
        type:Sequelize.TEXT,
        allowNull:true,
        defaultValue:"DELIVERED" 
    }
    // statusCode:{
    //     type:Sequelize.INTEGER,
    //     allowNull:false,
    //     references: {
    //         model: statusList, 
    //         key: 'statusCode',
    //      }
    // }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ['mainId', "candidateId", "recruiterId","message"]
        }
    ]
}
);
// candidateDetail.belongsTo(jobSeeker);
// jobSeeker.hasOne(candidateDetail);
// statusList.belongsTo(candidateDetail,{forigenkey:"statusCode"});
// candidateDetail.hasOne(statusList,{forigenkey:"statusCode"});

candidateNote.belongsTo(recruiter);
recruiter.hasMany(candidateNote);

candidateNote.belongsTo(candidate);
candidate.hasMany(candidateNote);

candidateNote.belongsTo(recruiter, {as:"approver", foreignKey: 'approvedBy', targetKey: 'id' });
recruiter.hasMany(candidateNote, { as:"approver",foreignKey: 'approvedBy', sourceKey: 'id' });

module.exports=candidateNote;