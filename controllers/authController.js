//models
const user = require('../models/user');
const recruiter = require('../models/recruiter');
// const jobSeeker = require('../models/jobSeeker');
const statusList=require("../models/statusList");
const pricing=require("../models/pricing");
const recruiterTransaction=require("../models/recruiterTransaction");
const recruitersSettings = require("../models/recruiterSettings");
const recruiterWallet = require("../models/recruiterWallets");
const companyRegister=require("../models/companyRegister");
const clientTestimonials=require("../models/clientTestimonial"); 
const contactUs=require("../models/contactUs");
const assignedRequirements=require("../models/assignedRequirement")
const candidateDetails = require("../models/candidateDetail");
const requirement = require("../models/requirement");
const statusCode = require("../models/statusList");
const candidateStatus = require("../models/myCandidateStatus");
const orgRecruiter=require("../models/orgRecruiter");
const client=require("../models/client");
const Source=require("../models/source");
const email = require("../config/email.js");
const mailFunction=require("../functions/sendReplyMail");
require("dotenv").config();
//
//dependencies
const Sequelize = require("../db/db");
const fn = Sequelize.fn;
const XLSX = require('xlsx');
const bcrypt = require("bcrypt");
const { Op, col } = require("sequelize");
const JWT = require("jsonwebtoken"); 
const base64url=require("base64url");
const crypto=require("crypto"); 
const candidate = require('../models/candidate');
const clients = require('../models/client');
//

exports.login = async (req, res) => {
console.log(req.body);
    user.findOne({ where: { email: req.body.email } }).then(async data => {
        
        if (data&&data.isMsme==false) {
            if (data.roleName != "SUPERADMIN") {
                if (data.isActive == true) {
                    var valid = await bcrypt.compare(req.body.password, data.password);
                    if (valid) {
                        var user_data = await recruiter.findOne({ where: { userId: data.id } });
                        
                        if (user_data) {
                            var settings_data = await recruitersSettings.findOne({ where: { mainId: user_data.mainId} });
                            if (settings_data) {
                                if(data.roleName!="ADMIN"){ 
                                    var user_data_company = await recruiter.findOne({ where: { userId: data.mainId,mainId:data.mainId} });
                                    var admn=await user.findOne({ where: { id: user_data_company.userId} });
                                    var token = JWT.sign({ mainId:user_data.mainId,recruiterId:user_data.id,image:process.env.bucketUrl+settings_data.image,isCandidateResetEnable:settings_data.isCandidateResetEnable, isEnableEmail:settings_data.isEnableEmail,isEnableFree: settings_data.isEnableFree, isEnablePaid:settings_data.isEnablePaid,email: data.email, companyName: user_data_company.companyName, mobile: user_data.mobile, role: data.roleName, firstName: user_data.firstName, lastName: user_data.lastName, user_id: data.id,isMsme:data.isMsme,companyType: admn.companyType}, process.env.jwtKey,{expiresIn: '24h'});
                                }else{
                                    // if(user_data.firstLogin==true)
                                    //     {
                                    //         await mailFunction.sendFirstLoginMail(user_data,data);
                                    //         //await user_data.update({firstLogin:false});
                                    //     }
                                    console.log("in");
                                    var token = JWT.sign({ mainId:user_data.mainId,recruiterId:user_data.id,image:process.env.bucketUrl+settings_data.image,isCandidateResetEnable:settings_data.isCandidateResetEnable, isEnableEmail:settings_data.isEnableEmail,isEnableFree: settings_data.isEnableFree, isEnablePaid:settings_data.isEnablePaid,email: data.email, companyName: user_data.companyName, mobile: user_data.mobile, role: data.roleName, firstName: user_data.firstName, lastName: user_data.lastName, user_id: data.id,companyType: data.companyType }, process.env.jwtKey,{expiresIn: '24h'});
                                }
                               console.log(token);
                                res.status(200).json({ status: true, message: "User logged in successfully!", token: "Berar " + token })
                            } else {
                                res.status(200).json({ status: false, message: "User Inactive Please Contact Adminstration!!" });
                            }
                        }
                    }
                    else {
                        res.status(200).json({ status: false, message: "Password Mismatch!!" });
                    }
                }
                else {
                    res.status(200).json({ status: false, message: "User Inactive Please Contact Adminstration" });
                }
            }
            else {
                res.status(200).json({ status: false, message: "User Not Found" });
            }
        }

        else {
            res.status(200).json({ status: false, message: "User Not Found" });
        }
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: false, message: "ERROR" });
    });
};

