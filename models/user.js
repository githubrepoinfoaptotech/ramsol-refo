const Sequelize = require("sequelize");
const role = require("../models/role");
const sequelize = require("../db/db");
const uniqueid = require("uniqid");

const user = sequelize.define("user", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  companyType:{
    type: Sequelize.STRING,
    allowNull: true,
  },
  roleName: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      model: role,
      key: 'roleName',
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  mainId: {
    type: Sequelize.UUID,
    allowNull: true,
  },
  isDelete: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isMsme:{
    type: Sequelize.BOOLEAN,
    allowNull: true,
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['id'],
    },
    {
      fields: ["email", "mainId"],
    },
  ],
});

user.belongsTo(role, { foreignKey: 'roleName', targetKey: 'roleName' });
role.hasMany(user, { foreignKey: 'roleName', sourceKey: 'roleName' });

module.exports = user;