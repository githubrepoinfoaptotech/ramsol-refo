const sequelize=require("../db/db");
const Sequelize=require("sequelize");



const Source=sequelize.define("source",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:false
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    uniqueId:{
        type:Sequelize.STRING,
        allowNull:true
    },
    sourceInt: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    sourceText: {
        type: Sequelize.STRING,
        allowNull: true
    },
},
{
indexes: [
    {
        unique: true,
        fields: ['id']
    },
    {
        fields: ["mainId","name"]
    }
]
}
)


module.exports=Source