exports.msmeLogin=async(req,res)=>{
    user.findOne({ where: { email: req.body.email } }).then(async data => {
        if (data) {
            if(data.isActive==true){
                if(data.isMsme==true){
                var valid = await bcrypt.compare(req.body.password, data.password);
                if (valid) {
                    var user_data = await recruiter.findOne({ where: { userId: data.id } });
                    if (user_data) {
                        var settings_data = await recruitersSettings.findOne({ where: { mainId: user_data.mainId} });
                        if (settings_data) {
                            if(data.roleName=="ADMIN"){ 
                                var token = JWT.sign({ mainId:user_data.mainId,recruiterId:user_data.id,image:process.env.bucketUrl+settings_data.image,isCandidateResetEnable:settings_data.isCandidateResetEnable, isEnableEmail:settings_data.isEnableEmail,isEnableFree: settings_data.isEnableFree, isEnablePaid:settings_data.isEnablePaid,email: data.email, companyName: user_data.companyName, mobile: user_data.mobile, role: data.roleName, firstName: user_data.firstName, lastName: user_data.lastName, user_id: data.id }, process.env.jwtKey,{expiresIn: '24h'});
                                res.status(200).json({ status: true, message: "User logged in successfully!", token: "Berar " + token })
                            }
                        } else {
                            res.status(200).json({ status: false, message: "User Inactive Please Contact Adminstration!!" });
                        }
                    }
                    else{
                        res.status(200).json({ status: false, message: "User Not Found" });
                    }
                }
                else{
                    res.status(200).json({ status: false, message: "Password Mismatch!!" });
                }
            }
            else{
                res.status(200).json({ status: false, message: "Not a Msme please use Recruiter Company Login!!" });
            }
            }
            else{
                res.status(200).json({ status: false, message: "User Inactive Please Contact Adminstration" });
            }
        }
        else{
            res.status(200).json({ status: false, message: "User Not Found" });
        }
    }).catch(e => {
        res.status(500).json({ status: false, message: "Error" });
    });
}
exports.getMyWallet = async (req, res) => {

    await recruiterWallet.findOne({ where: { mainId: req.mainId } }).then(data => {
        res.status(200).json({ status: true, data: data })
    }).catch(e => {
        res.status(500).json({ status: false, message: "Error" });
    });
};
exports.getWallet = async (req, res) => {

    await recruiterWallet.findOne({ where: { mainId: req.body.mainId } }).then(data => {
        res.status(200).json({ status: true, data: data })
    }).catch(e => {
        res.status(500).json({ status: false, message: "Error" });
    });
};

exports.superAdminlogin = async (req, res) => {

    user.findOne({ where: { email: req.body.email } }).then(async data => {
        if (data) {
            if (data.roleName == "SUPERADMIN") {
                var valid = await bcrypt.compare(req.body.password, data.password);
                if (valid) {
                    var token = JWT.sign({ email: data.email, role: data.roleName, user_id: data.id }, process.env.jwtKey,{expiresIn: '24h'});
                    res.status(200).json({ status: true, message: "User Logged In Successfully!", token: "Berar " + token })
                } else {
                    res.status(200).json({ status: false, message: "Invalid Password" });
                }
            }
            else {
                res.status(200).json({ status: false, message: "User Not Found" });
            }
        }
        else {
            res.status(200).json({ status: false, message: "User Not Found" });
        }
    }).catch(e => {

        res.status(500).json({ status: false, message: "ERROR" });
    });
};

