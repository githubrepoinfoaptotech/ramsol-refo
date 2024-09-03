
const axios = require('axios');
require("dotenv").config();
const crypto = require('crypto');
const candidateDetails = require("../models/candidateDetail");
const candidate = require("../models/candidate");
const requirement = require("../models/requirement");
const resumeInfo = require("../models/resumeInfo");
const Sequelize = require("../db/db");
const fn = Sequelize.fn;
const { Op, col } = require("sequelize");
exports.resumePraser=async(req,res)=>{
    const apiUrl = process.env.AiUrl+'/api/AI/resume-parser';
    // console.log(req.body.extractedText);
    const postData = {
        resume: req.body.extractedText
      };
      
      // Example POST request
      axios.post(apiUrl, postData)
        .then(response => {
            if(response.data.status==true) 
            {
                res.status(200).json({ status: true, data: response.data,fileUrl:req.file.destination+req.file.filename });
            }
            else
            {
                res.status(200).json({ status: false, message: "Something wnet wrong!" });
            }
        })
        .catch(error => {
          res.status(200).json({ status: false, message: "Error" });
        });
};


exports.jdmatcher=async(req,res)=>{
    const apiUrl = process.env.AiUrl+'/api/AI/jd-matcher';
    const can_data= await candidate
      .findOne({
        where: { id: req.body.id },
         include: [
         {
            model: requirement,
            attributes: ["gist","id","requirementName"]
            },
            {
            model: candidateDetails,
            attributes: [ 
            [
                fn(
                  "concat",
                  process.env.liveUrl,
                  col("candidateDetail.resume")
                ),
                "resume",
            ]
                        ]
            }
               ]
         });
         console.log(can_data.candidateDetailId);
    if(req.body.requirementId){
    const requirementData= await requirement.findOne({ where:{id:req.body.requirementId}});
    const postData = {
        jd:requirementData.gist,
        id:can_data.candidateDetailId,
        mainId:can_data.mainId
        
      };
      axios.post(apiUrl, postData)
      .then(response => {
          if(response.data.status==true)
          {           
              res.status(200).json({ status: true, data: response.data.data,requirementId:req.body.requirementId,requirementName:requirementData.requirementName,filename:req.body.fileName});
              
          }
          else
          {
              res.status(200).json({ status: false, message: "Something went wrong!" });
          }
      })
      .catch(error => {
      console.log(error);
        res.status(200).json({ status: false, message: "Error" });
      });
    }
    else{
    const postData = {
        jd:can_data.requirement.gist,
        id:can_data.candidateDetailId,
        mainId:can_data.mainId
        
      };
      axios.post(apiUrl, postData)
      .then(response => {
          if(response.data.status==true)
          {
              res.status(200).json({ status: true, data: response.data.data,requirementId:can_data.requirement.id,requirementName:can_data.requirement.requirementName});
          }
          else
          {
              res.status(200).json({ status: false, message: "Something went wrong!" });
          }
      })
      .catch(error => {
      console.log(error);
        res.status(200).json({ status: false, message: "Error" });
      });
    }
   
      
};

