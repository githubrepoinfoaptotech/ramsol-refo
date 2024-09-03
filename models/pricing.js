const sequelize=require("../db/db");
const Sequelize=require("sequelize");


const Pricing=sequelize.define("pricing",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    title:{
        type:Sequelize.STRING,
        allowNull:true
    },
    numberOfMessages:{
        type:Sequelize.INTEGER,             //No. of candidates 
        allowNull:false
    },
    amount:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    pricingInt:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    pricingText:{
        type:Sequelize.STRING,
        allowNull:true
    },
    uniqueId:{
        type:Sequelize.STRING,
        allowNull:true
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
            fields: ["amount"]
        }
    ]
  }
)


module.exports=Pricing;