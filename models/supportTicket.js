const Sequelize=require("sequelize");
const recruiter=require("./recruiter");
const statusList=require("./statusList");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");

const supportTicket=sequelize.define("supportTicket",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    ticketNo:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    mainId:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    subject:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    ticketText:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    ticketInt:{
        type:Sequelize.INTEGER,
        allowNull:false,
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
            fields: ["id"]
        },
        {
            fields: ["recruiterId","mainId"]
        }
    ]
  }
);

supportTicket.belongsTo(recruiter);
recruiter.hasMany(supportTicket);
statusList.hasMany(supportTicket, { foreignKey: 'statusCode' });
supportTicket.belongsTo(statusList, { foreignKey: 'statusCode', targetKey:'statusCode' });

module.exports=supportTicket;