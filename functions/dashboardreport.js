const candidateDetails = require('../models/candidateDetail');
const candidate = require('../models/candidate');
const requirement = require('../models/requirement');
const statusCode = require('../models/statusList');
const recruiter = require('../models/recruiter');
const user = require('../models/user');
const client = require("../models/client");
const candidateStatus = require("../models/myCandidateStatus");
const moment = require('moment');
const Sequelize = require("../db/db");
const fn = Sequelize.fn;
const { Op,col } = require("sequelize");
const Source = require('../models/source');



exports.getData=async(req,code)=>{

        if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
        var limit = 10;
        var mywhere = { mainId: req.mainId, statusCode: code };
        
        if (req.body.fromDate && req.body.toDate) {
        
            const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
            const toDate = moment(req.body.toDate).endOf('day').toISOString();
            mywhere.createdAt = {
                [Op.between]: [fromDate, toDate]
            }
        }
        
        else if (req.body.year) {
            mywhere.createdAt = Sequelize.literal(`extract(year from "candidate"."createdAt") = ${req.body.year}`);
        }
        
        if(req.roleName=="RECRUITER"||req.roleName=="CLIENTCOORDINATOR"){
            mywhere.recruiterId = req.recruiterId
        }
        else if(req.roleName=="FREELANCER"||req.roleName=="SUBVENDOR"||req.roleName=="SUBCONTRACT"){
            mywhere.recruiterId = req.recruiterId
        }
        if (req.body.recruiterId) {
            mywhere.recruiterId = req.body.recruiterId
        }
        if (req.body.candidate) {
            mywhere.uniqueId = req.body.candidate
        }
        
        
        const can_data=await candidate.findAndCountAll({
            distinct: true,
            // attributes:[''],
            where: mywhere,
            include: [{
                model: candidateDetails,
                attributes: [
                    "firstName",
                    "lastName",
                    "email",
                    "mobile",
                    "skills",
                    "currentLocation",
                    "preferredLocation",
                    "nativeLocation",
                    "experience",
                    "relevantExperience",
                    "alternateMobile",
                    "gender",
                    "educationalQualification",
                    "differentlyAbled",
                    "currentCtc",
                    "expectedCtc",
                    "dob",
                    "noticePeriod",
                    "reasonForJobChange",
                    "candidateProcessed",
                    "reason",
                    "isExternal",
                    'currentCompanyName',
                    "currentCompanyName",
                    "linkedInProfile",
                    "panNumber",
                    "detailsHandler",
                    "showAllDetails",
                    "education_gap",
                    "reloaction_reason",
                    "offer_details",
                    "career_gap",
                    "document_check",
                            [
                              fn(
                                "concat",
                                process.env.liveUrl,
                                col("candidateDetail.resume")
                              ),
                              "resume",
                            ],
                            [
                              fn(
                                "concat",
                                process.env.liveUrl,
                                col("candidateDetail.document")
                              ),
                              "document",
                            ],
                            [
                              fn(
                                "concat",
                                process.env.liveUrl,
                                col("candidateDetail.photo")
                              ),
                              "photo",
                            ]
                ],
            },
                Source,
            { model: candidateStatus, include: [{ model: statusCode, attributes: ["statusName"] }] },
        
            {
                model: requirement,
                attributes: ["requirementName", "id", "uniqueId"],
                include: [
                    {
                        model: statusCode,
                        attributes: ['statusName']
                    }, {
                        model: client,
                        attributes: ["clientName", "id", "uniqueId"],
                        include: [{ model: statusCode, attributes: ['statusName'] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                        { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
                    }, {
                        model: recruiter,
                        attributes: ["id", "mainId", "firstName", "lastName"]
                    }]
            },
            {
                model: statusCode,
                attributes: ['statusName'],
            }, {
                model: recruiter,
                attributes: ['firstName', 'lastName', 'mobile'],
                include:[{model:user,attributes:["roleName"]}]
            },
            ],
            limit: limit,
            offset: (page * limit) - limit,
            order: [['createdAt', 'DESC']]
        });
        can_data.rows.forEach(candidate => {
            // Check if `candidateDetail` exists and `showAllDetails` is false
            if (candidate.candidateDetail && candidate.recruiter.user.roleName=="SUBVENDOR" && (!candidate.candidateDetail.showAllDetails || candidate.candidateDetail.showAllDetails == null)) {
              const attributesToRemove = ['firstName', 'lastName', 'mobile', 'email','alternateMobile'];
              attributesToRemove.forEach(attr => {
                candidate.candidateDetail[attr] = 'x'.repeat(candidate.candidateDetail[attr].length);
              });
            }
          });
        return can_data;
  };