exports.forgetPassword = async (req, res) => {
    user.findOne({ where: { email: req.body.email } ,include:[{model:recruiter,attributes:['firstName','lastName']}]}).then(async user_data => {
        if (user_data) {
            let token = base64url(crypto.randomBytes(20));
            await user_data.update({
                token: token
            }); 
            var verify_url = `${process.env.prodUrl}#/auth/forget/${token}`; 
            var mailOptions = {
                from: '<no-reply@refo.app>',
                //to:"vishallegend7775@gmail.com",
                 to: user_data.email,
                template: "reset-password",
                subject: "Please click link below to change password.",
                context: {
                    url: verify_url,
                    name: user_data.recruiter.firstName+" "+user_data.recruiter.lastName,
                },
            };
            email.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("SUccess");
                }
            });
            res.status(200).json({ status: true, message: "Link has been sent to mail" });
            //  please follow the link to change the password
        }
        else {
            res.status(200).json({ status: false, message: "User Not Found" });
        }
    })
};

exports.changePassword = async (req, res) => {

    user.findOne({ where: { token: req.body.token },include:[{model:recruiter,attributes:['firstName','lastName']}] }).then(async user_data => {
        if(user_data){
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const Hash = await bcrypt.hash(req.body.password, salt);
            await user_data.update({
                password: Hash,
                token: ""
            }).then(() => {
                mailFunction.passwordResetSuccess(user_data);
                res.status(200).json({ status: true, message: "Password Updated Successfully" });
            }).catch(e => {
                console.log(e);
                res.status(500).json({ status: false, message: "ERROR" });
            });
        }else{
            res.status(200).json({message:"Invalid Entry Token",status:false});
        }
        
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: false, message: "ERROR" });
    });
};

