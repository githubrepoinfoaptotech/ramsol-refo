const candidateDetails = require("../models/candidateDetail");
const candidate = require("../models/candidate");
const candidateStatus = require("../models/myCandidateStatus");
const { Op, col } = require("sequelize");
const Sequelize = require("../db/db");
const fn = Sequelize.fn;
const freeCandidateMessageActivity = require("../models/freeCandidateMessageActivity");
const { read } = require("fs");
const requirement = require("../models/requirement");
const clients = require("../models/client");
const sendCv=require("../models/sendCvMailCAndidate");
const candidateCpv=require("../models/candidateCpv");
const statusList = require("../models/statusList");
const Source=require("../models/source");
const chatUser = require("../models/chatUser");
const recruiterCandidateActivity = require("../models/recruiterCandidateActivity");
const recruiterWallet = require("../models/recruiterWallets");
const recruiter = require("../models/recruiter");
const moment = require("moment");
const mailFunction=require("../functions/sendReplyMail");
const recCredsRecord=require("../models/recCredsRecords.js");
const recordsVaule=require("../models/recordsVaule.js");
const user = require("../models/user");
//

exports.changeYesCadidateStatus = async (req, res) => {
  var templateName = req.body.template_name;
  await candidate
    .findOne({
      where: { id: req.body.candidateId },
      include: [{ model: candidateDetails, attributes: ["mobile"] }],
    })
    .then((data) => {
      if (templateName == "1st_interview_round") {
        if (data.statusCode == 303) {
          data
            .update({
              statusCode: 3031,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 3031,
                mainId: req.mainId,
                createdBy: req.userId,
                updatedBy: req.userId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivity(
            req,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "initial_interview_rounds") {
        if (data.statusCode == 3031) {
          data
            .update({
              statusCode: 304,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 304,
                mainId: req.mainId,
                createdBy: req.userId,
                updatedBy: req.userId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivity(
            req,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "final_interview_round") {
        if (data.statusCode == 304) {
          data
            .update({
              statusCode: 3041,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 3041,
                mainId: req.mainId,
                createdBy: req.userId,
                updatedBy: req.userId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivity(
            req,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "document_collect") {
        if (data.statusCode == 3041 || data.statusCode == 304) {
          data
            .update({
              statusCode: 305,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 305,
                mainId: req.mainId,
                createdBy: req.userId,
                updatedBy: req.userId,
              });
              var rec_data=await recruiter.findOne({where:{id:data.recruiterId},include:[{model:user}]});
              var req_data=await requirement.findOne({where:{id:data.requirementId}});
              if(rec_data.user.roleName=="SUBVENDOR"&&data.isInterviewDoneCredsSent==false)
                {
                  rec_data.recCreds=req_data.cvInterviewDoneValue+rec_data.recCreds;
                  data.isInterviewDoneCredsSent=true;
                  var record_data=await recCredsRecord.findOne({where:{vendorId:data.recruiterId,requirementId:data.requirementId,candidateId:data.id}});
                  await recordsVaule.create({
                    recCredsRecordId:record_data.id,
                    reason:307,
                    status:"TO-INVOICE",
                    value:req_data.cvInterviewDoneValue
                  });
                  //console.log(result);
                  await data.save();
                  await rec_data.save();
                }
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivity(
            req,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "salary_breakup_shared_confirmation") {
        if (data.statusCode == 305) {
          data
            .update({
              statusCode: 307,
            })
            .then(async () => {
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
              
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivity(
            req,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "offer_released_confirmation") {
        if (data.statusCode == 307) {
          data
            .update({
              statusCode: 308,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 308,
                mainId: req.mainId,
                createdBy: req.userId,
                updatedBy: req.userId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivity(
            req,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "joining_confirmation") {
        if (data.statusCode == 308) {
          data
            .update({
              statusCode: 3081,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 3081,
                mainId: req.mainId,
                createdBy: req.userId,
                updatedBy: req.userId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivity(
            req,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else {
        res
          .status(200)
          .json({ status: false, message: "Template Name Missing" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "Error", status: false });
    });
};

exports.addFreeCandidate = async (req, res) => {
  try {
    console.log(req.body);
    const roleName=req.roleName;
    if(roleName=="FREELANCER"||roleName=="SUBVENDOR"){
      if(roleName=="FREELANCER"){
        var sourceData=await Source.findOne({where:{uniqueId:"SOURCE10001"},attributes:['id']});
     }
     else{
       var sourceData=await Source.findOne({where:{uniqueId:"SOURCE10002"},attributes:['id']});
     }
    candidate 
    .findOne({
      where: { mainId:req.mainId },
      include: [
        {
          model: candidateDetails,
          where: {
            isExternal:"YES",
            createdBy:req.recruiterId,
            [Op.or]: {
              email: req.body.email,
              mobile: "91" + req.body.mobile,
            },
          },
        },
      ],
    })
    .then(async (data) => {
      if (data) {
        res
          .status(200)
          .json({ status: false, message: "Email id or Contact number is already in use" });
      } else {
        var cnd_data = await candidate.findOne({
          where: { mainId: req.mainId },
          order: [["candidateInt", "DESC"]],
        });

        var can_detail = await candidateDetails.findOne({
          where: { mobile: "91" + req.body.mobile, mainId: req.mainId },
        });

        var reason = "-";

        if (req.body.candidateProcessed == "NO") {
          reason = req.body.reason;
        }

        var alternateMobile = "";
        if (req.body.alternateMobile) {
          alternateMobile = "91" + req.body.alternateMobile;
        }

        var myCandidate = {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobile: "91" + req.body.mobile,
          alternateMobile: alternateMobile,
          mainId: req.mainId,
          skills: req.body.skills,
          currentLocation: req.body.currentLocation,
          preferredLocation: req.body.preferredLocation,
          nativeLocation: req.body.nativeLocation,
          experience: req.body.experience,
          relevantExperience: req.body.relevantExperience,
          currentCtc: req.body.currentCtc,
          expectedCtc: req.body.expectedCtc,
          dob: req.body.dob,
          noticePeriod: req.body.noticePeriod,
          reasonForJobChange: req.body.reasonForJobChange,
          candidateProcessed: req.body.candidateProcessed,
          differentlyAbled: req.body.differentlyAbled,
          educationalQualification: req.body.educationalQualification,
          gender: req.body.gender,
          reason: reason,
          isExternal:"YES",
          createdBy:req.recruiterId,
          currentCompanyName:req.body.currentCompanyName,
          panNumber:req.body.panNumber,
          linkedInProfile:req.body.linkedInProfile,
          showAllDetails:req.body.showAllDetails,
          education_gap:req.body.education_gap,
          reloaction_reason:req.body.reloaction_reason,
          offer_details:req.body.offer_details,
          career_gap:req.body.career_gap,
          document_check:req.body.document_check
        };

        if (cnd_data) {
          var candidateInt = Number(cnd_data.candidateInt) + 1;
          var candidateText = "CAN";
        } else {
          var candidateInt = 10001;
          var candidateText = "CAN";
        }
        var uniqueId = `${candidateText}${candidateInt}`;

        if (!can_detail) {
          await candidateDetails
            .create(myCandidate)
            .then(async (user_data) => { 
              await candidate
                .create({
                  candidateDetailId: user_data.id,
                  recruiterId: req.recruiterId,
                  requirementId: req.body.requirementId, 
                  statusCode: 301,
                  sourceId: sourceData.id,  
                  isAnswered: req.body.isAnswered,
                  mainId: req.mainId,
                  candidateInt: candidateInt,  
                  candidateText: candidateText,
                  uniqueId: uniqueId,
                  isCandidateCpv:false,
                  candidateRecruiterDiscussionRecording:req.body.candidateRecruiterDiscussionRecording,
                  candidateSkillExplanationRecording:req.body.candidateSkillExplanationRecording,
                  candidateMindsetAssessmentLink:req.body.candidateMindsetAssessmentLink,
                  candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording,
                  hideContactDetails:req.body.hideContactDetails
                })
                .then(async (my_can) => {
                  await candidateStatus.create({
                    candidateId: my_can.dataValues.id,
                    createdBy: req.recruiterId,
                    mainId: req.mainId,
                    updatedBy: req.recruiterId,
                    statusCode: 301,
                  });
                  if (req.body.sendMessage == true) {
                    await freeCandidateMessageActivity
                      .create({
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        phoneNumber: user_data.mobile,
                        candidateId: my_can.dataValues.id,
                        requirementId: my_can.dataValues.requirementId,
                        message: req.body.message,
                      })
                      .then(() => {
                        console.log("saved");
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  }
                  candidateHistory(
                    req,
                    my_can.dataValues.id,
                    user_data.mobile,
                    my_can.dataValues.requirementId
                  );
                  await mailFunction.sendMailAdminExternalCandidateAdded(req,my_can.dataValues.id);
                  // var rec_data=await recruiter.findOne({where:{id:req.recruiterId}});
                  // var req_data=await requirement.findOne({where:{id:req.body.requirementId}});
                  // rec_data.recCreds=rec_data.recCreds+req_data.cvShareValue;
                  // console.log(rec_data.recCreds);
                  // await rec_data.save();
                  res.status(200).json({
                    status: true,
                    message: "Candidate Added",
                    candidateId: my_can.dataValues.id,
                    candidateDetailsId: user_data.id,
                    candidate_mobile: user_data.mobile,
                  });
                });
            });
        } else {
          await candidateDetails
            .update(myCandidate, { where: { id: can_detail.id } })
            .then(async (user_data) => {
              await candidate
                .create({
                  candidateDetailId: can_detail.id,
                  recruiterId: req.recruiterId,
                  requirementId: req.body.requirementId,
                  statusCode: 301,
                  sourceId: req.body.sourceId,
                  isAnswered: req.body.isAnswered,
                  mainId: req.mainId,
                  candidateInt: candidateInt,
                  candidateText: candidateText,
                  uniqueId: uniqueId,
                  isCandidateCpv:false,
                  candidateRecruiterDiscussionRecording:req.body.candidateRecruiterDiscussionRecording,
                  candidateSkillExplanationRecording:req.body.candidateSkillExplanationRecording,
                  candidateMindsetAssessmentLink:req.body.candidateMindsetAssessmentLink,
                  candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording
                })
                .then(async (my_can) => {
                  await candidateStatus.create({
                    candidateId: my_can.dataValues.id,
                    createdBy: req.recruiterId,
                    mainId: req.mainId,
                    updatedBy: req.recruiterId,
                    statusCode: 301,
                  });
                  if (req.body.sendMessage == true) {
                    await freeCandidateMessageActivity
                      .create({
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        phoneNumber: user_data.mobile,
                        candidateId: my_can.dataValues.id,
                        requirementId: my_can.dataValues.requirementId,
                        message: req.body.message,
                      })
                      .then(() => {
                        console.log("saved");
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  }
                  await candidateHistory(
                    req,
                    my_can.dataValues.id,
                    can_detail.mobile,
                    my_can.dataValues.requirementId
                  );
                  // var rec_data=await recruiter.findOne({where:{id:req.recruiterId}});
                  // var req_data=await requirement.findOne({where:{id:req.body.requirementId}});
                  // rec_data.recCreds=rec_data.recCreds+req_data.cvShareValue;
                  // console.log(rec_data.recCreds);
                  // await rec_data.save();
                  //await mailFunction.sendMailAdminExternalCandidateAdded(req,my_can.dataValues.id);
                  
                  res.status(200).json({
                    status: true,
                    message: "Candidate Added",
                    candidateId: my_can.dataValues.id,
                    candidateDetailsId: can_detail.id,
                    candidate_mobile: user_data.mobile,
                  });
                });
            });
        }
      }
    });
    
    }
    else{

    
    candidate
      .findOne({
        where: { requirementId: req.body.requirementId },
        include: [
          {
            model: candidateDetails,
            where: {
              isExternal:"NO",
              [Op.or]: {
                email: req.body.email,
                mobile: "91" + req.body.mobile,
              },
            },
          },
        ],
      })
      .then(async (data) => {
        if (data) {
          res
            .status(200)
            .json({ status: false, message: "Email id or Contact number is already in use" });
        } else {
          var cnd_data = await candidate.findOne({
            where: { mainId: req.mainId },
            order: [["candidateInt", "DESC"]],
          });

          var can_detail = await candidateDetails.findOne({
            where: { mobile: "91" + req.body.mobile, mainId: req.mainId },
          });

          var reason = "-";

          if (req.body.candidateProcessed == "NO") {
            reason = req.body.reason;
          }

          var alternateMobile = "";
          if (req.body.alternateMobile) {
            alternateMobile = "91" + req.body.alternateMobile;
          }

          var myCandidate = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile: "91" + req.body.mobile,
            alternateMobile: alternateMobile,
            mainId: req.mainId,
            skills: req.body.skills,
            currentLocation: req.body.currentLocation,
            preferredLocation: req.body.preferredLocation,
            nativeLocation: req.body.nativeLocation,
            experience: req.body.experience,
            relevantExperience: req.body.relevantExperience,
            currentCtc: req.body.currentCtc,
            expectedCtc: req.body.expectedCtc,
            dob: req.body.dob,
            noticePeriod: req.body.noticePeriod,
            reasonForJobChange: req.body.reasonForJobChange,
            candidateProcessed: req.body.candidateProcessed,
            differentlyAbled: req.body.differentlyAbled,
            educationalQualification: req.body.educationalQualification,
            gender: req.body.gender,
            reason: reason,
            createdBy:req.recruiterId,
            isExternal:"NO",
            panNumber:req.body.panNumber,
            currentCompanyName:req.body.currentCompanyName,
            linkedInProfile:req.body.linkedInProfile,
            showAllDetails:req.body.showAllDetails,
            education_gap:req.body.education_gap,
            reloaction_reason:req.body.reloaction_reason,
            offer_details:req.body.offer_details,
            career_gap:req.body.career_gap,
            document_check:req.body.document_check
          };

          if (cnd_data) {
            var candidateInt = Number(cnd_data.candidateInt) + 1;
            var candidateText = "CAN";
          } else {
            var candidateInt = 10001;
            var candidateText = "CAN";
          }
          var uniqueId = `${candidateText}${candidateInt}`;

          if (!can_detail) {
            await candidateDetails
              .create(myCandidate)
              .then(async (user_data) => {
                await candidate
                  .create({
                    candidateDetailId: user_data.id,
                    recruiterId: req.recruiterId,
                    requirementId: req.body.requirementId,
                    statusCode: 301,
                    sourceId: req.body.sourceId,
                    isAnswered: req.body.isAnswered,
                    mainId: req.mainId,
                    candidateInt: candidateInt,
                    candidateText: candidateText,
                    uniqueId: uniqueId,
                    isCandidateCpv:false,
                    candidateRecruiterDiscussionRecording:req.body.candidateRecruiterDiscussionRecording,
                    candidateSkillExplanationRecording:req.body.candidateSkillExplanationRecording,
                    candidateMindsetAssessmentLink:req.body.candidateMindsetAssessmentLink,
                    candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording
                  })
                  .then(async (my_can) => {
                    await candidateStatus.create({
                      candidateId: my_can.dataValues.id,
                      createdBy: req.recruiterId,
                      mainId: req.mainId,
                      updatedBy: req.recruiterId,
                      statusCode: 301,
                    });
                    if (req.body.sendMessage == true) {
                      await freeCandidateMessageActivity
                        .create({
                          recruiterId: req.recruiterId,
                          mainId: req.mainId,
                          phoneNumber: user_data.mobile,
                          candidateId: my_can.dataValues.id,
                          requirementId: my_can.dataValues.requirementId,
                          message: req.body.message,
                        })
                        .then(() => {
                          console.log("saved");
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    }
                    candidateHistory(
                      req,
                      my_can.dataValues.id,
                      user_data.mobile,
                      my_can.dataValues.requirementId
                    );
                    res.status(200).json({
                      status: true,
                      message: "Candidate Added",
                      candidateId: my_can.dataValues.id,
                      candidateDetailsId: user_data.id,
                      candidate_mobile: user_data.mobile,
                    });
                  });
              });
          } else {
            await candidateDetails
              .update(myCandidate, { where: { id: can_detail.id } })
              .then(async (user_data) => {
                await candidate
                  .create({
                    candidateDetailId: can_detail.id,
                    recruiterId: req.recruiterId,
                    requirementId: req.body.requirementId,
                    statusCode: 301,
                    sourceId: req.body.sourceId,
                    isAnswered: req.body.isAnswered,
                    mainId: req.mainId,
                    candidateInt: candidateInt,
                    candidateText: candidateText,
                    uniqueId: uniqueId,
                    isCandidateCpv:false,
                    candidateRecruiterDiscussionRecording:req.body.candidateRecruiterDiscussionRecording,
                    candidateSkillExplanationRecording:req.body.candidateSkillExplanationRecording,
                    candidateMindsetAssessmentLink:req.body.candidateMindsetAssessmentLink,
                    candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording
                  })
                  .then(async (my_can) => {
                    await candidateStatus.create({
                      candidateId: my_can.dataValues.id,
                      createdBy: req.recruiterId,
                      mainId: req.mainId,
                      updatedBy: req.recruiterId,
                      statusCode: 301,
                    });
                    if (req.body.sendMessage == true) {
                      await freeCandidateMessageActivity
                        .create({
                          recruiterId: req.recruiterId,
                          mainId: req.mainId,
                          phoneNumber: user_data.mobile,
                          candidateId: my_can.dataValues.id,
                          requirementId: my_can.dataValues.requirementId,
                          message: req.body.message,
                        })
                        .then(() => {
                          console.log("saved");
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    }
                    candidateHistory(
                      req,
                      my_can.dataValues.id,
                      can_detail.mobile,
                      my_can.dataValues.requirementId
                    );
                    res.status(200).json({
                      status: true,
                      message: "Candidate Added",
                      candidateId: my_can.dataValues.id,
                      candidateDetailsId: can_detail.id,
                      candidate_mobile: user_data.mobile,
                    });
                  });
              });
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.uploadScreenShot=async(req,res)=>{
  freeCandidateMessageActivity.findOne({where:{id:req.body.id}}).then(async data=>{
    await data.update({
      screenShot: "screenShots" + "/" + req.file.key,
    });
    res.status(200).json({ message:"done" , status: true });
  })
  .catch((e) => {
    res.status(500).json({ message: "Error", status: false });
  });
}
exports.freeMessageActivity = async (req, res) => {
  const { page } = req.body;
  const limit = 10;
  var myWhere = { mainId: req.mainId };
  if (req.body.fromDate && req.body.toDate) {
    const fromDate = moment(req.body.fromDate).startOf("day").toISOString();
    const toDate = moment(req.body.toDate).endOf("day").toISOString();
    myWhere.createdAt = {
      [Op.between]: [fromDate, toDate],
    };
  }
  if (req.body.recruiterId) {
    myWhere.recruiterId = req.body.recruiterId;
  }
  freeCandidateMessageActivity
    .findAndCountAll({
      where: myWhere,
      attributes:['id','phoneNumber','message','screenShot',[
        fn(
          "concat",
          process.env.liveUrl,
          col("screenShot")
        ),
        "screenShot",
      ],],
      include: [
        {
          model: candidate,
          attributes: ["id", "uniqueId"],
          include: [
            { model: candidateDetails, attributes: ["firstName", "lastName"] },
          ],
        },
        { model: requirement, attributes: ["requirementName", "uniqueId"] },
        { model: recruiter },
      ],
      limit: limit,
      offset: page * limit - limit,
      order: [["createdAt", "DESC"]],
    })
    .then((data) => {
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    })
    .catch((e) => {
      res.status(500).json({ message: "Error", status: false });
    });
};



exports.viewSingleFreeMessage = async (req, res) => {
  freeCandidateMessageActivity
    .findOne({
      where: { id: req.body.id },
      attributes:['id','phoneNumber','message','screenShot',[
        fn(
          "concat",
          process.env.liveUrl,
          col("screenShot")
        ),
        "screenShot",
      ],],
      include: [
        {
          model: candidate,
          attributes: ["id", "uniqueId"],
          include: [
            { model: candidateDetails, attributes: ["firstName", "lastName"] },
          ],
        },
        { model: requirement, attributes: ["requirementName", "uniqueId"] },
        { model: recruiter },
      ],
    })
    .then((data) => {
      res.status(200).json({ data: data, status: true });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "Error", status: false });
    });
};

//functions
async function candidateHistory(req, candidateId, mobile, requirementId) {
  var dateObj = new Date();
  mywhere = {
    //   createdAt: {
    //     [Op.and]: [
    //       Sequelize.literal(
    //         `date_trunc('day', "createdAt") = '${dateObj
    //           .toISOString()
    //           .slice(0, 10)}'`
    //       ),
    //       Sequelize.literal(
    //         `extract(month from "createdAt") = ${dateObj.getMonth() + 1}`
    //       ),
    //       Sequelize.literal(
    //         `extract(year from "createdAt") = ${dateObj.getFullYear()}`
    //       ),
    //     ],
    //   },
    //candidateId:newcandidate.candidateId,
    phoneNumber: mobile,
    mainId: req.mainId,
  };
  const activity = await recruiterCandidateActivity.findOne({ where: mywhere });
  if (!activity) {
    recruiterCandidateActivity
      .create({
        candidateId: candidateId,
        phoneNumber: mobile,
        requirementId: requirementId,
        mainId: req.mainId,
        recruiterId: req.recruiterId,
      })
      .then(async () => {
        // Wallet = await recruiterWallet.findOne({
        //   where: { mainId: req.mainId },
        // });
        // messagesLeft = Wallet.remainingMessages - 1;
        // await Wallet.update({
        //   remainingMessages: messagesLeft,
        // });
      });
  }
};


////open page api's


exports.changeYesCadidateStatusOpen = async (req, res) => {
  var templateName = req.body.template_name;
  await candidate
    .findOne({
      where: { id: req.body.candidateId },
      include: [{ model: candidateDetails, attributes: ["mobile"] }],
    })
    .then((data) => {
      if (templateName == "1st_interview_round") {
        if (data.statusCode == 303) {
          data
            .update({
              statusCode: 3031,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 3031,
                mainId: data.mainId,
                createdBy: data.recruiterId,
                updatedBy: data.recruiterId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivityOpen(
            data.mainId,
            data.recruiterId,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "initial_interview_rounds") {
        if (data.statusCode == 3031) {
          data
            .update({
              statusCode: 304,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 304,
                mainId: data.mainId,
                createdBy: data.recruiterId,
                updatedBy: data.recruiterId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivityOpen(
            data.mainId,
            data.recruiterId,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "final_interview_round") {
        if (data.statusCode == 304) {
          data
            .update({
              statusCode: 3041,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 3041,
                mainId: data.mainId,
                createdBy: data.recruiterId,
                updatedBy: data.recruiterId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivity(
            req,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "document_collect") {
        if (data.statusCode == 3041 || data.statusCode == 304) {
          data
            .update({
              statusCode: 305,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 305,
                mainId: data.mainId,
                createdBy: data.recruiterId,
                updatedBy: data.recruiterId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivityOpen(
            data.mainId,
            data.recruiterId,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "salary_breakup_shared_confirmation") {
        if (data.statusCode == 305) {
          data
            .update({
              statusCode: 307,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 306,
                mainId: data.mainId,
                createdBy: data.recruiterId,
                updatedBy: data.recruiterId,
              });
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 307,
                mainId: data.mainId,
                createdBy: data.recruiterId,
                updatedBy: data.recruiterId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivityOpen(
            data.mainId,
            data.recruiterId,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "offer_released_confirmation") {
        if (data.statusCode == 307) {
          data
            .update({
              statusCode: 308,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 308,
                mainId: data.mainId,
                createdBy: data.recruiterId,
                updatedBy: data.recruiterId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivityOpen(
            data.mainId,
            data.recruiterId,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else if (templateName == "joining_confirmation") {
        if (data.statusCode == 308) {
          data
            .update({
              statusCode: 3081,
            })
            .then(async () => {
              await candidateStatus.create({
                candidateId: data.id,
                statusCode: 3081,
                mainId: data.mainId,
                createdBy: data.recruiterId,
                updatedBy: data.recruiterId,
              });
            });
        }
        if (req.body.sendMessage == true) {
          saveCandidateMessageActivityOpen(
            data.mainId,
            data.recruiterId,
            data.id,
            data.requirementId,
            req.body.message,
            data.candidateDetail.mobile
          );
        }
        res.status(200).json({ status: true, message: "Done" });
      } else {
        res
          .status(200)
          .json({ status: false, message: "Template Name Missing" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "Error", status: false });
    });
};





exports.updateCrediNoteStatusOpen = async (req, res) => {
  var can_data = await candidate.findOne({
    where: { id: req.body.candidateId, statusCode: 312 },
  });
  if (can_data) {
    await can_data.update({
      statusCode: 313,
      creditNoteReason:req.body.creditNoteReason
    });
    var can_status = await candidateStatus.findOne({
      where: { candidateId: req.body.candidateId, statusCode: 313 },
    });
    if (!can_status) {
      await candidateStatus
        .create({
          candidateId: req.body.candidateId,
          statusCode: 313,
          mainId: can_data.mainId,
          createBy: can_data.recruiterId,
          updatedBy: can_data.recruiterId,
        })
        .then(() => {
          res.status(200).json({ status: true  ,message:"Candidate moved to Credit Note" });
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({ status: false, mesage: "Error" });
        });
    }
  } else {
    res
      .status(200)
      .json({ status: false, mesage: "Cannot Perform This Action!!" });
  }
};
exports.updateJoinedStatusOpen = async (req, res) => {
  var can_data = await candidate.findOne({
    where: { id: req.body.candidateId, statusCode: 3081 },
    include: [candidateDetails],
  });
  if (can_data) {
    await can_data.update({
      statusCode: 309,
      joinedDate: req.body.joinedDate,
    });
    var can_status = await candidateStatus.findOne({
      where: { candidateId: req.body.candidateId, statusCode: 309 },
    });
    if (!can_status) {
      await candidateStatus
        .create({
          candidateId: req.body.candidateId,
          statusCode: 309,
          mainId: can_data.mainId,
          createBy: can_data.recruiterId,
          updatedBy: can_data.recruiterId,
        })
        .then(async () => {
          myNotificationObj = {
            candidate:
              can_data.candidateDetail.firstName +
              can_data.candidateDetail.lastName +
              "(" +
              can_data.uniqueId +
              ")",
            user: can_data.recruiterId,
            status: 309,
          };
          await firebaseNotification.sendNotification(myNotificationObj);
          res.status(200).json({ status: true });
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({ status: false, mesage: "Error" });
        });
    }
  } else {
    res
      .status(200)
      .json({ status: false, mesage: "Cannot Perform This Action!!" });
  }
};

exports.updateOfferDeclineStatusOpen = async (req, res) => {
  var can_data = await candidate.findOne({
    where: { id: req.body.candidateId, statusCode: 308 },
  });
  if (can_data) {
    await can_data.update({
      statusCode: 310,
      offerDeclinedReason:req.body.offerDeclinedReason
    });
    var can_status = await candidateStatus.findOne({
      where: { candidateId: req.body.candidateId, statusCode: 310 },
    });
    if (!can_status) {
      await candidateStatus
        .create({
          candidateId: req.body.candidateId,
          statusCode: 310,
          mainId: can_data.mainId,
          createBy: can_data.recruiterId,
          updatedBy: can_data.recruiterId,
        })
        .then(() => {
          res.status(200).json({ status: true, message:"Candidate moved to offerDeclined" });
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({ status: false, mesage: "Error" });
        });
    }
  }
};
exports.dropCandidateOpen = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.body;
    var mywhere = {
      id: id,
      statusCode: { [Op.or]: [301, 303, 304, 3041, 305, 306, 307] },
    };
    candidate.findOne({ where: mywhere }).then((data) => {
      if (data) {
        Promise.all([
          data.update({ statusCode: 302,droppedReason:req.body.droppedReason }),
          candidateStatus.create({
            candidateId: id,
            statusCode: 302,
            mainId: data.mainId,
            createBy: data.recruiterId,
            updatedBy: data.recruiterId,
          }),
        ]).then(() => {
          res
            .status(200)
            .json({ message: "Candidate Droped Successfully", status: true });
        });
      } else {
        res.status(200).json({ message: "Candidate Not Found", status: false });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false });
  }
};
exports.updateJoiningDitchedStatusOpen = async (req, res) => {
  var can_data = await candidate.findOne({
    where: { id: req.body.candidateId, statusCode: { [Op.or]: [309, 3081] } },
  });

  console.log(can_data);

  if (can_data) {
    await can_data.update({
      statusCode: 311,
      ditchReason:req.body.ditchReason
    });
    var can_status = await candidateStatus.findOne({
      where: { candidateId: req.body.candidateId, statusCode: 311 },
    });
    if (!can_status) {
      await candidateStatus
        .create({
          candidateId: req.body.candidateId,
          statusCode: 311,
          mainId: can_data.mainId,
          createBy: can_data.recruiterId,
          updatedBy: can_data.recruiterId,
        })
        .then(() => {
          res.status(200).json({ status: true, message:"Candidate moved to ditch"  });
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({ status: false, mesage: "Error" });
        });
    }
  }
};
exports.updateInvoicedStatusOpen = async (req, res) => {
  try {
    var can_data = await candidate.findOne({
      where: { id: req.body.candidateId, statusCode: { [Op.or]: [309, 3081] } },
    });
    if (can_data) {
      await can_data.update({
        statusCode: 312,
        invoiceValue: req.body.invoice,
        invoicedDate: req.body.invoicedDate,
      });
      var can_status = await candidateStatus.findOne({
        where: { candidateId: req.body.candidateId, statusCode: 312 },
      });
      if (!can_status) {
        await candidateStatus
          .create({
            candidateId: req.body.candidateId,
            statusCode: 312,
            mainId: can_data.mainId,
            createBy: can_data.recruiterId,
            updatedBy: can_data.recruiterId,
          })
          .then(() => {
            res.status(200).json({ status: true });
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error" });
          });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, mesage: "Error" });
  }
};
exports.updateStcStatusOpen = async (req, res) => {
  try {
    const { id } = req.body;
    var mywhere = {
      id: id, 
      statusCode: { [Op.or]: [301] },
    };
    candidate.findOne({ where: mywhere }).then((data) => {
      if (data) {
        Promise.all([
          data.update({ statusCode: 303}),
          candidateStatus.create({
            candidateId: id,
            statusCode: 303,
            mainId: data.mainId,
            createBy: data.recruiterId,
            updatedBy: data.recruiterId,
          }),
        ]).then(() => {
          if(req.companyType=="COMPANY")
            {
              res
              .status(200)
              .json({ message: "Candidate is Submitted To Hiring Manager", status: true });
            }
            else
            {
              res
              .status(200)
              .json({ message: "Candidate is Submitted To Client", status: true });
            }
          
        });
      } else {
        res.status(200).json({ message: "Candidate Not Found", status: false });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false });
  }
};
exports.viewCandidateOpen = async (req, res) => {
  try {
    await candidate
      .findOne({
        where: { id: req.body.id },
        attributes: [
          "id",
          "isAnswered",
          "mainId",
          "uniqueId",
          "invoicedDate",
          "joinedDate",
          "invoiceValue",
          'droppedReason',
          "ditchReason",
          "creditNoteReason",
          "offerDeclinedReason",
          "candidateRecruiterDiscussionRecording",
          "candidateSkillExplanationRecording",
          "candidateMindsetAssessmentLink",
          "candidateAndTechPannelDiscussionRecording",
          "isCandidateCpv",
          [
            fn(
              "concat",
              process.env.liveUrl,
              col("candidateMindsetAssessmentLink")
            ),
            "candidateMindsetAssessmentLink",
          ],
        
        ],
        include: [
          {
            model: Source,
          },
          {
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
              "currentCompanyName",
              [
                fn(
                  "concat",
                  process.env.liveUrl,
                  col("candidateDetail.resume")
                ),
                "resume",
              ],
            ],
          },
          {
            model: statusList,
            attributes: ["statusCode", "statusName"],
          },
          {
            model: requirement,
            attributes: ["id", "requirementName", "uniqueId", "experience",'jobLocation','gist'],
            include: [
              {
                model: clients,
                attributes: ["clientName", "uniqueId",'clientWebsite','clientIndustry'],
                include: [
                  {
                    model: statusList,
                    attributes: ["statusCode", "statusName"],
                  },
                ],
              },
              {
                model: recruiter,
                attributes: ["firstName", "lastName","companyName"],

              },
            ],
          },
        ],
      })
      .then(async (data) => {
        if (data) {
          // const chatuserdata = await chatUser.findOne({
          //   where: {
          //     phoneNumber: data.candidateDetail.mobile,
          //     mainId: data.mainId,
          //   },
          // });
          mycomp=await recruiter.findOne({where:{userId:data.mainId}});
          res
            .status(200)
            .json({ data: data, status: true,companyName:mycomp.companyName,companyWebsite:mycomp.companyWebsite});
        } else {
          res.status(200).json({ data: [], status: false });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getAllCandidateStatusOpen = async (req, res) => {
  candidateStatus
    .findAll({
      where: { candidateId: req.body.id },
      include: [statusList],
      order: [["createdAt", "ASC"]],
    })
    .then((data) => {
      res.status(200).json({ status: true, data: data });
    })
    .catch((e) => {
      res.status(500).json({ status: false, message: "Error" });
    });
};

exports.reciveCandidateConformation=async(req,res)=>
  {
    try{
    var cpv_data=await candidateCpv.findOne({where:{id:req.body.id}});
      if(cpv_data)
        {
          await cpv_data.update({
            candidateConformation:req.body.candidateConformation
          });
          res.status(200).json({ status: true, message: "Response Recorded" });
        }
        else
        {
          res.status(200).json({ status: false, message: "Invalid Action" });
        }
        
    }
    catch(e)
    {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error" });
    }
  };


////
async function saveCandidateMessageActivity(
  req,
  candidateId,
  requirementId,
  message,
  phoneNumber
) {
  try {
    await freeCandidateMessageActivity
      .create({
        recruiterId: req.recruiterId,
        mainId: req.mainId,
        phoneNumber: phoneNumber,
        candidateId: candidateId,
        requirementId: requirementId,
        message: message,
      })
      .then((data) => {
        console.log(data);
      });
  } catch (e) {
    console.log(e);
  }
};
async function saveCandidateMessageActivityOpen(
  mainId,
  recruiterId,
  candidateId,
  requirementId,
  message,
  phoneNumber
) {
  try {
    await freeCandidateMessageActivity
      .create({
        recruiterId: recruiterId,
        mainId: mainId,
        phoneNumber: phoneNumber,
        candidateId: candidateId,
        requirementId: requirementId,
        message: message,
      })
      .then((data) => {
        console.log(data);
      });
  } catch (e) {
    console.log(e);
  }
}