exports.resume_jd_match=async(req,res)=>{
 const apiUrl = process.env.AiUrl+'/api/AI/resume_jd_match';
    const postData = {
        resumeText: req.body.extractedText,
        jd:req.body.jd
      };
    axios.post(apiUrl, postData)
      .then(response => {
          if(response.data.status==true)
          {
          if(req.body.fileName){
              res.status(200).json({ status: true, data: response.data.data,filename:req.body.fileName});
              }
              else{
              res.status(200).json({ status: true, data: response.data.data });
              }
          }
          else
          {
              res.status(200).json({ status: false, message: "Something went wrong!" });
          }
      })
      .catch(error => {
        res.status(200).json({ status: false, message: "Error" });
      });
};
exports.getCanididateResumeInfo=async(req,res)=>{
  myResumeInfo=await resumeInfo.findOne({where:{candidateDetailId:req.body.id}});
  if(myResumeInfo)
  {
    res.status(200).json({ status: true, data:myResumeInfo });
    
  }
  else{
   res.status(200).json({ status: false, message:"Resume Info not found" });
  }
}
exports.uploadResume=async(req,res)=>{
    console.log(req.file)
    const apiUrl = process.env.AiUrl+'/api/AI/saveResume';
    const postData = {
        resumeText: req.body.extractedText,
        id:req.body.id,
        mainId:req.mainId
      };
    axios.post(apiUrl, postData)
      .then(async response => {
          if(response.data.status==true)
          
          {
              try {
               
              console.log(response.data);
              theResumeInfo={}
              theResumeInfo.name=response.data.resumeInfo.name;
              theResumeInfo.mail=response.data.resumeInfo.mail;
              theResumeInfo.mobile=response.data.resumeInfo.mobile;
              theResumeInfo.date_of_birth=response.data.resumeInfo.date_of_birth;
              theResumeInfo.address=response.data.resumeInfo.address;
              theResumeInfo.current_location=response.data.resumeInfo.current_location;
              theResumeInfo.linkedIn_profile_link=response.data.resumeInfo.linkedIn_profile_link;
              theResumeInfo.career_objective_profile_summary=response.data.resumeInfo.career_objective_profile_summary;
              if (response.data.resumeInfo.projects !== '' && response.data.resumeInfo.projects.length !== 0) {
                theResumeInfo.projects=response.data.resumeInfo.projects;
              }
              else
              {
                theResumeInfo.projects=[]
              }
              
              if (response.data.resumeInfo.education_qualification !== '' && response.data.resumeInfo.education_qualification.length !== 0) {
                theResumeInfo.education_qualification=response.data.resumeInfo.education_qualification;
              }
              else
              {
                theResumeInfo.education_qualification=[]
              }
              
              if (response.data.resumeInfo.work_experience !== '' && response.data.resumeInfo.work_experience.length !== 0) {
                theResumeInfo.work_experience=response.data.resumeInfo.work_experience;
              }
              else
              {
                theResumeInfo.work_experience=[]
              }
              
              if (response.data.resumeInfo.skills !== '' && response.data.resumeInfo.skills.length !== 0) {
                theResumeInfo.skills=response.data.resumeInfo.skills;
              }
              else
              {
                theResumeInfo.skills=[]
              }
              
              if (response.data.resumeInfo.achievements !== '' && response.data.resumeInfo.achievements.length !== 0) {
                theResumeInfo.achievements=response.data.resumeInfo.achievements;
              }
              else
              {
                theResumeInfo.achievements=[]
              }
              
              if (response.data.resumeInfo.certifications !== '' && response.data.resumeInfo.certifications.length !== 0) {
                theResumeInfo.certifications=response.data.resumeInfo.certifications;
              }
              else
              {
                theResumeInfo.certifications=[]
              }
              
              if (response.data.resumeInfo.languages_known !== '' && response.data.resumeInfo.languages_known.length !== 0) {
                theResumeInfo.languages_known=response.data.resumeInfo.languages_known;
              }
              else
              {
                theResumeInfo.languages_known=[]
              }
              
              myResumeInfo=await resumeInfo.findOne({where:{candidateDetailId:req.body.id}});
              if (myResumeInfo)
              {
                await resumeInfo.update(theResumeInfo, {
                  where: { candidateDetailId: req.body.id }
                });
               res.status(200).json({ status: true, message:"Uploaded" });
              }
              else
              {
                theResumeInfo.candidateDetailId=req.body.id;
                await resumeInfo
               .create(theResumeInfo);
               res.status(200).json({ status: true, message:"Uploaded" });
              }
              } catch (error) {
                  console.log(error);
                  res.status(200).json({ status: false, message: "Error" });
              }
              
              
          }
          else
          {
              res.status(200).json({ status: false, message: "Something went wrong!" });
          }
      })
      .catch(error => {
      console.log(error);
        res.status(200).json({ status: false, message: "Error" });
      });
    
};