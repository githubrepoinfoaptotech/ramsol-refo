const  Sequelize  = require("sequelize");
const sequelize = require("../db/db");
const uniqueid=require("uniqid");
// const chatUserMessage = require("./chatUserMessage");

const chatMedia=sequelize.define("chatMedia",{
    id: {
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        unique:true,
        primaryKey: true,
    },
    originalFileName:{
        type:Sequelize.STRING,
        allowNull:true
    },
    mediaId:{
        type:Sequelize.STRING(250),
        allowNull:true
    },
    path:{
        type:Sequelize.TEXT,
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
            fields: ['mediaId']
        }  
    ]
}
)


module.exports=chatMedia; 