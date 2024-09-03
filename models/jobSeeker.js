const Sequelize=require("sequelize");
const user=require("../models/user");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");

const jobSeeker=sequelize.define("jobSeeker",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
    userId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: user, 
            key: 'id',
         }
    }
});
jobSeeker.belongsTo(user);
user.hasMany(jobSeeker);
module.exports=jobSeeker;