exports.getLogo = async (req, res) => {
    recruitersSettings.findOne({ where: { mainId: req.mainId } }).then(data => {
        if (data.image) {
            res.status(200).json({ status: true, image: process.env.liveUrl+data.image });
        }
        else {
            res.status(200).json({ status: false, message: "Image Not Found" });
        }
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: false, message: "Error" });
    });
};
exports.viewAllcompanyregisteration=async(req,res)=>{
    var page=req.body.page;
    var limit=50;
    companyRegister.findAndCountAll({attributes:['role','companyName','email','mobile','createdAt','isapproved','id'],  limit: limit,offset: page * limit - limit,
    order: [['createdAt', 'DESC']]}).then(data=>{
        res.status(200).json({status:true,data:data.rows,count:data.count})
    }).catch(e=>{
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }); 
};
exports.viewCompanyregisteration=async(req,res)=>{
    companyRegister.findOne({where:{id:req.body.id},include:[clientTestimonials]}).then(data=>{
        res.status(200).json({status:true,data:data})  
    }).catch(e=>{ 
        console.log(e); 
        res.status(500).json({status:false,message:"Error"});
    }); 
};
exports.comapnyApproved=async(req,res)=>{
    var myData=await companyRegister.findOne({where:{id:req.body.id}});
    var isExist=await user.findOne({where:{email:myData.email}});
    if(!isExist){
    var pass=myData.companyName+myData.foundedIn;
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const Hash = await bcrypt.hash(pass, salt);
    await user
    .create({
        email: myData.email,
        roleName: "ADMIN",
        password: Hash,
        isActive:true,
        isMsme:false
    })
    .then(async (data) => {
        var rec_data=await recruiter.create({
        userId: data.id,
        mainId: data.id,
        firstName: myData.ownerName.split(' ')[0],
        companyName: myData.companyName,
        mobile: myData.mobile,
        lastName: myData.ownerName.split(' ')[1]
        }).then(async rec_data=>{
            var addObj = {
                mainId: rec_data.mainId,
                recruiterId: rec_data.id,
                fromMonth: 4,
                toMonth: 3,
                isEnableFree: true,
                //isEnableEmail:req.body.isEnableEmail
              }
            await recruitersSettings.create(addObj);
        });
        await data.update({ mainId: data.id });
        await Source.create(
            {
                mainId: data.id,
                name:"Freelancer",
                uniqueId:"SOURCE10001",
                sourceText:"SOURCE",
                sourceInt:10001
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Vendor",
                uniqueId:"SOURCE10002",
                sourceText:"SOURCE",
                sourceInt:10002
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Naukri",
                uniqueId:"SOURCE10003",
                sourceText:"SOURCE",
                sourceInt:10003
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Monster",
                uniqueId:"SOURCE10004",
                sourceText:"SOURCE",
                sourceInt:10004
            });
            await Source.create(
            {
                mainId: data.id,
                name:"TimesJob",
                uniqueId:"SOURCE10005",
                sourceText:"SOURCE",
                sourceInt:10005
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Shine.com",
                uniqueId:"SOURCE10006",
                sourceText:"SOURCE",
                sourceInt:10006
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Indeed",
                uniqueId:"SOURCE10007",
                sourceText:"SOURCE",
                sourceInt:10007
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Linked In Free",
                uniqueId:"SOURCE10008",
                sourceText:"SOURCE",
                sourceInt:10008
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Linked In Recruiter License",
                uniqueId:"SOURCE10009",
                sourceText:"SOURCE",
                sourceInt:10009
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Linked In Spotlite",
                uniqueId:"SOURCE10010",
                sourceText:"SOURCE",
                sourceInt:10010
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Referral",
                uniqueId:"SOURCE10011",
                sourceText:"SOURCE",
                sourceInt:10011
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Job Posting",
                uniqueId:"SOURCE10012",
                sourceText:"SOURCE",
                sourceInt:10012
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Social Media Ad",
                uniqueId:"SOURCE10013",
                sourceText:"SOURCE",
                sourceInt:10013
            });
            await Source.create(
            {
                mainId: data.id,
                name:"Internal Database",
                uniqueId:"SOURCE10014",
                sourceText:"SOURCE",
                sourceInt:10014
            });
     await myData.update({
        isapproved:true
     });     
     mailFunction.sendApprovedRegistration(myData,pass);    
     res.status(200).json({status:true,message:"Done"});
    }).catch(e=>{
        console.log(e);
    });
}
else{
    res.status(200).json({status:false,message:"Email Already Exist Unalbe to Approve!!"});
}
};
exports.msmeApproved=async(req,res)=>{
   try{
    var myData=await companyRegister.findOne({where:{id:req.body.id}});
    var isExist=await user.findOne({where:{email:myData.email}});
    if(!isExist){
    var pass=myData.companyName+myData.foundedIn;
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const Hash = await bcrypt.hash(pass, salt);
    await user
    .create({
        email: myData.email,
        roleName: "ADMIN",
        password: Hash,
        isActive:true,
        isMsme:true
    })
    .then(async (data) => {
        await recruiter.create({
        userId: data.id, 
        mainId: data.id,
        firstName: myData.ownerName.split(' ')[0],
        companyName: myData.companyName,
        mobile: myData.mobile,
        lastName: myData.ownerName.split(' ')[1]
        })
        .then(async rec_data=>{
            var addObj = {
                mainId: rec_data.mainId,
                recruiterId: rec_data.id,
                fromMonth: 4,
                toMonth: 3,
                isEnableFree: true,
                //isEnableEmail:req.body.isEnableEmail
              }
            await recruitersSettings.create(addObj);
        });
        await data.update({ mainId: data.id });
        await Source.create(
        {
            mainId: data.id,
            name:"Freelancer",
            uniqueId:"SOURCE10001",
            sourceText:"SOURCE",
            sourceInt:10001
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Vendor",
            uniqueId:"SOURCE10002",
            sourceText:"SOURCE",
            sourceInt:10002
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Naukri",
            uniqueId:"SOURCE10003",
            sourceText:"SOURCE",
            sourceInt:10003
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Monster",
            uniqueId:"SOURCE10004",
            sourceText:"SOURCE",
            sourceInt:10004
        });
        await Source.create(
        {
            mainId: data.id,
            name:"TimesJob",
            uniqueId:"SOURCE10005",
            sourceText:"SOURCE",
            sourceInt:10005
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Shine.com",
            uniqueId:"SOURCE10006",
            sourceText:"SOURCE",
            sourceInt:10006
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Indeed",
            uniqueId:"SOURCE10007",
            sourceText:"SOURCE",
            sourceInt:10007
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Linked In Free",
            uniqueId:"SOURCE10008",
            sourceText:"SOURCE",
            sourceInt:10008
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Linked In Recruiter License",
            uniqueId:"SOURCE10009",
            sourceText:"SOURCE",
            sourceInt:10009
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Linked In Spotlite",
            uniqueId:"SOURCE10010",
            sourceText:"SOURCE",
            sourceInt:10010
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Referral",
            uniqueId:"SOURCE10011",
            sourceText:"SOURCE",
            sourceInt:10011
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Job Posting",
            uniqueId:"SOURCE10012",
            sourceText:"SOURCE",
            sourceInt:10012
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Social Media Ad",
            uniqueId:"SOURCE10013",
            sourceText:"SOURCE",
            sourceInt:10013
        });
        await Source.create(
        {
            mainId: data.id,
            name:"Internal Database",
            uniqueId:"SOURCE10014",
            sourceText:"SOURCE",
            sourceInt:10014
        });
        
        await myData.update({
            isapproved:true
        });      
    
        await addCredsFunction(data.id)
     mailFunction.sendApprovedRegistration(myData,pass);    
     res.status(200).json({status:true,message:"Done"});
    }).catch(e=>{
        console.log(e);
    });
}
    else{
        res.status(200).json({status:false,message:"Email Already Exist Unalbe to Approve!!"});
    }
   }
   catch(e){
    console.log(e);
   }
};
exports.companyregisteration=async(req,res)=>{
    console.log(req.body);
   //const checkuser_email = await user.findOne({ where: { [Op.or]: { email:req.body.email } } });
    const regs_email = await companyRegister.findOne({ where: { [Op.or]: { email:req.body.email } } });
    //const checkuser_mobile = await recruiter.findOne({ where: { [Op.or]: { mobile: req.body.mobile } } });
    const regs_mobile = await companyRegister.findOne({ where: { [Op.or]: { mobile: req.body.mobile } } });
    if ( (regs_email)) {
      res.status(200).json({ message: "Email Id Already Exits", status: false });
    }
    else if ((regs_mobile)) {
      res.status(200).json({ message: "Mobile Number Already Exits", status: false });
    }
    else{
        var myObj={
            companyName:req.body.companyName, 
            foundedIn:req.body.foundedIn,
            ownerName:req.body.firstName+" "+req.body.lastName,
            mobile:req.body.mobile,
            email:req.body.email,
            presentLocation:req.body.presentLocation,
            branches:req.body.branches,
            recruiterStrength:req.body.recruiterStrength,
            hiring_SDE:req.body.hiring_SDE, 
            clientList:req.body.clientList.join(','),
            recruiterCoreSkills:req.body.recruiterCoreSkills,
            minimumCadidatePlacementFee:req.body.minimumCadidatePlacementFee,
            contractStaffing:req.body.contractStaffing,
            minimumMarkup:req.body.minimumMarkup,
            profileSource:req.body.profileSource,
            using_ATS:req.body.using_ATS, 
            gst:req.body.gst,
            isapproved:false,
            hiringSupport:req.body.hiringSupport,
            countriesHiringSupport:req.body.countriesHiringSupport,
            role:"RECRUITEMENT"
        };
        companyRegister.create(myObj).then(async data=>{
            var myClientTestimonial=req.body.clientTestimonial;
            for (i=0;i<myClientTestimonial.length;i++){
                await clientTestimonials.create({
                    description:myClientTestimonial[i].testimonials,
                    companyRegisterId:data.dataValues.id
                });
            }
    mailFunction.resgistrationConformation(req);
              res.status(200).json({status:true,message:"Registered Successfully"});
    })
}
};
exports.MSMECompanyRegisteration=async(req,res)=>{
    console.log(req.body);
   //const checkuser_email = await user.findOne({ where: { [Op.or]: { email:req.body.email } } });
    const regs_email = await companyRegister.findOne({ where: { [Op.or]: { email:req.body.email } } });
    //const checkuser_mobile = await recruiter.findOne({ where: { [Op.or]: { mobile: req.body.mobile } } });
    const regs_mobile = await companyRegister.findOne({ where: { [Op.or]: { mobile:"91"+req.body.mobile } } });
    if ( (regs_email)) {
      res.status(200).json({ message: "Email Id Already Exits", status: false });
    }
    else if ((regs_mobile)) {
      res.status(200).json({ message: "Mobile Number Already Exits", status: false });
    }
    else{
        var myObj={
            companyName:req.body.companyName,
            foundedIn:req.body.foundedIn,
            ownerName:req.body.firstName+" "+req.body.lastName,
            mobile:req.body.mobile,
            email:req.body.email,
            recruiterStrength:req.body.recruiterStrength,
            using_ATS:req.body.using_ATS, 
            gst:req.body.gst,
            isapproved:false,
            hiringSupport:req.body.hiringSupport,
            role:"MSME"
        };
        companyRegister.create(myObj).then(async data=>{
            mailFunction.MsmeResgistrationConformation(req);
            res.status(200).json({status:true,message:"Registered Successfully"});
    });
    }
};



