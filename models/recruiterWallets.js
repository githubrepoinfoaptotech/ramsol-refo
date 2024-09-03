const sequelize=require("../db/db");
const Sequelize=require("sequelize");


const wallet=sequelize.define("recruiterWallet",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      recruiterId:{
        type:Sequelize.UUID,
        allowNull:false,
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    totalMessages:{
        type:Sequelize.INTEGER,              //Total purchases
        allowNull:false,
    },
    remainingMessages:{
        type:Sequelize.INTEGER,             //Remaning candidates
        allowNull:false
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


module.exports=wallet;

