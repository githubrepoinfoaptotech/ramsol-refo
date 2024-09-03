const Sequelize=require("sequelize");
const user=require("../models/user");
const recruiter=require("../models/recruiter");
const sequelize=require("../db/db");
const uniqueid=require("uniqid");


const bankDetails=sequelize.define("bankDetails",{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      recruiterId:{
        type:Sequelize.UUID,
        allowNull:false,
        references: {
            model: recruiter, 
        key: 'id',
        }
      },
      bankName:{
        type:Sequelize.STRING,
        allowNull:false
      },
      accountNumber:{
        type:Sequelize.STRING,
        allowNull:false
      },
      ifscCode:{
        type:Sequelize.STRING,
        allowNull:true
      },
      micrCode:{
        type:Sequelize.STRING,
        allowNull:true
      },
      gstNumber:{
        type:Sequelize.STRING,
        allowNull:true
      },
      panNumber:{
        type:Sequelize.STRING,
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
          fields: ["createdAt","recruiterId"]
      },

  ]
});

bankDetails.belongsTo(recruiter);
recruiter.hasOne(bankDetails);


module.exports=bankDetails;