exports.addHiringSupport=async(req,res)=>{
    hiringSupport.create({
        title:req.body.title,
        description:req.body.description
    }).then(()=>{
        res.status(200).json({status:true,message:"Added Successfully"});
    }).catch(e=>{
        res.status(500).json({status:false,message:"Error"});
    });
};

// exports.editHiringSupport=async(req,res)=>{
//     hiringSupport.findOne({where:{id:req.body.id}}).then(async data=>{
//         data.update({
//             title:req.body.title,
//             description:req.body.description
//         });
//     }).catch(e=>{
//         res.status(500).json({status:false,message:"Error"});
//     });
// };



exports.contactSales=async(req,res)=>{
    var isExist=await contactUs.findOne({where:{[Op.or]:{email:req.body.email,mobile:req.body.mobile},context:"Contact Sales"}});
    if(isExist){
        res.status(200).json({status:true,message:"Request has already been submitted our team will respond as soon as possible!"});
    }
    else{
        await contactUs.create({
            email:req.body.email,
            mobile:req.body.mobile,
            message:req.body.message,
            context:"Contact Sales",
            companyName:req.body.companyName
        });
        mailFunction.salesContactIntimation(req);
        res.status(200).json({status:true,message:"Request has already been submitted our team will respond as soon as possible!"});
    }
};
exports.contactDemo=async(req,res)=>{
    var isExist=await contactUs.findOne({where:{[Op.or]:{email:req.body.email,mobile:req.body.mobile},context:"Request Demo"}});
    if(isExist){
        res.status(200).json({status:true,message:"Request has already been submitted our team will respond as soon as possible!"});
    }
    else{
        await contactUs.create({
            email:req.body.email,
            mobile:req.body.mobile,
            message:req.body.message,
            context:"Request Demo",
            companyName:req.body.companyName
        });
        mailFunction.requestDemoIntimation(req);
        res.status(200).json({status:true,message:"Request has already been submitted our team will respond as soon as possible!"});
    }
};

