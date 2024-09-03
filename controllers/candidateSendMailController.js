const candidateDetails = require('../models/candidateDetail');
const candidate = require('../models/candidate');
const candidateStatus = require("../models/myCandidateStatus");
const { Op } = require("sequelize");
const email = require("../config/email.js");



exports.sendCandidateTemplateMail=async(req,res)=>{
    var templateName=req.body.template_name;
    await candidate.findOne({where:{id:req.body.candidateId}}).then(data=>{
        if (templateName == "1st_interview_round") {
            if(data.statusCode==301){
                data.update({
                    statusCode:303
                }).then(async ()=>{
                    await candidateStatus.create({
                        candidateId: data.id,
                        statusCode: 303,
                        mainId: req.mainId,
                        createdBy: req.userId,
                        updatedBy: req.userId,
                      });
                })
            }
        }
        else if (templateName == "initial_interview_rounds"){
            if(data.statusCode==303){
                data.update({
                    statusCode:304
                }).then(async ()=>{
                    await candidateStatus.create({
                        candidateId: data.id,
                        statusCode: 304,
                        mainId: req.mainId,
                        createdBy: req.userId,
                        updatedBy: req.userId,
                      });
                })
            }
        }
        else if(templateName == "final_interview_round"){
            if(data.statusCode==304){
                data.update({
                    statusCode:3041
                }).then(async ()=>{
                    await candidateStatus.create({
                        candidateId: data.id,
                        statusCode: 3041,
                        mainId: req.mainId,
                        createdBy: req.userId,
                        updatedBy: req.userId,
                      });
                })
            }
        }
        else if (templateName == "document_collect"){
            if(data.statusCode==3041||data.statusCode==304){
                data.update({
                    statusCode:305
                }).then(async ()=>{
                    await candidateStatus.create({
                        candidateId: data.id,
                        statusCode: 305,
                        mainId: req.mainId,
                        createdBy: req.userId,
                        updatedBy: req.userId,
                      });
                })
            }
        }
        else if (templateName == "salary_breakup_shared_confirmation") {
            if(data.statusCode==305){
                data.update({
                    statusCode:307
                }).then(async ()=>{
                    await candidateStatus.create({
                        candidateId: data.id,
                        statusCode: 306,
                        mainId: req.mainId,
                        createdBy: req.userId,
                        updatedBy: req.userId,
                      });
                      await candidateStatus.create({
                        candidateId: data.id,
                        statusCode: 307,
                        mainId: req.mainId,
                        createdBy: req.userId,
                        updatedBy: req.userId,
                      });
                })
            }
        }
        else if (templateName == "offer_released_confirmation"){
            if(data.statusCode==307){
                data.update({
                    statusCode:308
                }).then(async ()=>{
                    await candidateStatus.create({
                        candidateId: data.id,
                        statusCode: 308,
                        mainId: req.mainId,
                        createdBy: req.userId,
                        updatedBy: req.userId,
                      });
                })
            }
        }
        else if (templateName == "joining_confirmation") {
            if(data.statusCode==308){
                data.update({
                    statusCode:3081
                }).then(async ()=>{
                    await candidateStatus.create({
                        candidateId: data.id,
                        statusCode: 3081,
                        mainId: req.mainId,
                        createdBy: req.userId,
                        updatedBy: req.userId,
                      });
                })
            }
        }
    else{
        return res.status(200).json({status:false,message:"Template Name Missing"});
    }
        res.status(200).json({status:true,message:"Done"});
    }).catch(e=>{
        console.log(e);
        res.status(500).json({ message: "Error", status: false });
    });
};

exports.addSendByMailCandidate=async(req,res)=>{
    try {
        candidate.findOne({
            where: { requirementId: req.body.requirementId }, include: [
                {
                    model: candidateDetails,
                    where: {
                        [Op.or]: { email: req.body.email, mobile: "91" + req.body.mobile }
                    }

                }
            ]
        }).then(async data => {
            if (data) {
                res.status(200).json({ status: false, message: "Email Or Mobile Already In Use" });
            }
            else {
                var cnd_data = await candidate.findOne({ where: { mainId: req.mainId }, order: [['candidateInt', 'DESC']] });
                var myCandidate = {
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    mobile: "91" + req.body.mobile,
                    mainId: req.mainId,
                    skills: req.body.skills.split(',')
                }
                if (req.file) {
                    myCandidate.resume = "";
                }
                if (cnd_data) {
                    var candidateInt = Number(cnd_data.candidateInt) + 1
                    var candidateText = "CAN";
                }
                else {
                    var candidateInt = 10001;
                    var candidateText = "CAN";
                }
                var uniqueId = `${candidateText}${candidateInt}`
                await candidateDetails.create(myCandidate).then(async user_data => {
                    await candidate.create({
                        candidateDetailId: user_data.id,
                        recruiterId: req.recruiterId,
                        requirementId: req.body.requirementId,
                        statusCode: 301,
                        sourceId: req.body.sourceId,
                        isAnswered: req.body.isAnswered,
                        mainId: req.mainId,
                        candidateInt: candidateInt,
                        candidateText: candidateText,
                        uniqueId: uniqueId
                    }).then(async my_can => {
                        await candidateStatus.create({
                            candidateId: my_can.dataValues.id,
                            createdBy: req.recruiterId,
                            mainId: req.mainId,
                            updatedBy: req.recruiterId,
                            statusCode: 301
                        });
                        res.status(200).json({ status: true, message: "Candidate Added", candidateId: my_can.dataValues.id, candidateDetailsId: user_data.id, candidate_mobile: user_data.mobile });
                    })
                })
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "ERROR", status: false }) 
    }
};