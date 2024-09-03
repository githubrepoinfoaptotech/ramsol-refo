const sequelize = require("../db/db");
const Sequelize = require("sequelize");





const sendCvMailCandidate = sequelize.define("sendCvMailCandidate", {
    id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    mobile:{
        type:Sequelize.STRING,
        allowNull:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:true
    },
    requirementId:{
        type:Sequelize.UUID,
        allowNull:true
    },
    mainId:{
        type:Sequelize.UUID,
        allowNull:true
    }
}
);





// candidate.sync();
module.exports = sendCvMailCandidate;