exports.viewAllRequests=async(req,res)=>{
    var page=req.body.page;
    var limit=50;
    contactUs.findAndCountAll({offset: page * limit - limit,  limit: limit,
        order: [['createdAt', 'DESC']]}).then(data=>{
            res.status(200).json({status:true,data:data.rows,count:data.count});
    }).catch(e=>{
        res.status(500).json({status:false,message:"Error"});
    });
};
exports.viewRequest=async(req,res)=>{
    contactUs.findOne({where:{id:req.body.id}}).then(data=>{
            res.status(200).json({status:true,data:data});
    }).catch(e=>{
        res.status(500).json({status:false,message:"Error"});
    });
};

exports.inviteMsme=async(req,res)=>{
    try{
        var msmeReg_url = `${process.env.prodUrl}/v1/#/companyRegister`; 
        var mailOptions = {
          from: '<no-reply@refo.app>',
        //   to:"vishallegend7775@gmail.com",
          to: req.body.email,
          template: "msmeInvitation",
          subject: "You have been invited to user refo!",
          context: {
              url: msmeReg_url,
          },
      };
      email.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
      });
      res.status(200).json({ status: true, message: "Link has been sent  Successfully" });
        }
        catch(e){
          console.log(e);
          res.status(500).json({ message: "Error", status: false });
        }
};

