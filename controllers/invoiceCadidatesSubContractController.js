const Sequelize = require("../db/db");
const user = require('../models/user');
const recruiter = require('../models/recruiter');
const  bankDetails= require('../models/bankDetails');
require("dotenv").config();
const mailFunction=require("../functions/sendReplyMail");