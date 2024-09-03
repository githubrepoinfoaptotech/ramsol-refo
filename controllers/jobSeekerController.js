const user=require('../models/user');
const recruiter=require('../models/recruiter');
const jobSeeker=require('../models/jobSeeker');
const candidateDetails=require("../models/candidateDetails");
//
//dependencies
const bcrypt=require("bcrypt");
const JWT = require("jsonwebtoken");

//

exports.addDetails=async(req,res)=>{
    candidateDetails.findOne({where:{jobSeekerId:req.body.id}}).then(data=>{
        if(data){
            res.status(200).json({status:false,message:"Details Already Exist!!"});
        }
        else{
            candidateDetails.create({
                jobSeekerId:req.body.id,
                
            })
        }
    })
}

exports.jobSeekerRegister=async(req,res)=>{
    user.findOne({where:{email:req.body.email}}).then(async user_data=>{
        if(user_data){
            res.status(200).json({message:"Email Already Exist",status:false});
        }
        else{
            const salt =await bcrypt.genSalt(Number(process.env.SALT));
            const Hash=await bcrypt.hash(req.body.password,salt);
            const user_data= await user.create({
                email:req.body.email,
                firstName:req.body.firstname,
                lastName:req.body.lastname,
                roleName:"CANDIDATE",
                resume:"",
                password:Hash
            });
            jobSeeker.create({
                userId:user_data.id
            });
            res.status(200).json({status:true});
        }
    }).catch(e=>{
        console.log(e);
        res.status(500).json({message:"Error",status:false});
    });
};