exports.msmeSearchCompany=async(req,res)=>{
    console.log(req.body);
    user.findOne({where:{email:req.body.email,roleName:"ADMIN",isMsme:false},include:[recruiter]}).then(data=>{
        if(data){
            res.status(200).json({status:true,data:data});
        }
        else{
            res.status(200).json({status:false,message:"Not Found"});
        }
    }).catch(e=>{
        console.log(e)
        res.status(500).json({status:false,message:"Error"});
    });
};

exports.externalViewRequirementsCandidate=async(req,res)=>{
    console.log(req.body);
    var limit=50;
    var page=req.body.page;
    candidate.findAndCountAll({
        distinct: true,
        attributes:{exclude:['mainId','candidateInt','candidateText']},
        include: [
          {
            model: candidateDetails,
            required: true,
            attributes: [
                "id",
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
            include: [{ model: statusCode, attributes: ["id","statusName","statusCode"] }],
          },

          {
            model: requirement,
            attributes: ["id","requirementName", "uniqueId"],
            include: [
              {
                model: statusCode,
                attributes: ["id","statusName","statusCode"],
              },
              {
                model: clients,
                attributes: ["clientName"],
                include: [{ model: statusCode, attributes: ["statusName"] }],
              },
              {
                model: recruiter,
                attributes: ["id","firstName", "lastName", "mobile","companyName"],
              },
            ],
          },
          {
            model: statusCode,
            attributes: ["statusName","statusCode"],
          },
          {
            model: recruiter,
            attributes: ["id","firstName", "lastName", "mobile","companyName"],
          },
        ],
        where: {requirementId:req.body.requirementId},
        limit: limit,
        offset: page * limit - limit,
        order: [["createdAt", "DESC"]],
      }).then(async Mydata=>{
    
    var req_data=await requirement.findOne({where:{id:req.body.requirementId},include:[{model:recruiter,include:[user]}]});
    console.log(req_data);
    var user_data=req_data.recruiter;
    var data=req_data.recruiter.user;
    var settings_data = await recruitersSettings.findOne({ where: { mainId:req_data.mainId } });
    var token = JWT.sign({ recruiterId:user_data.id,isCandidateResetEnable:settings_data.isCandidateResetEnable,isEnableFree: settings_data.isEnableFree, isEnablePaid:settings_data.isEnablePaid,email: data.email, companyName: user_data.companyName, mobile: user_data.mobile, role: data.roleName, firstName: user_data.firstName, lastName: user_data.lastName, user_id: data.id,isMsme:data.isMsme } ,process.env.jwtKey,{expiresIn: '24h'});
        res.status(200).json({data:Mydata.rows,count:Mydata.count,status:true,token:"Berar "+token});
    }).catch(e=>{
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    });
};

exports.viewRequirementOpen=async(req,res)=>{
    requirement
      .findOne({ where: { id: req.body.id },include:[
        {
          model:client,
          attributes:['clientName','uniqueId']
        },
        {
          model:orgRecruiter,
          attributes:['name']
        },
        {
          model:recruiter,
          attributes:['firstName','lastName']
        },
        {
          model:statusList,
          attributes:["statusName"]
        }
        
      ],attributes:[
        'requirementName',
        'skills',
        'experience',
        'jobLocation',
        'hideFromInternal',
        'gist',
        'clientId',
        'orgRecruiterId',
        'uniqueId',
        'id',
        'requirementJd',
        'modeOfWork',
        'specialHiring',
        [
          fn(
            "concat",
            process.env.liveUrl,
            col("requirementJd")
          ),
          "requirementJd",
        ],
      ]})
      .then(async (data) => {
        console.log(data);
        if (data) {
          res.status(200).json({ status: true, data:data});
        } else {
          res.status(200).json({ status: false });  
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ status: false, message: "Error" });
      });
}
//functions

