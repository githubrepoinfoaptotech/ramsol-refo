const Sequelize=require("sequelize");
const user=require("./user");
const supportTicket=require("./supportTicket");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");

const supportTicketConversations=sequelize.define("supportTicketConversations",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ["id"]
        }
    ]
  }
);

supportTicketConversations.belongsTo(user);
user.hasMany(supportTicketConversations);
supportTicketConversations.belongsTo(supportTicket);
supportTicket.hasMany(supportTicketConversations);
module.exports=supportTicketConversations;