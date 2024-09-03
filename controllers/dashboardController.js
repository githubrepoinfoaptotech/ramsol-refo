const user = require("../models/user");
const bcrypt = require("bcrypt");
const recruiter = require("../models/recruiter");
const orgRecruiter = require("../models/orgRecruiter");
const clients = require("../models/client");
const requirements = require("../models/requirement");
const candidate = require("../models/candidate");
const myCandidateStatus = require("../models/myCandidateStatus");
//
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const Sequelize = require("../db/db");
//
exports.superAdminDashboard = async (req, res) => {
    try {
        var dash_data = {};
        dash_data.admin_count = await user.count({ where: { roleName: "ADMIN" } });
        res.status(200).json({ status: true, data: dash_data });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ status: false, message: "Error" });
    }
}

exports.adminDashboard = async (req, res) => {
    try {
        var dash_data={}
        var dateObj = new Date();
        var myWhere = {
            mainId: req.mainId, createdAt: {
                [Op.and]: [
                    Sequelize.literal(`extract(month from "createdAt") = ${dateObj.getMonth() + 1}`),
                    Sequelize.literal(`extract(year from "createdAt") = ${dateObj.getFullYear()}`)
                ]
            },
        }
        const statusCodes = [301,303,3031,304, 3041, 305, 306, 307, 308,3081,309];
        
        const startDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        const endDate = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1);

        const countQuery = `SELECT "statusCode", COUNT(*) AS count FROM "candidates" WHERE "mainId" = :mainId  AND "statusCode" IN (:statusCodes) GROUP BY "statusCode"`;
        const counts = await Sequelize.query(countQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                mainId: req.mainId,
                statusCodes,
            },
        });
        dash_data.newcounts = counts.reduce((acc, { statusCode, count }) => {
            acc[`status${statusCode}_count`] = Number(count);
            return acc;
        }, {});
        // console.log(dash_data);
        // dash_data.client_count = await clients.count({ where: myWhere });
        // dash_data.requirement_count = await requirements.count({ where: myWhere });
        // dash_data.candidate_count = await candidate.count({ where: myWhere });
        res.status(200).json({ data: dash_data, status: true })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error", status: false });
    }
}


exports.ccDashboard = async (req, res) => {

    try {
        var dateObj = new Date();
        dateObj.setDate(dateObj.getDate());
        var dash_data = {};
        const startDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        const endDate = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1);
        const statusCodes = [301,303,3031,304, 3041, 305, 306, 307, 308,3081, 309];
        var include_data = [{ model: candidate, where: { recruiterId: req.recruiterId } }];
        const countQuery = `SELECT "statusCode", COUNT(*) AS count FROM "candidates" WHERE "mainId" = :mainId AND"recruiterId"=:recruiterId  AND "statusCode" IN (:statusCodes) GROUP BY "statusCode"`;
        const counts = await Sequelize.query(countQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                mainId: req.mainId,
                recruiterId:req.recruiterId,
                statusCodes,
            },
        });
        dash_data.newcounts = counts.reduce((acc, { statusCode, count }) => {
            acc[`status${statusCode}_count`] = count;
            return acc;
        }, {});
        // dash_data.ditched_count=await myCandidateStatus.count({where:{statusCode:311,mainId:req.mainId},include:include_data});
        // dash_data.invoiced_count=await myCandidateStatus.count({where:{statusCode:312,mainId:req.mainId},include:include_data});
        res.status(200).json({ status: true, data: dash_data });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ status: false, message: "Error" });
    };
};
exports.recuriterDashboard = async (req, res) => {
    try {
        var dateObj = new Date();
        dateObj.setDate(dateObj.getDate());
        const startDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        const endDate = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1);
        const statusCodes = [301,303,3031,304, 3041, 305, 306, 307, 308,3081, 309];
        var dash_data = {};
        var include_data = [{ model: candidate, where: { recruiterId: req.recruiterId } }];
        const countQuery = `SELECT "statusCode", COUNT(*) AS count FROM "candidates" WHERE "mainId" = :mainId AND "recruiterId"=:recruiterId  AND "statusCode" IN (:statusCodes) GROUP BY "statusCode"`;
        const counts = await Sequelize.query(countQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                mainId: req.mainId,
                recruiterId:req.recruiterId,
                statusCodes,
            },
        });
        dash_data.newcounts = counts.reduce((acc, { statusCode, count }) => {
            acc[`status${statusCode}_count`] = count;
            return acc;
        }, {});
        // dash_data.invoiced_count=await myCandidateStatus.count({where:{statusCode:312,mainId:req.mainId},include:include_data});
        res.status(200).json({ status: true, data: dash_data });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ status: false, message: "Error" });
    }
};   