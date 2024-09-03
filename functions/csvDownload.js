const candidateDetails = require('../models/candidateDetail');
const candidate = require('../models/candidate');
const requirement = require('../models/requirement');
const statusCode = require('../models/statusList');
const recruiter = require('../models/recruiter');
const client = require("../models/client");
const candidateStatus = require("../models/myCandidateStatus");
const chatUser = require("../models/chatUser");
const user = require("../models/user");
const recruiterSettings = require("../models/recruiterSettings");
const recruiterWallet=require("../models/recruiterWallets");
const moment = require('moment');
const Source = require('../models/source');
const { Op } = require("sequelize");



exports.csvDownloadReports=async(req,Code)=>{
    console.log(req.body);
        var mywhere = { mainId: req.mainId ,statusCode:Code};

        if (req.body.fromDate && req.body.toDate) {

            const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
            const toDate = moment(req.body.toDate).endOf('day').toISOString();
            mywhere.createdAt = {
            [Op.between]: [fromDate, toDate]
            }
        }
        var recruiterWhere={};
        if (req.body.recruiterId) {
            recruiterWhere.recruiterId = req.body.recruiterId
        }


    // var include=[
    //     {
    //         model:candidate,
    //         include:[{
    //             model:candidateDetails
    //         }, 
    //         Source, 
    //         { model: candidateStatus, include: [{ model: statusCode, attributes: ["statusName"] }] },

    //             {
    //                 model: requirement,
    //                 attributes: ["requirementName", "id", "uniqueId"],
    //                 include: [
    //                     {
    //                         model: statusCode,
    //                         attributes: ['statusName']
    //                     }, {
    //                         model: client,
    //                         attributes: ["clientName", "id", "uniqueId"],
    //                         include: [{ model: statusCode, attributes: ['statusName'] }],
    //                     }, {
    //                         model: recruiter,
    //                         attributes: ["id", "mainId", "firstName", "lastName"]
    //                     }]
    //             },
    //             {
    //                 model: statusCode,
    //                 attributes: ['statusName'],
    //             }, {
    //                 model: recruiter,
    //                 attributes: ['firstName', 'lastName', 'mobile']
    //             },
    //         ],
    //     }
    // ];
        const can_data=await candidateStatus.findAll({
            distinct: true,
        // attributes:[''],
            where: mywhere,
            include:[{
                model:candidate,
                where:recruiterWhere,
                include:[{
                    model:candidateDetails
                }, 
                Source, 
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
                                include: [{ model: statusCode, attributes: ['statusName'] }],
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
                        attributes: ['firstName', 'lastName', 'mobile']
                    },
                ],
            }],
            order: [['createdAt', 'DESC']]
        });
        console.log(can_data.length);
        if(Code==313||Code==312){
            var xldata=await can_data.map((data,index)=>{
                   
                return {
                    S_no:index+1,
                    RequirementName:data.candidate.requirement.requirementName+"("+data.candidate.requirement.uniqueId+")",
                    CCName:data.candidate.requirement.recruiter.firstName+" "+data.candidate.requirement.recruiter.lastName,
                    RecruiterName:data.candidate.recruiter.firstName+" "+data.candidate.recruiter.lastName,
                    CandidateName:data.candidate.candidateDetail.firstName+" "+data.candidate.candidateDetail.lastName+"("+data.candidate.uniqueId+")",
                    Email:data.candidate.candidateDetail.email,
                    Mobile:data.candidate.candidateDetail.mobile,
                    InVoicedDate:moment(data.candidate.invoicedDate).format('DD-MM-YYYY'),
                    invoiceValue:data.candidate.invoiceValue,
                    created:moment(data.createdAt).format('DD-MM-YYYY')
                }
            });           
        }else if(Code==309){
            var xldata=await can_data.map((data,index)=>{
                   
                return {
                    S_no:index+1,
                    RequirementName:data.candidate.requirement.requirementName+"("+data.candidate.requirement.uniqueId+")",
                    CCName:data.candidate.requirement.recruiter.firstName+" "+data.candidate.requirement.recruiter.lastName,
                    RecruiterName:data.candidate.recruiter.firstName+" "+data.candidate.recruiter.lastName,
                    CandidateName:data.candidate.candidateDetail.firstName+" "+data.candidate.candidateDetail.lastName+"("+data.candidate.uniqueId+")",
                    Email:data.candidate.candidateDetail.email,
                    Mobile:data.candidate.candidateDetail.mobile,
                    joinedDate:moment(data.candidate.joinedDate).format('DD-MM-YYYY'),
                    created:moment(data.createdAt).format('DD-MM-YYYY')
                }
            });
        }
        else{
            var xldata=await can_data.map((data,index)=>{
                   
                return {
                    S_no:index+1,
                    RequirementName:data.candidate.requirement.requirementName+"("+data.candidate.requirement.uniqueId+")",
                    CCName:data.candidate.requirement.recruiter.firstName+" "+data.candidate.requirement.recruiter.lastName,
                    RecruiterName:data.candidate.recruiter.firstName+" "+data.candidate.recruiter.lastName,
                    CandidateName:data.candidate.candidateDetail.firstName+" "+data.candidate.candidateDetail.lastName+"("+data.candidate.uniqueId+")",
                    Email:data.candidate.candidateDetail.email,
                    Mobile:data.candidate.candidateDetail.mobile,
                    created:moment(data.createdAt).format('DD-MM-YYYY'),
                }
            });
        }
                
                return xldata

};
exports.csvDashboard=async(req,Code)=>{
    var mywhere = { mainId: req.mainId ,statusCode:Code};

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


    if (req.body.recruiterId) {
        mywhere.recruiterId = req.body.recruiterId
    }
    if (req.body.candidate) {
        mywhere.uniqueId = req.body.candidate
    }


    const can_data=await candidate.findAll({
            distinct: true,
           // attributes:[''],
           where: mywhere,
            include: [{
                model:candidateDetails
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
                            include: [{ model: statusCode, attributes: ['statusName'] }],
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
                    attributes: ['firstName', 'lastName', 'mobile']
                },
            ],
            order: [['createdAt', 'DESC']]
        });
        if(Code==302){
        var xldata=await can_data.map((data,index)=>{

            return {
                S_no:index+1,
                RequirementName:data.requirement.requirementName+"("+data.requirement.uniqueId+")",
                CCName:data.requirement.recruiter.firstName+" "+data.requirement.recruiter.lastName,
                RecruiterName:data.recruiter.firstName+" "+data.recruiter.lastName,
                CandidateName:data.candidateDetail.firstName+" "+data.candidateDetail.lastName+"("+data.uniqueId+")",
                Email:data.candidateDetail.email,
                Mobile:data.candidateDetail.mobile,
                created:moment(data.createdAt).format('DD-MM-YYYY'),
            }
        });
        return xldata  
    }
        else{
            var xldata=await can_data.map((data,index)=>{

                return {
                    S_no:index+1,
                    RequirementName:data.requirement.requirementName+"("+data.requirement.uniqueId+")",
                    CCName:data.requirement.recruiter.firstName+" "+data.requirement.recruiter.lastName,
                    RecruiterName:data.recruiter.firstName+" "+data.recruiter.lastName,
                    CandidateName:data.candidateDetail.firstName+" "+data.candidateDetail.lastName+"("+data.uniqueId+")",
                    Email:data.candidateDetail.email,
                    Mobile:data.candidateDetail.mobile,
                    statusName:data.statusList.statusName,
                    created:moment(data.createdAt).format('DD-MM-YYYY'),
                }
            });
            return xldata  
        }
         
};