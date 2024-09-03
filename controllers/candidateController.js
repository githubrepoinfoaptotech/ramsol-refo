//models

const candidateDetails = require("../models/candidateDetail");
const candidate = require("../models/candidate");
const requirement = require("../models/requirement");
const statusCode = require("../models/statusList");
const recruiter = require("../models/recruiter");
const client = require("../models/client");
const candidateStatus = require("../models/myCandidateStatus");
const chatUser = require("../models/chatUser");
const user = require("../models/user");
const recruiterSettings = require("../models/recruiterSettings");
const recruiterWallet = require("../models/recruiterWallets");
const sendCv=require("../models/sendCvMailCAndidate");
const moment = require("moment");
const csvDownload = require("../functions/csvDownload");
const dashboardreport = require("../functions/dashboardreport");
const myReport = require("../functions/candidatereport");
const recruiterCandidateActivity = require("../models/recruiterCandidateActivity");
const existingCandidate=require("../models/existingCandidate");
const recCredsRecord=require("../models/recCredsRecords.js");
const recordsVaule=require("../models/recordsVaule.js");
const candidateCpv=require("../models/candidateCpv");
const email = require("../config/email.js");
const mailFunction=require("../functions/sendReplyMail");
require("dotenv").config();

//
//
//const sequelize=require("sequelize");
const Sequelize = require("../db/db");
const fn = Sequelize.fn;
const XLSX = require('xlsx');
const { Op, col,literal } = require("sequelize");
const { QueryTypes } = require("sequelize");
const Source = require("../models/source");
const firebaseNotification = require("../functions/firebaseSendNotification");
const statusList = require("../models/statusList");
const myCandidateStatus = require("../models/myCandidateStatus");
const existingCandidates = require("../models/existingCandidate");
const clients = require("../models/client");
const candidateNote = require("../models/candidateNotes.js");
//
exports.addcandidateRequirement = async (req, res) => {
  try {
    const { id, requirementId, recruiterId, mainId } = req.body;
    const cdata = candidateDetails.findOne({ where: { id: id } });
    if (cdata) {
      await candidate
        .create({
          candidateDetailsId: cdata.id,
          recruiterId: recruiterId,
          requirementId: requirementId,
          mainId: req.mainId,
        })
        .then((data) => {
          res.status(200).json({
            message: "Successfully Created A Requirement For A Candidate",
            status: true,
            data: data,
          });
        });
    } else {
      res.status(200).json({ message: "Data Not Found", status: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", status: false });
  }
};

// exports.viewCandidateRequirement=async(req,res)=>{
//     try {
//         const {page}=req.body;
//         const limit=10;
//         // candidateDetails.findAndCountAll({mainId:req.mainId,include:[candidate],limit:limit,offset:(page*limit)-limit}).then(data=>{
//         //     res.status(200).json({status:true,data:data});
//         // })
//         candidate.findAndCountAll({include:[{
//             model:candidateDetails,
//             where:{mainId:req.mainId}
//         },],
//         limit:limit,
//         offset:(page*limit)-limit
//         }).then(data=>{
//             res.status(200).json({data:data.rows,count:data.count,status:true});
//         })
//     } catch (error) {
//         console.log(e);      
//         res.status(500).json({status:false,mesage:"Error"});
//     }
// };
// exports.changeCandidateRequirementStatus=async(req,res)=>{ 
//     candidate.findOne({where:{requirementId:req.body.requirementId}}).then(data=>{
//         if(data.isActive==true){
//             data.update({
//                 isActive:false
//             });
//             res.status(200).json({status:true,message:"Inactive"});
//         }else{ 
//             data.update({
//                 isActive:true
//             });
//             res.status(200).json({status:true,message:"Active"});
//         }
//     }).catch(e=>{ 
//         res.status(500).json({status:false,mesage:"Error"});
//     });
// };
exports.updateCandidateResume = async (req, res) => {
  candidateDetails
    .findOne({ where: { id: req.body.id } })
    .then(async (data) => {
      if (req.file) {
        await data.update({
          resume: "resumes" + "/" + req.file.key,
        });
       res.status(200).json({ status: true, message: "Resume Added" });  
      } else {
        res.status(200).json({ status: true, message: "No Resume Submitted" });
      }
    })
    .catch((e) => {
      res.status(500).json({ status: false, mesage: "Error" });
    });
};

exports.updateCandidateDocument=async(req,res)=>{
  candidateDetails
  .findOne({ where: { id: req.body.id } })
  .then(async (data) => {
    if (req.file) {
      await data.update({
        document: "documents" + "/" + req.file.key,
      });
     res.status(200).json({ status: true, message: "Resume Added" });  
    } else {
      res.status(200).json({ status: true, message: "No Resume Submitted" });
    }
  })
  .catch((e) => {
    res.status(500).json({ status: false, mesage: "Error" });
  });
};

exports.updateCandidatePhoto=async(req,res)=>{
  candidateDetails
  .findOne({ where: { id: req.body.id } })
  .then(async (data) => {
    if (req.file) {
      await data.update({
        photo: "photos" + "/" + req.file.key,
      });
     res.status(200).json({ status: true, message: "Resume Added" });  
    } else {
      res.status(200).json({ status: true, message: "No Resume Submitted" });
    }
  })
  .catch((e) => {
    res.status(500).json({ status: false, mesage: "Error" });
  });
};

exports.checkCandidateDetailExist = async (req, res) => {
  const roleName=req.roleName;
  if(roleName=="FREELANCER"||roleName=="SUBVENDOR"){
    var can_detail = await candidateDetails.findOne({
      where: { mobile: "91" + req.body.mobile, mainId: req.mainId ,createdBy:req.recruiterId,isExternal:"YES"},
    });
    if (can_detail) {
      res.status(200).json({ status: true, data: can_detail }); 
    } else {
      res.status(200).json({ status: false, message: "No data found" });
    }
  }
  else{
    var can_detail = await candidateDetails.findOne({
      where: { mobile: "91" + req.body.mobile, mainId: req.mainId},
    });
    if (can_detail) {
      res.status(200).json({ status: true, data: can_detail });
    } else {
      res.status(200).json({ status: false, message: "No data found" });
    }
  }
 
};
exports.candidateExist=async(req,res)=>{
  const roleName=req.roleName;
  if(roleName=="FREELANCER"||roleName=="SUBVENDOR"){
  await candidate
      .findOne({
        where: { mainId:req.mainId },
        include: [
          {
            model: candidateDetails,
            where: {
              [Op.or]: {
                email: req.body.email,
                mobile: "91" + req.body.mobile,
              },
            },
          },
        ],
      }).then(async (data) => {
        const isExist=await existingCandidates.findOne({where: {mainId:req.mainId,
          [Op.or]: {
            email: req.body.email,
            mobile: "91" + req.body.mobile,
          },
        }});
        if (data||isExist) {
          res.status(200).json({
            status: false,
            message: "Email id or Contact number is already in use",
          });
        } else {
          res.status(200).json({
            status: true,
          });
        }
        })
      }
      else{
        candidate
        .findOne({
          where: { requirementId: req.body.requirementId },
          include: [
            {
              model: candidateDetails,
              where: {
                [Op.or]: {
                  email: req.body.email,
                  mobile: "91" + req.body.mobile,
                },
              },
            },
          ],
        }).then(async (data) => {
          if (data) {
            res.status(200).json({
              status: false,
              message: "Email id or Contact number is already in use",
            });
          } else {
            res.status(200).json({
              status: true,
            });
          }
          })
      }
};
exports.addCandidate = async (req, res) => {
  const roleName=req.roleName;
  try {
    if(roleName=="FREELANCER"||roleName=="SUBVENDOR"){
      if(roleName=="FREELANCER"){
         var sourceData=await Source.findOne({where:{name:"Freelancer"},attributes:['id']});
      }
      else{
        var sourceData=await Source.findOne({where:{name:"Vendor"},attributes:['id']});
      }
    //  myCandidate.isExternal="YES";
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
        res.status(200).json({
          status: false,
          message: "Email id or Contact number is already in use",
        });
      } else {
        var cnd_data = await candidate.findOne({
          where: { mainId: req.mainId },
          order: [["candidateInt", "DESC"]],
        });
        var can_detail = await candidateDetails.findOne({
          where: { mobile: "91" + req.body.mobile, mainId: req.mainId },
        });
        if (cnd_data) {
          var candidateInt = Number(cnd_data.candidateInt) + 1;
          var candidateText = "CAN";
        } else {
          var candidateInt = 10001;
          var candidateText = "CAN";
        }
        var uniqueId = `${candidateText}${candidateInt}`;
        var myCandidate = {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobile: "91" + req.body.mobile,
          alternateMobile: "91" + req.body.alternateMobile,
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
          createdBy:req.recruiterId,
          isExternal:"YES",
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
        if (req.body.candidateProcessed == "NO") {
          myCandidate.reason = req.body.reason;
        }
      
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
                  hideContactDetails:req.body.hideContactDetails,
                 
                })
                .then(async (my_can) => {
                  await candidateStatus.create({
                    candidateId: my_can.dataValues.id,
                    createdBy: req.recruiterId,
                    mainId: req.mainId,
                    updatedBy: req.recruiterId,
                    statusCode: 301,
                  });
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
                    candidateDetailsId: user_data.dataValues.id,
                    candidate_mobile: user_data.mobile,
                  });
                });
            });
        } else {

          await candidateDetails
            .update({ where: { id: can_detail.id } }, myCandidate)
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
                  candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording,
                  
                })
                .then(async (my_can) => {
                  await candidateStatus.create({
                    candidateId: my_can.dataValues.id,
                    createdBy: req.recruiterId,
                    mainId: req.mainId,
                    updatedBy: req.recruiterId,
                    statusCode: 301,
                  });
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
      //myCandidate.isExternal="NO";
     
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
          res.status(200).json({
            status: false,
            message: "Email id or Contact number is already in use",
          });
        } else {
          var cnd_data = await candidate.findOne({
            where: { mainId: req.mainId },
            order: [["candidateInt", "DESC"]],
          });
          var can_detail = await candidateDetails.findOne({
            where: { mobile: "91" + req.body.mobile, mainId: req.mainId },
          });
          if (cnd_data) {
            var candidateInt = Number(cnd_data.candidateInt) + 1;
            var candidateText = "CAN";
          } else {
            var candidateInt = 10001;
            var candidateText = "CAN";
          }
          var uniqueId = `${candidateText}${candidateInt}`;
          var myCandidate = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile: "91" + req.body.mobile,
            alternateMobile: "91" + req.body.alternateMobile,
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
            createdBy:req.recruiterId,
            panNumber:req.body.panNumber,
            linkedInProfile:req.body.linkedInProfile,
            showAllDetails:req.body.showAllDetails,
            isExternal:"NO",
            education_gap:req.body.education_gap,
            reloaction_reason:req.body.reloaction_reason,
            offer_details:req.body.offer_details,
            career_gap:req.body.career_gap,
            document_check:req.body.document_check
          };
          if (req.body.candidateProcessed == "NO") {
            myCandidate.reason = req.body.reason;
          }
        
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
                    candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording,
                    
                  })
                  .then(async (my_can) => {
                    await candidateStatus.create({
                      candidateId: my_can.dataValues.id,
                      createdBy: req.recruiterId,
                      mainId: req.mainId,
                      updatedBy: req.recruiterId,
                      statusCode: 301,
                    });
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
                      candidateDetailsId: user_data.dataValues.id,
                      candidate_mobile: user_data.mobile,
                    });
                  });
              });
          } else {

            await candidateDetails
              .update({ where: { id: can_detail.id } }, myCandidate)
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
                    candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording,
                    
                  })
                  .then(async (my_can) => {
                    await candidateStatus.create({
                      candidateId: my_can.dataValues.id,
                      createdBy: req.recruiterId,
                      mainId: req.mainId,
                      updatedBy: req.recruiterId,
                      statusCode: 301,
                    });
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

exports.sendRequestToVendor=async(req,res)=>{
  try
  {
    var can_data=await candidate.findOne({where:{id:req.body.id},include:[candidateDetails,{model:recruiter,include:[user]}]});
    if(can_data.recruiter.user.roleName=='SUBVENDOR')
      {
        if(can_data.candidateDetail.detailsHandler.isMailSent==true)
          {
            var user_data=await recruiter.findOne({where:{userId:can_data.mainId}});
            //can_data.candidateDetail.detailsHandler.isMailSent=true;
            var mailData={
              company_name:user_data.firstName+" "+user_data.lastName,
              candidate_unique_number:can_data.uniqueId,
              vendor_name:can_data.recruiter.companyName
            }
            await mailFunction.sendcandidateShowDetails(mailData,can_data.recruiter.user.email);
            await candidateDetails.update(
              { detailsHandler: { isMailSent: true, token: "" } },
              { where: { id: can_data.candidateDetail.id } }
          );
            res.status(200).json({ message: "Mail Has Been Sent", status: true });
          }
          else
          {
            res.status(200).json({ message: "Mail Already Sent", status: false });
          }
      }
      else
      {
          res.status(200).json({ message: "Invalid Action", status: false });
      }
    //res.send(can_data);
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }

};

exports.editCandidate = async (req, res) => {
  console.log(req.body);
  try {
    var can_data = await candidate.findOne({
      where: { id: req.body.id },
      include: [
        {
          model: candidateDetails,
          attributes: ["email"],
        },
      ],
    });
    if (req.body.email) {
      var exists = await candidate.findOne({
        where: { requirementId: can_data.requirementId },
        include: [
          {
            model: candidateDetails,
            where: {
              [Op.or]: { email: req.body.email },
            },
          },
        ],
      });
      if (exists) {
        if (exists.id == can_data.id) {
          var can_email = false;
        } else {
          var can_email = true;
        }
      } else {
        var can_email = false;
      }
    } else {
      var can_email = false;
    }
    if (can_email == false) {
      var rec_data=await recruiter.findOne({where:{id:can_data.recruiterId}});
      var mycan = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        alternateMobile: "91" + req.body.alternateMobile,
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
      if (req.body.candidateProcessed == "NO") {
        mycan.reason = req.body.reason;
      }
      if (can_data) {
        await can_data
          .update({
            isAnswered: req.body.isAnswered,
            sourceId: req.body.sourceId,
            candidateRecruiterDiscussionRecording:req.body.candidateRecruiterDiscussionRecording,
            candidateSkillExplanationRecording:req.body.candidateSkillExplanationRecording,
            candidateMindsetAssessmentLink:req.body.candidateMindsetAssessmentLink,
            candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording,
            hideContactDetails:req.body.hideContactDetails
          })
          .then(async () => {
            await candidateDetails
              .update(mycan, { where: { id: can_data.candidateDetailId } })
              .then(() => {
                res.status(200).json({
                  status: true,
                  message: "Edited Successfully",
                  candidateDetailsId: can_data.candidateDetailId,
                  candidateId:req.body.id
                });
              });
          });
      } else {
        res.status(200).json({ status: false, message: "Invalid Data" });
      }
    } else {
      res.status(200).json({ status: false, message: "Email already exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.changeCaididateVisibility=async (req,res)=>{
  try
  {
  var can_data = await candidate.findOne({
    where: { id: req.body.id },
    include: [
      {
        model: candidateDetails,
        attributes: ["id"],
      },
    ],
  });
  var can_detail= await candidateDetails.findOne({where:{id:can_data.candidateDetail.id}})
  var rec_data=await recruiter.findOne({where:{id:can_data.recruiterId}});
  if(can_detail.showAllDetails==true)
    {
      can_detail.showAllDetails=false;
    }
    else
    {
      rec_data.recCreds=rec_data.recCreds+1
      can_detail.showAllDetails=true;
    }
    await can_detail.save();
    res.status(200).json({ status: true, message: "Done" });
  }
  catch(e)
  {
    console.log(e);
    res.status(200).json({ status: false, message: "Error" });
  }
};
exports.adminEditCandidate = async (req, res) => {
  console.log(req.body);
  try {
    var can_data = await candidate.findOne({
      where: { id: req.body.id },
      include: [
        {
          model: candidateDetails,
          attributes: ["email"],
        },
      ],
    });
    if (req.body.email) {
      var exists = await candidate.findOne({
        where: { requirementId: can_data.requirementId },
        include: [
          {
            model: candidateDetails,
            where: {
              [Op.or]: { email: req.body.email },
            },
          },
        ],
      });
      if (exists) {
        if (exists.id == can_data.id) {
          var can_email = false;
        } else {
          var can_email = true;
        }
      } else {
        var can_email = false;
      }
    } else {
      var can_email = false;
    }
    if (can_email == false) {
      if (can_data) {
        var mycan = {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          alternateMobile: "91" + req.body.alternateMobile,
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
        if (req.body.candidateProcessed == "NO") {
          mycan.reason = req.body.reason;
        }
        await can_data
          .update({
            isAnswered: req.body.isAnswered,
            sourceId: req.body.sourceId,
            invoiceValue: req.body.invoiceValue,
            invoicedDate: req.body.invoicedDate,
            joinedDate: req.body.joinedDate,
            candidateRecruiterDiscussionRecording:req.body.candidateRecruiterDiscussionRecording,
            candidateSkillExplanationRecording:req.body.candidateSkillExplanationRecording,
            candidateMindsetAssessmentLink:req.body.candidateMindsetAssessmentLink,
            candidateAndTechPannelDiscussionRecording:req.body.candidateAndTechPannelDiscussionRecording,
            hideContactDetails:req.body.hideContactDetails
          })
          .then(async () => {
            await candidateDetails
              .update(mycan, { where: { id: can_data.candidateDetailId } })
              .then(() => {
                res.status(200).json({
                  status: true,
                  message: "Edited Successfully",
                  candidateDetailsId: can_data.candidateDetailId,
                  candidateId:req.body.id
                });
              });
          });
      } else {
        res.status(200).json({ status: false, message: "Invalid Data" });
      }
    } else {
      res.status(200).json({ status: false, message: "Email already exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }

  /*
    if(can_data){
        var  email_exist= await candidate.findOne({where:{requirementId:can_data.requirementId},include:[
            {
            model:candidateDetails,
            where:{
                email:req.body.email
            }
        }
        ]});
        var mobile_exist= await candidate.findOne({where:{requirementId:can_data.requirementId},include:[
            {
            model:candidateDetails,
            where:{
                mobile:req.body.mobile
            }
        }
        ]});
    if((req.body.email!=can_data.email)||(req.body.mobile!=can_data.mobile)){
        console.log("in");
        if(email_exist){
            res.status(200).json({status:false,message:"Email already exist"});
        }
        else if(mobile_exist){
            res.status(200).json({status:false,message:"Mobile number already exist"});
        }
        else{
            console.log("inone");
            editObj={
                firstName:read.body.firstName,
                lastName:req.body.lastname,
                skills:req.body.skills.split(",")
            }
            if(req.body.email!=can_data.email){
                editObj.email=req.body.email;
            }
            if(req.body.mobile!=can_data.mobile){
                editObj.mobile=req.body.mobile;
            }
            await candidateDetails.update(editobj,{where:{id:can_data.candidateDetailId}});
            await can_data.update({isAnswered:req.body.isAnswered}); 
            res.status(200).json({status:true,message:"Edited successfully"});
        }
    }
    else{
        editObj={
            firstName:read.body.firstName,
            lastName:req.body.lastname
        }
        await candidateDetails.update(editobj,{where:{id:can_data.candidateDetailId}});
            await can_data.update({isAnswered:req.body.isAnswered}); 
            res.status(200).json({status:true,message:"Edited successfully"});
    }
   
}

else{
    res.status(200).json({status:false,message:"Invalid data"});
}
 */
};
//parent: error: missing FROM-clause entry for table "cadidateDetails"

exports.getAllCandidateStatus = async (req, res) => {
  candidateStatus
    .findAll({
      where: { candidateId: req.body.id, mainId: req.mainId },
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
exports.viewAllCanditates = async (req, res) => {
  try {
    if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
    var limit = 10;
    var mywhere = { mainId: req.mainId };
    reqWhere={};
    if (req.body.fromDate && req.body.toDate) {
      const fromDate = moment(req.body.fromDate).startOf("day").toISOString();
      const toDate = moment(req.body.toDate).endOf("day").toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate],
      };
    }
    if(req.body.requirementId){
      mywhere.requirementId=req.body.requirementId;
    }
    // if(req.body.clientId){
    //   reqWhere.clientId=req.body.clientId;
    // }
    if (req.body.search && req.body.search != "") {
      mywhere[Op.or] = [
        { uniqueId: req.body.search },
        {
          "$candidateDetail.firstName$": { [Op.iLike]: `%${req.body.search}%` },
        },
        {
          "$candidateDetail.lastName$": { [Op.iLike]: `%${req.body.search}%` },
        },
        { "$candidateDetail.mobile$": { [Op.iLike]: `%${req.body.search}%` } },
        { "$candidateDetail.email$": { [Op.iLike]: `%${req.body.search}%` } },
      ];
      mywhere["$candidateDetail.showAllDetails$"]=true;
    } else if (req.body.year) {
      mywhere.createdAt = Sequelize.literal(
        `extract(year from "candidate"."createdAt") = ${req.body.year}`
      );
    }
    if (req.body.recruiterId) {
      mywhere.recruiterId = req.body.recruiterId;
    }
    console.log(mywhere);
    if (req.body.fileDownload) {
      await candidate
        .findAll({
          distinct: true,
          include: [
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
                "showAllDetails"
              ],
              required: true,
            },
            {model:Source,attributes:['name','status']},
            
            {
              model: requirement,
              attributes: ["requirementName", "uniqueId","clientId"],
              //where:reqWhere,
              include: [
                {
                  model: statusCode,
                  attributes: ["statusName"],
                },
                {
                  model: client,
                  attributes: ["clientName",'id'],
                  include: [{ model: statusCode, attributes: ["statusName"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                  { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
                },
                {
                  model: recruiter,
                  attributes: ["firstName", "lastName"],
                },
              ],
            },
            {
              model: statusCode,
              attributes: ["statusName","statusCode"],
            },  
            {
              model: recruiter,
              attributes: ["firstName", "lastName"],
            },
          ],
          where: mywhere,
          order: [["createdAt", "DESC"]],
        })
        .then(async (datas) => {
          const xldata = await datas.map((data, index) => {
            return {
              S_no: index + 1,
              RequirementName:
                data.requirement.requirementName +
                "(" +
                data.requirement.uniqueId +
                ")",
              CCName:
                data.requirement.recruiter.firstName +
                " " +
                data.requirement.recruiter.lastName,
              RecruiterName:
                data.recruiter.firstName + " " + data.recruiter.lastName,
              CandidateName:
                data.candidateDetail.firstName +
                " " +
                data.candidateDetail.lastName +
                "(" +
                data.uniqueId +
                ")",
              Email: data.candidateDetail.email,
              Mobile: data.candidateDetail.mobile,
              gender: data.candidateDetail.gender,
              currentLocation: data.candidateDetail.currentLocation,
              preferredLocation: data.candidateDetail.preferredLocation,
              nativeLocation: data.candidateDetail.nativeLocation,
              experience: data.candidateDetail.experience,
              relevantExperience: data.candidateDetail.relevantExperience,
              currentCtc: data.candidateDetail.currentCtc,
              expectedCtc: data.candidateDetail.expectedCtc,
              dob: data.candidateDetail.dob,
              noticePeriod: data.candidateDetail.noticePeriod,
              reasonForJobChange: data.candidateDetail.reasonForJobChange,
              candidateProcessed: data.candidateDetail.candidateProcessed,
              differentlyAbled: data.candidateDetail.differentlyAbled,
              educationalQualification:
              data.candidateDetail.educationalQualification,
              created: moment(data.createdAt).format("DD-MM-YYYY"),
            };
          });
          res.status(200).json({ status: true, data: xldata });
        });
    } else {
      var bucketUrl = process.env.liveUrl;
      await candidate        
        .findAndCountAll({
          distinct: true,
          attributes:{exclude:['candidateInt','candidateText']},
          include: [
            {
              model: candidateNote,
              required: false,
              attributes: [
                "id"
              ],
              where: {
                status: 'DELIVERED',
                recruiterId:{[Op.ne]:req.recruiterId}
              }
            },
            {
              model: candidateDetails,
              required: true,
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
                "showAllDetails",
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
            {model:Source,attributes:['name','status']},
            {
              model: candidateStatus,
              attributes:['statusCode'],
              include: [{ model: statusCode, attributes: ["statusName","statusCode"] }],
            },
            {
              model: requirement,
              attributes: ["requirementName", "uniqueId","cvShareValue","cvJoinValue","cvInterviewDoneValue","joinedSharePercentage"],
              //where:reqWhere,
              include: [
                {
                  model: statusCode,
                  attributes: ["statusName","statusCode"],
                },
                {
                  model: client,
                  attributes: ["clientName"],
                  include: [{ model: statusCode, attributes: ["statusName"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                  { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
                },
                {
                  model: recruiter,
                  attributes: ["firstName", "lastName", "mobile"],
                },
              ],
            },
            {
              model: statusCode,
              
              attributes: ["statusName","statusCode"],
            },
            {
              model: recruiter,
              attributes: ["firstName", "lastName", "mobile"],
              include:[{model:user,attributes:["roleName"]}]
            },
          ],
          where: mywhere,
          limit: limit,
          offset: page * limit - limit,
          order: [["createdAt", "DESC"]],
        })
        .then(async (data) => {
          if (data) {
      
          console.log("in");
              // Check if `candidateDetail` exists and `showAllDetails` is false
              if(req.roleName!="SUBVENDOR")
                {
              data.rows.forEach(candidate => {
            // Check if `candidateDetail` exists and `showAllDetails` is false
            if (candidate.candidateDetail && candidate.recruiter.user.roleName=="SUBVENDOR" && (!candidate.candidateDetail.showAllDetails || candidate.candidateDetail.showAllDetails == null)) {
              const attributesToRemove = ['firstName', 'lastName', 'mobile', 'email','alternateMobile'];
              attributesToRemove.forEach(attr => {
                candidate.candidateDetail[attr] = 'x'.repeat(candidate.candidateDetail[attr].length);;
              });
            }
          });
        }
            res
              .status(200)
              .json({ data: data.rows, count: data.count, status: true });
          } else {
            res.status(200).json({ data: [], count: 0, status: false });
          }
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({ status: false, message: "ERROR" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

// exports.sendShareCreds=async(req,res)=>{
//     var can_data=await candidate.findOne({where:{id:req.body.id},attributes:['recruiterId','id'],include:[{model:requirement,attributes:['cvShareValue','id']}]});
//     var rec_data=await candidate.findOne({where:{id:can_data.recruiterId}});
//     await rec_data.recCreds=can_data.requirement.id
// };

exports.viewCandidate = async (req, res) => {
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
          'hideContactDetails',
          'recruiterId',
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
              'panNumber',
              'linkedInProfile',
              'showAllDetails',
              'detailsHandler',
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
              ],
            'education_gap',
            'reloaction_reason',
            'offer_details',
            'career_gap',
            'document_check'
            ],
          },
          {
            model: statusCode,
            attributes: ["statusCode", "statusName"],
          },
          {
            model: requirement,
            attributes: ["id", "requirementName", "uniqueId", "experience","cvShareValue","cvJoinValue","cvInterviewDoneValue",'isSendCpv',"joinedSharePercentage"],
            include: [
              {
                model: client,
                attributes: ["clientName", "uniqueId"],
                include: [
                  {
                    model: statusCode,
                    attributes: ["statusCode", "statusName"],
                  },
                  { model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
          { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }
                ],
              },
              {
                model: recruiter,
                attributes: ["firstName", "lastName"],
                include:[{model:user,attributes:["roleName"]}]
              },
            ],
            
          },
          {
            model: recruiter,
            attributes: ["firstName", "lastName"],
            include:[{model:user,attributes:["roleName"]}]
          },
        ],
      })
      .then(async (data) => {
        if (data) {
          const chatuserdata = await chatUser.findOne({
            where: {
              phoneNumber: data.candidateDetail.mobile,
              mainId: data.mainId,
            },
          });
          if(req.roleName!="SUBVENDOR")
              {
          if (!data.candidateDetail.showAllDetails &&  data.recruiter.user.roleName=="SUBVENDOR") {
            const attributesToRemove = ['firstName', 'lastName', 'mobile', 'email','alternateMobile'];
             attributesToRemove.forEach(attr => {
              console.log(data.candidateDetail);
              data.candidateDetail[attr] = 'x'.repeat(data.candidateDetail[attr].length);
            });
            }
          }
          res
            .status(200)
            .json({ data: data, status: true, chatUser: chatuserdata });
        } else {
          res.status(200).json({ data: [], status: false });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};



exports.myCandidates = async (req, res) => {
  try {
    
    if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
    var limit = 10;
    mywhere = { mainId: req.mainId, recruiterId: req.recruiterId };

    if (req.body.fromDate && req.body.toDate) {
      const fromDate = moment(req.body.fromDate).startOf("day").toISOString();
      const toDate = moment(req.body.toDate).endOf("day").toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate],
      };
    }
    if (req.body.search && req.body.search != "") {
      mywhere[Op.or] = [
        { uniqueId: req.body.search },
        {
          "$candidateDetail.firstName$": { [Op.iLike]: `%${req.body.search}%` },
        },
        {
          "$candidateDetail.lastName$": { [Op.iLike]: `%${req.body.search}%` },
        },
        { "$candidateDetail.mobile$": { [Op.iLike]: `%${req.body.search}%` } },
        { "$candidateDetail.email$": { [Op.iLike]: `%${req.body.search}%` } },
      ];
      
    } else if (req.body.year) {
      mywhere.createdAt = Sequelize.literal(
        `extract(year from "candidate"."createdAt") = ${req.body.year}`
      );
    }
    if (req.body.candidate) {
      mywhere.uniqueId = req.body.candidate;
    }
    var can_detail_data = {
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
        "showAllDetails",
        'detailsHandler',
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
      required: true,
    };

    await candidate
      .findAndCountAll({
        distinct: true,
        attributes: { exclude: ["invoiceValue"] },
        include: [
          can_detail_data,
          {
            model: candidateNote,
            required: false,
            attributes: [
              "id"
            ],
            where: {
              status: 'DELIVERED',
              recruiterId:{[Op.ne]:req.recruiterId}
            }
          },
          Source,
          {
            model: candidateStatus,
            include: [{ model: statusCode, attributes: ["statusName","statusCode"] }],
          },

          {
            model: requirement,
            attributes: ["requirementName", "uniqueId","cvJoinValue","cvShareValue","cvInterviewDoneValue","joinedSharePercentage"],
            include: [
              {
                model: statusCode,
                attributes: ["statusName","statusCode"],
              },
              {
                model: client,
                attributes: ["clientName"],
                include: [{ model: statusCode, attributes: ["statusName","statusCode"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
              },
              {
                model: recruiter,
                attributes: ["firstName", "lastName", "mobile"],
              },
            ],
          },
          {
            model: statusCode,
            attributes: ["statusName","statusCode"],
          },
          {
            model: recruiter,
            attributes: ["firstName", "lastName", "mobile"],
            include:[{model:user,attributes:["roleName"]}]
          },
        ],
        order: [["createdAt", "DESC"]],
        where: mywhere,
        limit: limit,
        offset: page * limit - limit,
      })
      .then(async (data) => {
        if (data) {
          if(req.roleName!="SUBVENDOR")
              {
         data.rows.forEach(candidate => {
            // Check if `candidateDetail` exists and `showAllDetails` is false
            if (candidate.candidateDetail && candidate.recruiter.user.roleName=="SUBVENDOR" && (!candidate.candidateDetail.showAllDetails || candidate.candidateDetail.showAllDetails == null)) {
              const attributesToRemove = ['firstName', 'lastName', 'mobile', 'email','alternateMobile'];
              attributesToRemove.forEach(attr => {
                candidate.candidateDetail[attr] = 'x'.repeat(candidate.candidateDetail[attr].length);
              });
            }
          });
          }
          res
            .status(200)
            .json({ data: data.rows, count: data.count, status: true });
        } else {
          res.status(200).json({ data: [], count: 0, status: false });
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ status: false, message: "ERROR" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.candidateStatusCodeList = async (req, res) => {
  statusCode
    .findAll({
      where: { statusType: "CANDIDATE" },
      attributes: ["statusCode", "id", "status"],
    })
    .then((data) => {
      res.status(200).json({ status: true, data: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
};
exports.updateCrediNoteStatus = async (req, res) => {
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
          mainId: req.mainId,
          createBy: req.userId,
          updatedBy: req.userId,
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
exports.updateJoinedStatus = async (req, res) => {
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
          mainId: req.mainId,
          createBy: req.userId,
          updatedBy: req.userId,
        })
        .then(async () => {
          myNotificationObj = {
            candidate:
              can_data.candidateDetail.firstName +
              can_data.candidateDetail.lastName +
              "(" +
              can_data.uniqueId +
              ")",
            user: req.recruiterId,
            status: 309,
          };
          //await firebaseNotification.sendNotification(myNotificationObj);
          var rec_data=await recruiter.findOne({where:{id:can_data.recruiterId},include:[{model:user}]});
          console.log(rec_data);
          if(rec_data.user.roleName=="SUBVENDOR"&&can_data.isJoinedCredsSent==false)
          {
            var req_data=await requirement.findOne({where:{id:can_data.requirementId}});
            rec_data.recCreds=req_data.cvJoinValue+rec_data.recCreds;  
            can_data.isJoinedCredsSent=true;
            var record_data=await recCredsRecord.findOne({where:{vendorId:can_data.recruiterId,requirementId:can_data.requirementId,candidateId:can_data.id}});
            await recordsVaule.create({
              recCredsRecordId:record_data.id,
              reason:309,
              status:"TO-INVOICE",
              value:req_data.cvJoinValue
            });
            //console.log(result);
            await can_data.save();
            await rec_data.save();
          }
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

exports.updateOfferDeclineStatus = async (req, res) => {
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
          mainId: req.mainId,
          createBy: req.userId,
          updatedBy: req.userId,
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
exports.resetStatus = async (req, res) => {
  await candidate
    .findOne({ where: { id: req.body.id } })
    .then(async (data) => {
      if (data.statusCode != 301) {
        if (data.statusCode == 307) {
          var data_307 = await candidateStatus.findOne({
            where: { candidateId: data.id, statusCode: 307 },
          });
          var data_306 = await candidateStatus.findOne({
            where: { candidateId: data.id, statusCode: 306 },
          });
          await candidateStatus.destroy({ where: { id: data_307.id } });
          await candidateStatus.destroy({ where: { id: data_306.id } });
          data.update({
            statusCode: 305,
          });
          res.status(200).json({ status: true, message: "Reset successfull!" });
        } else {
          can_status = await candidateStatus.findOne({
            where: { candidateId: data.id, statusCode: data.statusCode },
          });
          const perv_can_status = await candidateStatus.findOne({
            where: {
              candidateId: req.body.id,
              statusCode: { [Op.ne]: data.statusCode },
            },
            order: [["createdAt", "DESC"]],
          });
          data.update({
            statusCode: perv_can_status.statusCode,
          });
          await candidateStatus.destroy({ where: { id: can_status.id } });
          res.status(200).json({ status: true, message: "Reset successfull!" });
        }
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(200).json({ status: true, message: "Error" });
    });
};
exports.updateJoiningDitchedStatus = async (req, res) => {
  var can_data = await candidate.findOne({
    where: { id: req.body.candidateId, statusCode: { [Op.or]: [309, 3081] } },
  });
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
          mainId: req.mainId,
          createBy: req.userId,
          updatedBy: req.userId,
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
exports.updateInvoicedStatus = async (req, res) => {
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
            mainId: req.mainId,
            createBy: req.userId,
            updatedBy: req.userId,
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
exports.candidateProgress = async (req, res) => {
  candidateStatus
    .findAll({
      where: { candidateId: req.body.candidateId },
      include: [{ model: statusCode, attributes: ["statusName"] }],
    })
    .then((data) => {
      if (data.length !== 0) {
        res.status(200).json({ data: data, status: true });
      } else {
        res.status(200).json({ data: data, status: false });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error" });
    });
};

exports.candidateJoinedDate = async (req, res) => {
  candidateStatus
    .findOne({
      where: { candidateId: req.body.candidateId, statusCode: 309 },
      include: [{ model: statusCode, attributes: ["statusName"] }],
    })
    .then((data) => {
      res.status(200).json({ data: data, status: true });
    })
    .catch((e) => {
      res.status(500).json({ status: false, mesage: "Error" });
    });
};

exports.candidateInvoiceDate = async (req, res) => {
  candidateStatus
    .findOne({
      where: { candidateId: req.body.candidateId, statusCode: 312 },
      include: [{ model: statusCode, attributes: ["statusName"] }],
    })
    .then((data) => {
      res.status(200).json({ data: data, status: true });
    })
    .catch((e) => {
      res.status(500).json({ status: false, mesage: "Error" });
    });
};

exports.invoicedCandidates = async (req, res) => {
  var myquery = { statusCode: 312, mainId: req.mainId };

  if (req.body.fromDate && req.body.toDate) {
    const fromDate = moment(req.body.fromDate).startOf("day").toISOString();
    const toDate = moment(req.body.toDate).endOf("day").toISOString();
    myquery.createdAt = {
      [Op.between]: [fromDate, toDate],
    };
  }
  if (req.body.fileDownload) {
    await candidate
      .findAll({
        distinct: true,
        where: myquery,
        include: [
          {
            model: candidateDetails,
            attributes: ["firstName", "lastName", "email", "mobile", "skills"],
          },
          Source,
          {
            model: candidateStatus,
            include: [{ model: statusCode, attributes: ["statusName"] }],
          },

          {
            model: requirement,
            attributes: ["requirementName","cvShareValue","cvJoinValue"],
            include: [
              {
                model: statusCode,
                attributes: ["statusName"],
              },
              {
                model: client,
                attributes: ["clientName"],
                include: [{ model: statusCode, attributes: ["statusName"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
              },
              {
                model: recruiter,
                attributes: ["firstName", "lastName"],
              },
            ],
          },
          {
            model: statusCode,
            attributes: ["statusName"],
          },
          {
            model: recruiter,
            attributes: ["firstName", "lastName"],
          },
        ],
        order: [["createdAt", "DESC"]],
      })
      .then(async (datas) => {
        const xldata = await datas.map((data, index) => {
          return {
            S_no: index + 1,
            RequirementName: data.requirement.requirementName,
            CCName:
              data.requirement.recruiter.firstName +
              " " +
              data.requirement.recruiter.lastName,
            RecruiterName:
              data.recruiter.firstName + " " + data.recruiter.lastName,
            CandidateName:
              data.candidateDetail.firstName +
              " " +
              data.candidateDetail.lastName,
            Email: data.candidateDetail.email,
            Mobile: data.candidateDetail.mobile,
            invoicedDate: moment(data.invoicedDate).format("DD-MM-YYYY"),
            invoiceValue: data.invoiceValue,
            statusName: data.statusList.statusName,
            created: moment(data.createdAt).format("DD-MM-YYYY"),
          };
        });
        res.status(200).json({ status: true, data: xldata });
      });
  } else {
    var limit = 10;
    if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
    var user_dat = await user.findOne({ where: { id: req.userId } });

    candidate
      .findAndCountAll({
        distinct: true,
        where: myquery,
        include: [
          {
            model: candidateDetails,
          },
          {
            model: Source,
          },
          {
            model: requirement,
            attributes: ["requirementName", "id", "uniqueId","cvShareValue","cvJoinValue"],
            include: [
              { model: recruiter, attributes: ["firstName", "lastName", "id"] },
              { model: statusCode, attributes: ["statusName"] },
              {
                model: client,
                attributes: ["clientName", "id", "uniqueId"],
                include: [{ model: statusCode, attributes: ["statusName"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
              },
            ],
          },

          {
            model: statusCode,
            attributes: ["statusName"],
          },
          {
            model: recruiter,
            attributes: ["firstName", "lastName", "mobile"],
          },
          {
            model: candidateStatus,
            include: [{ model: statusCode, attributes: ["statusName"] }],
          },
        ],
        limit: limit,
        offset: page * limit - limit,
        order: [["createdAt", "DESC"]],
      })
      .then(async (data) => {
        res.status(200).json({ data: data, status: true });
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ status: false, mesage: "Error" });
      });
  }
};

async function onloadInvoice(mainId) {
  const settingdata = await recruiterSettings.findOne({
    where: { mainId: mainId },
    attributes: ["fromMonth"],
  });
  var yrSt = "0" + settingdata.fromMonth;
  var mydate = Number(yrSt) + 1;
  var dateArr = [yrSt];
  while (yrSt != mydate) {
    if (String(mydate).length === 1) {
      var newmydate = "0" + String(mydate);
      dateArr.push(newmydate);
    } else {
      dateArr.push(String(mydate));
    }
    if (mydate == 12) {
      mydate = 1;
    } else {
      mydate += 1;
    }
  }
  return dateArr;
}

exports.sendMonthTotal = async (req, res) => {
  try {
  var myMonthArr = await onloadInvoice(req.mainId);
  var Year = req.body.year;
  myArr=[];
  for (i = 0; i < myMonthArr.length; i++) {
    current_mywhere = {
      mainId: { [Op.eq]: req.mainId },
      statusCode: { [Op.eq]: 312 },
      createdAt: {
        [Op.and]: [
          Sequelize.literal(`extract(month from "invoicedDate") = ${myMonthArr[i]}`),
          Sequelize.literal(`extract(year from "invoicedDate") = ${Year}`),
        ],
      },
    };
    const total_data = await candidate.findAll({
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("invoiceValue")), "total"],
      ],
      where: current_mywhere,
    });
    if(total_data[0].dataValues.total!=null){
     var  total=total_data[0].dataValues.total;
    }
    else{
      var total=0;
    }
   myArr.push({
      status: true,
      data: total,
      year: Year,
      month: myMonthArr[i],
    });
    if (myMonthArr[i] == 12) {
      Year = Year + 1;
      }
  }
  res.status(200).json({status:true,data:myArr})
}
catch (e) {
  console.log(e);
  res.status(500).json({ status: false, mesage: "Error" });
}
};

exports.monthlyInvoiceData = async (req, res) => {
  try {
    const dateArr = await onloadInvoice(req.mainId);
    res.status(200).json({ status: true, dateArr: dateArr });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: false, mesage: "Error" });
  }
};
exports.getMonthlyData = async (req, res) => {
  var myMonthArr = await onloadInvoice(req.mainId);
  var Year = req.body.year;
  var Month = req.body.month;
  var changeYear = false;
  for (i = 0; i < myMonthArr.length; i++) {
    if (myMonthArr[i] == Month) {
      i = myMonthArr.length;
    } else if (myMonthArr[i] == 12) {
      changeYear = true;
      i = myMonthArr.length;
    }
  }
  if (changeYear == true) {
    Year = Year + 1;
  }
  myquery = {
    mainId: { [Op.eq]: req.mainId },
    statusCode: { [Op.eq]: 312 },
    createdAt: {
      [Op.and]: [
        Sequelize.literal(
          `extract(month from "candidate"."invoicedDate") = ${Month}`
        ),
        Sequelize.literal(
          `extract(year from "candidate"."invoicedDate") = ${Year}`
        ),
      ],
    },
  };

  candidate
    .findAndCountAll({
      distinct: true,
      where: myquery,
      include: [
        {
          model: candidateDetails,
        },
        {
          model: candidateStatus,
          include: [{ model: statusCode, attributes: ["statusName"] }],
        },
        {
          model: Source,
        },
        {
          model: requirement,
          attributes: ["requirementName", "id", "uniqueId","cvShareValue","cvJoinValue"],
          include: [
            { model: recruiter, attributes: ["firstName", "lastName", "id"] },
            { model: statusCode, attributes: ["statusName"] },
            {
              model: statusCode,
              attributes: ["statusName"],
            },
            {
              model: client,
              attributes: ["clientName", "id", "uniqueId"],
              include: [
                {
                  model: statusCode,
                  attributes: ["statusName"],
                },
                { model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
          { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }
              ],
            },
          ],
        },
        {
          model: statusCode,
          attributes: ["statusName"],
        },
        {
          model: recruiter,
          attributes: ["firstName", "lastName", "mobile"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
    .then(async (data) => {
      res
        .status(200)
        .json({ status: true, data: data, year: Year, month: Month });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error" });
    });
};
// https://prod.liveshare.vsengsaas.visualstudio.com/join?429BFE7419613878E48E87B9DC3F07A70EC0

exports.candidateReports = async (req, res) => {
  var limit = 10;
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  mywhere = { mainId: req.mainId };

  if (req.body.fromDate && req.body.toDate) {
    const fromDate = moment(req.body.fromDate).startOf("day").toISOString();
    const toDate = moment(req.body.toDate).endOf("day").toISOString();
    mywhere.createdAt = {
      [Op.between]: [fromDate, toDate],
    };
  } else if (req.body.year) {
    mywhere.createdAt = Sequelize.literal(
      `extract(year from "candidate"."createdAt") = ${req.body.year}`
    );
  }

  if (req.body.recruiterId) {
    mywhere.recruiterId = req.body.recruiterId;
  }
  if (req.body.candidate) {
    mywhere.uniqueId = req.body.cadidateId;
  }
  var can_detail_data = {
    model: candidateDetails,
  };

  candidate
    .findAndCountAll({
      distinct: true,
      where: mywhere,
      include: [
        can_detail_data,
        Source,
        {
          model: candidateStatus,
          include: [{ model: statusCode, attributes: ["statusName"] }],
        },

        {
          model: requirement,
          attributes: ["requirementName", "id", "uniqueId","cvShareValue","cvJoinValue"],
          include: [
            {
              model: statusCode,
              attributes: ["statusName"],
            },
            {
              model: client,
              attributes: ["clientName", "id", "uniqueId"],
              include: [{ model: statusCode, attributes: ["statusName"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
              { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
            },
            {
              model: recruiter,
              attributes: ["id", "mainId", "firstName", "lastName"],
            },
          ],
        },
        {
          model: statusCode,
          attributes: ["statusName"],
        },
        {
          model: recruiter,
          attributes: ["firstName", "lastName", "mobile"],
        },
      ],
      limit: limit,
      offset: page * limit - limit,
      order: [["createdAt", "DESC"]],
    })
    .then((data) => {
      res
        .status(200)
        .json({ status: true, data: data.rows, count: data.count });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "ERROR" });
    });
};
exports.getNewData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 301);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 301);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getStcData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 303);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 303);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getScheduleInterviewData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 3031);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 3031);
      res.status(200).json({       
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getInterviewScheduleData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 304);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 304);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getFISData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 3041);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 3041);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getFICData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 305);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 305);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getDCData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 306);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 306);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getSBSData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 307);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 307);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getOfferedData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 308);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 308);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getYTJData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 3081);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 3081);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.getJoinedData = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      var xldata = await csvDownload.csvDashboard(req, 309);
      res.status(200).json({ status: true, data: xldata });
    } else {
      const data = await dashboardreport.getData(req, 309);
      res.status(200).json({
        message: "Data Found",
        count: data.count,
        data: data.rows,
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.allCandidateList = async (req, res) => {
  try {
    candidate
      .findAll({
        include: [
          { model: candidateDetails, attributes: ["firstName", "lastName"] },
        ],
        attributes: ["id"],
      })
      .then((data) => {
        if (data) {
          res.status(200).json({ data: data, status: true });
        } else {
          res.status(200).json({ data: {}, status: false });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false });
  }
};
exports.dropCandidate = async (req, res) => {
  try {
    const { id } = req.body;
    var mywhere = {
      id: id,
      mainId: req.mainId,
      statusCode: { [Op.or]: [301, 303, 304, 3041, 305, 306, 307] },
    };
    candidate.findOne({ where: mywhere }).then((data) => {
      if (data) {
        Promise.all([
          data.update({ statusCode: 302,droppedReason:req.body.droppedReason }),
          candidateStatus.create({
            candidateId: id,
            statusCode: 302,
            mainId: req.mainId,
            createBy: req.userId,
            updatedBy: req.userId,
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
exports.updateStcStatus = async (req, res) => {
  try {
    const { id } = req.body;
    var mywhere = {
      id: id,
      mainId: req.mainId,
      statusCode: { [Op.or]: [301] },
    };
    candidate.findOne({ where: mywhere }).then((data) => {
      if (data) {
        Promise.all([
          data.update({ statusCode: 303}),
          candidateStatus.create({
            candidateId: id,
            statusCode: 303,
            mainId: req.mainId,
            createBy: req.userId,
            updatedBy: req.userId,
          }),
        ]).then(async() => {
          if(req.companyType=="COMPANY")
            {
              
              var rec_data=await recruiter.findOne({where:{id:data.recruiterId},include:[{model:user}]});
              console.log(rec_data);
              if(rec_data.user.roleName=="SUBVENDOR"&&data.isShareCredsSent==false)
              {
                var req_data=await requirement.findOne({where:{id:data.requirementId}});
                rec_data.recCreds=req_data.cvShareValue+rec_data.recCreds;
                await rec_data.save();
                data.isShareCredsSent=true;
                await data.save();
                var record_data=await recCredsRecord.create({
                  vendorId:data.recruiterId,
                  requirementId:data.requirementId,
                  candidateId:id,
                });
                await recordsVaule.create({
                  recCredsRecordId:record_data.id,
                  reason:303,
                  status:"TO-INVOICE",
                  value:req_data.cvShareValue
                });
              }
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
exports.getAllDropedCandidate = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDashboard(req, 302);
      res.status(200).json({ data: xdata, status: true });
    } else {
      if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
      var limit = 10;
      var mywhere = { mainId: req.mainId, statusCode: 302 };

      if (req.body.fromDate && req.body.toDate) {
        const fromDate = moment(req.body.fromDate).startOf("day").toISOString();
        const toDate = moment(req.body.toDate).endOf("day").toISOString();
        mywhere.createdAt = {
          [Op.between]: [fromDate, toDate],
        };
      } else if (req.body.year) {
        mywhere.createdAt = Sequelize.literal(
          `extract(year from "candidate"."createdAt") = ${req.body.year}`
        );
      }

      if (req.body.recruiterId) {
        mywhere.recruiterId = req.body.recruiterId;
      }

      await candidate
        .findAndCountAll({
          distinct: true,
          // attributes:[''],
          where: mywhere,
          include: [
            {
              model: candidateDetails,
            },
            Source,
            {
              model: candidateStatus,
              include: [{ model: statusCode, attributes: ["statusName"] }],
            },

            {
              model: requirement,
              attributes: ["requirementName", "id", "uniqueId"],
              include: [
                {
                  model: statusCode,
                  attributes: ["statusName"],
                },
                {
                  model: client,
                  attributes: ["clientName", "id", "uniqueId"],
                  include: [{ model: statusCode, attributes: ["statusName"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                  { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
                },
                {
                  model: recruiter,
                  attributes: ["id", "mainId", "firstName", "lastName"],
                },
              ],
            },
            {
              model: statusCode,
              attributes: ["statusName"],
            },
            {
              model: recruiter,
              attributes: ["firstName", "lastName", "mobile"],
            },
          ],
          limit: limit,
          offset: page * limit - limit,
          order: [["createdAt", "DESC"]],
        })
        .then((data) => {
          res.status(200).json({
            message: "Data Found",
            count: data.count,
            data: data.rows,
            status: true,
          });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.stcReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 303);
      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 303);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.scheduleInterviewReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 3031);
      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 3031);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.InterviewScheduledReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 304);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 304);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.FISReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 3041);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 3041);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.FICReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 305);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 305);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.DCReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 306);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 306);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.SBSReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 307);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 307);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.OfferedReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 308);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 308);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.YTJReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 3081);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 3081);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.JoinedReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 309);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 309);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.ODReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 310);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 310);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.InvoicedReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 312);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 312);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.CNReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 313);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 313);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.DitchedReport = async (req, res) => {
  try {
    if (req.body.fileDownload) {
      const xdata = await csvDownload.csvDownloadReports(req, 311);

      res.status(200).json({ data: xdata, status: true });
    } else {
      const data = await myReport.reportData(req, 311);
      res
        .status(200)
        .json({ data: data.rows, count: data.count, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.getReportCount = async (req, res) => {
  try{
  var myMonthArr = await onloadInvoice(req.mainId);
  var Year = req.body.year;
  var myArr=[];
  for (i = 0; i < myMonthArr.length; i++) {
    if(req.body.statusCode==309){
      myquery = {
        mainId: req.mainId,
        statusCode: req.body.statusCode,
        '$candidate.joinedDate$': {
          [Op.and]: [
            Sequelize.literal(
              `extract(month from "candidate"."joinedDate") = ${myMonthArr[i]}`
            ),
            Sequelize.literal(
              `extract(year from "candidate"."joinedDate") = ${Year}`
            ),
          ],
        },
      };
    } 
    else if(req.body.statusCode==312){
      myquery = {
        mainId: req.mainId,
        statusCode: req.body.statusCode,
        '$candidate.invoicedDate$': { // Replace with the correct column name
          [Op.and]: [
            Sequelize.literal(
              `extract(month from "candidate"."invoicedDate") = ${myMonthArr[i]}`
            ),
            Sequelize.literal(
              `extract(year from "candidate"."invoicedDate") = ${Year}`
            ),
          ],
        },
      };
    }
    else{
      myquery = {
        mainId: req.mainId,
        statusCode: req.body.statusCode,
        createdAt: {
          [Op.and]: [
            Sequelize.literal(
              `extract(month from "myCandidateStatus"."createdAt") = ${myMonthArr[i]}`
            ),
            Sequelize.literal(
              `extract(year from "myCandidateStatus"."createdAt") = ${Year}`
            ),
          ],
        },
      };
    }
    if(req.body.statusCode==312)
    {
    await candidateStatus
  .findAll({
    include: [{
      model: candidate,
      attributes: ['id', 'statusCode', 'invoiceValue', 'invoicedDate']
    }],
    where: myquery
  })
  .then((data) => {
    const totalInvoiceValue = data.reduce((sum, current) => sum + current.candidate.invoiceValue, 0);
    myArr.push({ count: data.length, month: myMonthArr[i], totalInvoiceValue: totalInvoiceValue });
  });
}
else{
  await candidateStatus
  .count({
    include: [{
      model: candidate,
    }],
    where: myquery
  })
  .then((data) => {
    
    myArr.push({ count: data, month: myMonthArr[i] });
  });
}
      if (myMonthArr[i] == 12) {
        Year = Year + 1;
      }
  }

  res.status(200).json({data:myArr,status:true}); 
}
catch(e)
{
  console.log(e);
  res.status(500).json({ message: "ERROR", status: false });
}
};

exports.getAllReportCount = async (req, res) => {
  var myMonthArr = await onloadInvoice(req.mainId);
  var Year = req.body.year;
  var Month = req.body.month;
  var changeYear = false;
  for (i = 0; i < myMonthArr.length; i++) {
    if (myMonthArr[i] == Month) {
      i = myMonthArr.length;
    } else if (myMonthArr[i] == 12) {
      changeYear = true;
      i = myMonthArr.length;
    }
  }
  if (changeYear == true) {
    Year = Year + 1;
  }
  myquery = {
    mainId: req.mainId,
    statusCode: req.body.statusCode,
    createdAt: {
      [Op.and]: [
        Sequelize.literal(
          `extract(month from "myCandidateStatus"."createdAt") = ${Month}`
        ),
        Sequelize.literal(
          `extract(year from "myCandidateStatus"."createdAt") = ${Year}`
        ),
      ],
    },
  };
  candidateStatus
    .count({ where: myquery })
    .then((data) => {
      res.status(200).json({ status: true, data: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "ERROR" });
    });
};

exports.singleCandidateSearch = async (req, res) => {
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
  var limit = 10;
  myWhere = { mainId: req.mainId };
  if (req.body.skills && req.body.skills != "") {
    myWhere[Op.and] = [];
    var skills = req.body.skills.split(",");
    if (skills.length > 0) {
      for (i = 0; i < skills.length; i++) {
        myWhere[Op.and].push({
          "$candidateDetail.skills$": { [Op.iLike]: `%${skills[i].trim()}%` },
        });
      }
    }
    await candidate
      .findAndCountAll({
        distinct: true,
        include: [
          {
            model: candidateDetails,
            attributes: ["firstName", "lastName", "email", "mobile", "skills",'isExternal','alternateMobile','showAllDetails','detailsHandler'],
            required: true,
          },
          Source,
          {
            model: candidateStatus,
            include: [{ model: statusCode, attributes: ["statusName"] }],
          },

          {
            model: requirement,
            attributes: ["requirementName", "uniqueId"],
            include: [
              {
                model: statusCode,
                attributes: ["statusName"],
              },
              {
                model: client,
                attributes: ["clientName"],
                include: [{ model: statusCode, attributes: ["statusName"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
              },
              {
                model: recruiter,
                attributes: ["firstName", "lastName", "mobile"],
              },
            ],
          },
          {
            model: statusCode,
            attributes: ["statusName"],
          },
          {
            model: recruiter,
            attributes: ["firstName", "lastName", "mobile"],
            include:[{model:user,attributes:["roleName"]}]
          },
        ],
        where: myWhere,
        limit: limit,
        offset: page * limit - limit,
      })
      .then((data) => {
        if (data) {
          data.rows.forEach(candidate => {
            // Check if `candidateDetail` exists and `showAllDetails` is false
            if (candidate.candidateDetail && candidate.recruiter.user.roleName=="SUBVENDOR" && (!candidate.candidateDetail.showAllDetails || candidate.candidateDetail.showAllDetails == null)) {
              const attributesToRemove = ['firstName', 'lastName', 'mobile', 'email','alternateMobile'];
              attributesToRemove.forEach(attr => {
                candidate.candidateDetail[attr] = 'x'.repeat(candidate.candidateDetail[attr].length);
              });
            }
          });
          res
            .status(200)
            .json({ data: data.rows, count: data.count, status: true });
        } else {
          res.status(200).json({ data: [], count: 0, status: false });
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ status: false, message: "ERROR" });
      });
  } else {
    res.status(200).json({ data: [], count: 0, status: true });
  }
};

exports.singleMyCandidateSearch = async (req, res) => {
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
  var limit = 10;
  var myWhere = { mainId: req.mainId, recruiterId: req.recruiterId };
  if (req.body.skills && req.body.skills != "") {
    myWhere[Op.and] = [];
    var skills = req.body.skills.split(",");
    if (skills.length > 0) {
      for (i = 0; i < skills.length; i++) {
        myWhere[Op.and].push({
          "$candidateDetail.skills$": { [Op.iLike]: `%${skills[i].trim()}%` },
        });
      }
    }
    const can_data = await candidate
      .findAndCountAll({
        distinct: true,
        include: [
          {
            model: candidateDetails,
            attributes: ["firstName", "lastName", "email", "mobile", "skills",'alternateMobile','showAllDetails','detailsHandler'],
            required: true,
          },
          Source,
          {
            model: candidateStatus,
            include: [{ model: statusCode, attributes: ["statusName"] }],
          },

          {
            model: requirement,
            attributes: ["requirementName", "uniqueId"],
            include: [
              {
                model: statusCode,
                attributes: ["statusName"],
              },
              {
                model: client,
                attributes: ["clientName"],
                include: [{ model: statusCode, attributes: ["statusName"] },{ model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
                { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }],
              },
              {
                model: recruiter,
                attributes: ["firstName", "lastName", "mobile"],
              },
            ],
          },
          {
            model: statusCode,
            attributes: ["statusName"],
          },
          {
            model: recruiter,
            attributes: ["firstName", "lastName", "mobile"],
            include:[{model:user,attributes:["roleName"]}]
          },
        ],
        where: myWhere,
        limit: limit,
        offset: page * limit - limit,
      })
      .then((data) => {
        if (data) {
          data.rows.forEach(candidate => {
            // Check if `candidateDetail` exists and `showAllDetails` is false
            if (candidate.candidateDetail && candidate.recruiter.user.roleName=="SUBVENDOR" && (!candidate.candidateDetail.showAllDetails || candidate.candidateDetail.showAllDetails == null)) {
              const attributesToRemove = ['firstName', 'lastName', 'mobile', 'email','alternateMobile'];
              attributesToRemove.forEach(attr => {
                candidate.candidateDetail[attr] = 'x'.repeat(candidate.candidateDetail[attr].length);
              });
            }
          });
          res
            .status(200)
            .json({ data: data.rows, count: data.count, status: true });
        } else {
          res.status(200).json({ data: [], count: 0, status: false });
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ status: false, message: "ERROR" });
      });
  } else {
    res.status(200).json({ data: [], count: 0, status: true });
  }
};

exports.candidateActivity = async (req, res) => {
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
  recruiterCandidateActivity
    .findAndCountAll({
      where: myWhere,
      include: [
        {
          model: candidate,
          attributes: ["id", "uniqueId"],
          include: [
            { model: candidateDetails, attributes: ["firstName", "lastName"] },
          ],
        },
        { model: requirement, attributes: ["requirementName", "uniqueId"] },
      ],
      limit: limit,
      offset: page * limit - limit,
      order: [["createdAt", "DESC"]],
    })
    .then(async (datas) => {
      if (req.body.fileDownload) {
        const xldata = await datas.map((data, index) => {
          return {
            S_no: index + 1,
            CandidateName:
              data.candidate.candidateDetail.firstName +
              " " +
              data.candidate.candidateDetail.lastName +
              "(" +
              data.candidate.uniqueId +
              ")",
            RequirementName:
              data.requirement.requirementName +
              "(" +
              data.requirement.uniqueId +
              ")",
            Mobile: data.candidate.candidateDetail.mobile,
            created: moment(data.createdAt).format("DD-MM-YYYY"),
          };
        });
        res.status(200).json({ data: xldata, status: true });
      } else {
        res
          .status(200)
          .json({ data: datas.rows, count: datas.count, status: true });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ message: "Error", status: false });
    });
};

async function candidateHistory(req, candidateId, mobile, requirementId) {
  var dateObj = new Date();
  mywhere = {
    // createdAt: {
    //   [Op.and]: [
    //     Sequelize.literal(
    //       `date_trunc('day', "createdAt") = '${dateObj
    //         .toISOString()
    //         .slice(0, 10)}'`
    //     ),
    //     Sequelize.literal(
    //       `extract(month from "createdAt") = ${dateObj.getMonth() + 1}`
    //     ),
    //     Sequelize.literal(
    //       `extract(year from "createdAt") = ${dateObj.getFullYear()}`
    //     ),
    //   ],
    // },
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
}

exports.uploadExistingCandidates=async(req,res)=>{
  try{
  const workbook = XLSX.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const transformedData = jsonData.slice(1).map(row => {
    if(row.length!=0)
      {
      return {
      firstName: row[1].split(" ")[0],
      lastName: row[1].split(" ")[1],
      email: row[2],
      mobile: row[3],
    };
    }
  });
  for(i=0;i<transformedData.length;i++){
    currentData=transformedData[i];
    if(currentData!=undefined)
    {

    
    mob=currentData.mobile.toString();
    var isExist=await candidateDetails.findOne({where:{mainId:req.mainId,[Op.or]:{mobile:mob,email:currentData.email}}});
    if(!isExist){
      await candidateDetails.create({mobile:mob,email:currentData.email,firstName:currentData.firstName,lastName:currentData.lastName,mainId:req.mainId,
        createdBy:req.recruiterId});
    }
    else
    {
      console.log("avoided");
    }
  }
  }
  deleteFolder(req.mainId);
  res.status(200).json({status:true});
  }
  catch(e){
    console.log(e);
    res.status(500).json({ message: "Error", status: false });
  }
};

exports.reuseCandidate=async(req,res)=>{
  candidateDetails.findOne({where:{id:req.body.id,mainId:req.mainId}}).then(data=>{
    res
    .status(200)
    .json({ data: data ,status: true });
  }) .catch((e) => {
    console.log(e);
    res.status(500).json({ message: "Error", status: false });
  });
};


exports.checkEmailExist=async(req,res)=>{
  const roleName=req.roleName;
  if(roleName=="FREELANCER"||roleName=="SUBVENDOR"){
    candidateDetails.findOne({where:{email:req.body.email,mainId:req.mainId}}).then(data=>{
      if(data){
        res.status(200).json({status:true,message:"Email Id  is already in use"});
      }
      else{
        res.status(200).json({status:false,message:"Email Id  not found"});
      }
    });
}
else{
  candidate.findOne({where:{requirementId:req.body.requirementId},
    include:[{model:candidateDetails,
      where: {
        email: req.body.email,
      },
  }]}).then(data=>{
    if(data){
      res.status(200).json({status:true,message:"Email Id is already in use"});
    }
    else{
      res.status(200).json({status:false,message:"Email Id  not found"});
    }
  });
}
};
exports.checkMobileExist = async (req, res) => {
  const roleName = req.roleName;

  // If the role is FREELANCER or SUBVENDOR
  if (roleName === "FREELANCER" || roleName === "SUBVENDOR") {
    candidateDetails.findOne({
      where: {
        mainId: req.mainId,
        [Op.or]: [
          { mobile: req.body.mobile },
          { mobile: "91" + req.body.mobile }
        ]
      }
    }).then(data => {
      if (data) {
        res.status(200).json({ status: true, message: "Duplicate Contact Number" });
      } else {
        res.status(200).json({ status: false, message: "Mobile Number not found" });
      }
    });
  } else {
    // For other roles
    candidate.findOne({
      where: { requirementId: req.body.requirementId },
      include: [{
        model: candidateDetails,
        where: {
          [Op.or]: [
            { mobile: req.body.mobile },
            { mobile: "91" + req.body.mobile }
          ]
        }
      }]
    }).then(data => {
      if (data) {
        res.status(200).json({ status: true, message: "Contact number is already in use" });
      } else {
        res.status(200).json({ status: false, message: "Mobile Number not found" });
      }
    });
  }
};


exports.sendCPVLink=async(req,res)=>{
  try{
    var myCandidate=await candidate.findOne({where:{id:req.body.candidateId},include:[{model:candidateDetails,attributes:['email','firstName','lastName']},{model:requirement,include:[{model:clients,attributes:['clientName']}]}]});
    var cpv_url = `${process.env.prodUrl}#/candidateCPV?candidateId=${req.body.candidateId}`; 
    var mailOptions = {
      from: '<no-reply@refo.app>',
      // to:"vishallegend7775@gmail.com",
      to: myCandidate.candidateDetail.email,
      template: "candidateCpv",
      subject: "Please Fill in the Cpv form!",
      context: {
          url: cpv_url,
          companyName:myCandidate.requirement.client.clientName,
          requirementName:myCandidate.requirement.requirementName,
          name:myCandidate.candidateDetail.firstName+" "+myCandidate.candidateDetail.lastName
      },
  };
email.transporter.sendMail(mailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  }
  else{
    await myCandidate.update({
      isCandidateCpv:true
    }); 
  }
});

res.status(200).json({ status: true, message: "Link has been sent to Candiate Successfully" });
  }
  catch(e){
    console.log(e);
    res.status(500).json({ message: "Error", status: false });
  }
};
exports.sendCV=async(req,res)=>{
  try{
    var isExist=await sendCv.findOne({where:{email:req.body.email,requirementId:req.body.requirementId,mainId:req.mainId}});
    if(!isExist){
    var req_data=await requirement.findOne({where:{id:req.body.requirementId}});
    var shareCv_url = `${process.env.prodUrl}v1/#/shortList?requirementId=${req_data.id}&requirementName=${req_data.requirementName}`; 
    var mailOptions = {
      from: '<no-reply@refo.app>',
      //to:"vishallegend7775@gmail.com",
      to: req.body.email,
      template: "shareCv",
      subject: "Requirement Details",
      context: {
          url: shareCv_url,  

      },
  };
  
email.transporter.sendMail(mailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  }
 
});
await sendCv.create({
  requirementId:req.body.requirementId,
  mobile:req.body.mobile,
  email:req.body.email,
  mainId:req.mainId
});

res.status(200).json({ status: true, message: "Link has been sent to Candiate Successfully" });
    }
    else{
      res.status(200).json({ status: false, message: "Link Already Sent" });
    }
  }
  catch(e){
    console.log(e);
    res.status(500).json({ message: "Error", status: false });
  }
};
exports.candidateCvLink=async(req,res)=>{
  try{
    var req_data=await requirement.findOne({where:{id:req.body.requirementId}});
    var shareCv_url = `${process.env.prodUrl}v1/#/shortList?requirementId=${req_data.id}&requirementName=${req_data.requirementName}`; 
      res.status(200).json({ status: true, link:shareCv_url });
    }
    catch(e){
      console.log(e);
      res.status(500).json({ message: "Error", status: false });
    }
}
exports.candiateCpvLink=async(req,res)=>{
  try{
  var myCandidate=await candidate.findOne({where:{id:req.body.candidateId},include:[{model:candidateDetails,attributes:['email','firstName','lastName']},{model:requirement,include:[{model:clients,attributes:['clientName']}]}]});
  var myname=myCandidate.candidateDetail.firstName+" "+myCandidate.candidateDetail.lastName;
  console.log(myCandidate);
  var cpv_url = `${process.env.prodUrl}#/candidateCPV?candidateId=${req.body.candidateId}`; 
    res.status(200).json({ status: true, link:cpv_url  });
  }
  catch(e){
    console.log(e);
    res.status(500).json({ message: "Error", status: false });
  }
}
exports.candidateCpvForm=async(req,res)=>{
  try{
  var myCandidate=await candidate.findOne({where:{id:req.body.candidateId}});
  if(myCandidate.isCandidateCpv==true){
    res.status(200).json({status:false,message:"Form Already Submitted!!"});
  }
  else{
    await candidateCpv.create({
      companyName:req.body.companyName,
      webSiteUrl:req.body.webSiteUrl,
      jobDescription:req.body.jobDescription,
      jobTitle:req.body.jobTitle,
      jobResponsibilities:req.body.jobResponsibilities,
      currentLocation:req.body.currentLocation,
      inProjectOrBench:req.body.inProjectOrBench,
      jobLocation:req.body.jobLocation,
      currentCompanyName:req.body.currentCompanyName,
      shiftTimings:req.body.shiftTimings,
      noticePeriod:req.body.noticePeriod,
      payrollOrContract:req.body.payrollOrContract,
      currentCtcAndTakeHome:req.body.currentCtcAndTakeHome,
      expectedCtcAndTakeHome:req.body.expectedCtcAndTakeHome,
      modeOfWork:req.body.modeOfWork,
      existingOfferDetails:req.body.existingOfferDetails,
      jobChangeReason:req.body.jobChangeReason,
      documentsAvailabilty:req.body.documentsAvailabilty
    }).then(async data=>{
      console.log(data);
      await myCandidate.update({
        candidateCpvId:data.dataValues.id,
        isCandidateCpv:true
      });
      console.log(data);
    });
    res.status(200).json({status:true,message:"Form Submitted!!"});
  }
  }
  catch(e){
    console.log(e);
    res.status(500).json({ message: "Error", status: false });
  }
};
exports.viewCpv=async(req,res)=>{
  candidate.findOne({where:{id:req.body.candidateId},include:[{model:candidateCpv}]}).then(data=>{
    console.log(data);
    res.status(200).json({data:data.candidateCpv,status:true});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({ message: "Error", status: false });
  });
};



exports.updateCandidateMindSetAssessment=async(req,res)=>{
  candidate
    .findOne({ where: { id: req.body.id } })
    .then(async (data) => {
      if (req.file) {
        await data.update({
          candidateMindsetAssessmentLink: "candidateAssessment" + "/" + req.file.key,
        });
        res.status(200).json({ status: true, message: "Candidate Mindset Assessment Added" });
      } else {
        res.status(200).json({ status: false, message: "No File Submitted" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error" });
    });
}; 



// exports.cadidateVerifiedCpv=(req,res)=>{
//   candidate.findOne({where:{candidateId:req.body.cadidateId},include:[candidateCpv]}).then(async data=>{

//   });
// };
//functions
function deleteFolder(folderPath) {
  const fs=require('fs')
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = folderPath + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolder(curPath); // Recursively delete subdirectories
      } else {
        fs.unlinkSync(curPath); // Delete files
      }
    });
    fs.rmdirSync(folderPath); // Delete the empty directory
    console.log('Folder deleted successfully.');
  } else {
    console.log('Folder does not exist.');
  }
};