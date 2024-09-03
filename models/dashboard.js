const Sequelize = require("sequelize");
const sequelize = require("../db/db");
const chatUser = require("./chatUser");
const uniqueid=require("uniqid");
const chatMedia = require("./chatMedia");
const statusList=require("./statusList");
const candidate=require("./candidate")

const dashboard = sequelize.define("dashboard", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    statusCode:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references: {
            model: statusList, 
            key: 'statusCode',
         },
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:true
    }
}
);




statusList.hasOne(dashboard, { foreignKey: 'statusCode' });
dashboard.belongsTo(statusList, { foreignKey: 'statusCode', targetKey:'statusCode' });



module.exports = dashboard;