async function addCredsFunction(mainId){
    const pricingDetails= await pricing.findOne({where:{uniqueId:"PLAN10002"}});
    const maxInt = await recruiterTransaction.findOne({
        where: { mainId: mainId },
        order: [["refInt", "DESC"]],
      });
    if (maxInt) {
        refInt = maxInt.refInt + 1;
        refTxt = "INV";
    } else {
        refInt = 10001;
        refTxt = "INV";
    } 
    const myRec=await recruiter.findOne({where:{mainId:mainId,userId:mainId}});

    var referenceNo = `${refTxt}${refInt}`;
    var basic_amount=pricingDetails.amount;
    var tax_perc=process.env.tax_perc;
    var gst_amount=Math.round(basic_amount*tax_perc)/100;
    var total_amount=parseFloat(basic_amount)+parseFloat(gst_amount); 
    var cgst=(gst_amount/2).toFixed(2);
    var sgst=cgst;
    recruiterTransaction.create({ 
        mainId:mainId,
        paymentTypes:"-", 
        pricingId:pricingDetails.id,
        recruiterId:myRec.id,  
        basicAmount:basic_amount,
        totalAmount:total_amount,
        gst:gst_amount,
        cgst:cgst,
        sgst:sgst,
        totalTaxPerc:process.env.tax_perc,
        refInt:refInt,
        refText:refTxt,
        referenceNo:referenceNo, 
        hsn_sac:process.env.hsn_sac,
        companyName:myRec.companyName,
        companyAddress:myRec.companyAddress,
        statusCode:502
    }).then(async(data)=>{
        var sum=0;
      
        const wallet =await recruiterWallet.findOne({where:{mainId:mainId}});
        
        if(wallet){
            var pending_data=await recruiterTransaction.findOne({where:{statusCode:501,mainId:mainId},include:[pricing]});
            if(pending_data){
                await recruiterTransaction.update({statusCode:502},{where:{id:pending_data.id}});
                var incrementVal=pricingDetails.numberOfMessages-pending_data.pricing.numberOfMessages;
                await wallet.increment({
                    totalMessages:incrementVal,
                    remainingMessages:incrementVal
                });
            }else{
                await wallet.increment({
                    totalMessages:pricingDetails.numberOfMessages,
                    remainingMessages:pricingDetails.numberOfMessages
                });
            }
        }
        else{
            await recruiterWallet.create({
                recruiterId:myRec.id,
                mainId:mainId,
                totalMessages:pricingDetails.numberOfMessages,
                remainingMessages:pricingDetails.numberOfMessages 
            });
        }  
        
    }).catch(e=>{ 
        console.log(e);
    });
    
};