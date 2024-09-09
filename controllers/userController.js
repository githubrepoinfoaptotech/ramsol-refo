const user = require("../models/user");
const bcrypt = require("bcrypt");
const recruiter = require("../models/recruiter");
const orgRecruiter = require("../models/orgRecruiter");
const recruitersSettings = require("../models/recruiterSettings");
const recCredsRecord=require("../models/recCredsRecords.js");
const requirement=require("../models/requirement");
const client = require("../models/client");
const moment = require("moment");
// const client=require('../models/client');
const { Op, where } = require("sequelize");
const { read } = require("fs");
const multer=require('multer');
var path=require('path');
const AWS = require("aws-sdk");
const multerS3 = require('multer-s3')
const Source = require("../models/source");
const role = require("../models/role");
const candidate = require("../models/candidate.js");
const candidateDetail = require("../models/candidateDetail.js");
const recordsVaule=require("../models/recordsVaule.js");
const fileUpload=require("../middlewares/fileUploadMulter.js");
const { required } = require("joi");
var maxSize = 2 * 1024 * 1024; // 10MB;
const s3 = new AWS.S3({
    accessKeyId: process.env.s3_id,
    secretAccessKey: process.env.s3_key,
  });
const Imageupload = multer({
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    // Check if the file size is too large
    if (file.size > maxSize) {
      return cb(new Error('Invalid file type'));
    }
    else{
      return cb(null, true);
    }  
  },
  storage: multerS3({
    s3: s3,
    bucket: "ramsol-production-refo"+"/"+"profilePicture",
    key: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      console.log(ext);
      if(ext == '.jpg' || ext == '.png' || ext == '.jpeg') {
        cb(null, req.mainId+"/"+req.mainId+"_"+file.originalname);
      }
      
    }
  })
});
// superadmin control ---------------------------------------------------------------------------------------------------
exports.addAdmin = async (req, res) => {
  try {
    const {companyAddress, email, firstName, lastName, password, companyName, mobile, employeeId,companyWebsite } =
      req.body;
    const checkuser_email = await user.findOne({ where: { [Op.or]: { email: email } } });
    const checkuser_mobile = await recruiter.findOne({ where: { [Op.or]: { mobile: mobile } } });
    if ((checkuser_email) && (checkuser_email.email == email)) {
      res.status(200).json({ message: "Email Id Already Exits", status: false });
    }
    else if ((checkuser_mobile) && (checkuser_mobile.mobile == mobile)) {
      res.status(200).json({ message: "Mobile Number Already Exits", status: false });
    }
    else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const Hash = await bcrypt.hash(password, salt);
      user
        .create({
          email: email,
          roleName: "ADMIN",
          password: Hash,
          isMsme:false,
          companyType:req.body.company_type
        })
        .then(async (data) => {
          var rec_data=await recruiter.create({
            userId: data.id,
            mainId: data.id,
            firstName: firstName,
            companyName: companyName,
            mobile: mobile,
            lastName: lastName,
            employeeId: employeeId,
            companyAddress:companyAddress,
            companyWebsite:companyWebsite
          });
          await data.update({ mainId: data.id });
          // if(company_type=="COMPANY")
          //   {
          //     await autoAddTheClient(req.body,rec_data,data.id);
          //   }
          await Source.create(
            {
                mainId: data.id,
                name:"Sub-Contract",
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
          res
            .status(200)
            .json({ message: "Company Created", status: true, data: data });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};
exports.editAdmin = async (req, res) => {
  console.log(req.body);
  const { companyAddress,email, firstName, lastName, companyName, mobile, employeeId,companyWebsite } = req.body;
  user
    .findOne({ where: { id: req.body.id } })
    .then(async (data) => {
      if (data.email == email) {
        recruiter.update(
          {
            firstName: firstName,
            companyName: companyName,
            mobile: mobile,
            lastName: lastName,
            companyName: companyName,
            employeeId: employeeId,
            companyAddress:companyAddress,
            companyWebsite:companyWebsite
          },
          { where: { userId: data.id } }
        ).then(() => {
          res
            .status(200)
            .json({ status: true, message: "Company Edited Successfully" });
        })
      }
      else {
        var exist_data = await user
          .findOne({ where: { email: req.body.email } });
        if (!exist_data) {
          await data.update({
            email: req.body.email,
          });
          await recruiter.update(
            {
              firstName: firstName,
              companyName: companyName,
              mobile: mobile,
              lastName: lastName,
              companyName: companyName,
              companyAddress:companyAddress,
              companyWebsite:companyWebsite
            },
            { where: { userId: data.id } }
          );
          res.status(200).json({ status: true, message: "Company Edited Successfully" });
        }
        else {
          res.status(200).json({ status: false, message: "Email Already Exist Please Try Another Email!!" })
        }
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
};

exports.changeAdminState = async (req, res) => {
  try {
    main_user = await user.findOne({ where: { id: req.body.id } });
    if (main_user.isActive == true) {
      await user.update(
        { isActive: false },
        { where: { mainId: req.body.id } }
      );
      res.status(200).json({ status: true, data: "Changed To Inactive" });
    } else {
      await user.update({ isActive: true }, { where: { mainId: req.body.id } });
      res.status(200).json({ status: true, data: "Changed To Active" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Error" });
  }
};
exports.adminList = async (req, res) => {
  await user
    .findAll({
      distinct: true,
      where: { roleName: "ADMIN",isActive:true },
      include: [{ model: recruiter, attributes: ["id", "mainId", "firstName", "lastName","companyName"] }],
      order: [['createdAt', 'DESC']],
      attributes: ["id", "email", "roleName"]
    }).then((data) => {
      res
        .status(200)
        .json({ status: true, data: data });
    }).catch(e => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
};

exports.viewAdmin = async (req, res) => {
  user
    .findOne({ where: { id: read.body.userId }, include: [recruiter] }).then(data => {
      res
        .status(200)
        .json({ status: true, data: data.rows, count: data.count });
    }).catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
};

exports.viewAllAdmin = async (req, res) => {
  try {
    var limit = 10;
    if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
    var mywhere={ roleName: "ADMIN" };
    if(req.body.adminId){
      mywhere.id=req.body.adminId
    }
    if (req.body.fromDate && req.body.toDate) {
      const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
      const toDate = moment(req.body.toDate).endOf('day').toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate]
      }
    }
    user
      .findAndCountAll({
        distinct: true,
        where: mywhere,
        attributes: { exclude: ["password"] },
        limit: limit,
        offset: page * limit - limit,
        include: [recruiter],
        order: [['createdAt', 'DESC']]
      })
      .then((data) => {
        res
          .status(200)
          .json({ status: true, data: data.rows, count: data.count });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Error" });
  }
};
// admin control -------------------------------------------------------------------------------------------------------------
// exports.addAccess = async (req, res) => {
//   recruiterAccess
//     .findOne({ where: { recruiterId: req.body.id, page: req.body.page } })
//     .then(async (data) => {
//       if (data) {
//         res
//           .status(200)
//           .json({ status: false, message: "User page access exist" });
//       } else {
//         await recruiterAccess.create({
//           recruiterId: req.body.id,
//           page: req.body.page,
//         });
//         res.status(200).json({ status: true, message: "User role added" });
//       }
//     })
//     .catch((e) => {
//       res.status(500).json({ status: false, message: "Error" });
//     });
// };

// exports.removeAccess = async (req, res) => {
//   recruiterAccess
//     .destroy({ where: { recruiterId: req.body.id, page: req.body.page } })
//     .then(async (data) => {
//       res.status(200).json({ status: true, message: "Access removed!!" });
//     })
//     .catch((e) => {
//       res.status(500).json({ status: false, message: "Error" });
//     });
// };

exports.editUser = async (req, res) => {
  try {
    console.log(req.body);
    const { id, firstName, lastName, mobile, email, roleName, employeeId,companyName,headOfficeLocation,branchOfficeLocation,capabilities,recruiterCapacity,companyAddress } = req.body;
    const {minimumCommercialFee,contractStaffing,sourceProfileFrom,aboutATS,GSTNumber,minimumMarkup}=req.body;
    
    await recruiter.findOne({ where: { userId: id, mainId: req.mainId }, include: [user] }).then(async data => {
      if (data.user.email == req.body.email) {
        await user.update({
          roleName: roleName
        }, { where: { id: req.body.id } });
        await data.update({
          firstName: firstName,
          lastName: lastName,
          mobile: mobile,
          employeeId: employeeId,
          companyName:companyName,
          companyAddress:companyAddress,
          headOfficeLocation:headOfficeLocation,
          branchOfficeLocation:branchOfficeLocation,
          capabilities:capabilities,
          recruiterCapacity:recruiterCapacity,
          minimumCommercialFee:minimumCommercialFee,
          contractStaffing:contractStaffing,
          sourceProfileFrom:sourceProfileFrom,
          aboutATS:aboutATS,
          GSTNumber:GSTNumber,
          minimumMarkup:minimumMarkup
        });
        res.status(200).json({ message: "Edited Sucessfully", status: true });
      } else {
        user.findOne({ where: { email: email } }).then(async user_data => {
          if (user_data) {
            res.status(200).json({ status: false, message: "Email Already Exist Please Try Another Email!!" })
          }
          else {
            await user.update({
              email: email,
              roleName: roleName
            }, { where: { id: req.body.id } });
            await data.update({
              firstName: firstName,
              lastName: lastName,
              mobile: mobile,
              employeeId: employeeId,
              companyName:companyName,
              headOfficeLocation:headOfficeLocation,
              branchOfficeLocation:branchOfficeLocation,
              capabilities:capabilities,
              recruiterCapacity:recruiterCapacity,
              minimumCommercialFee:minimumCommercialFee,
              contractStaffing:contractStaffing,
              sourceProfileFrom:sourceProfileFrom,
              aboutATS:aboutATS,
              GSTNumber:GSTNumber,
              minimumMarkup:minimumMarkup
            });
            res.status(200).json({ message: "Edited Sucessfully", status: true });
          }

        })

      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false })
  }
};
exports.updateProfile=async(req,res)=>{
  try {
    const { id, firstName, lastName, mobile, email, roleName, employeeId,companyName } = req.body;
    await recruiter.findOne({ where: { userId: id, mainId: req.mainId }, include: [user] }).then(async data => {
      if (data.user.email == req.body.email) {
        await user.update({
          roleName: roleName
        }, { where: { id:id } });
        await data.update({
          firstName: firstName,
          lastName: lastName,
          mobile: mobile,
          companyName:companyName,
          employeeId: employeeId
        });
        res.status(200).json({ message: "Edited Successfully", status: true });
      } else {
        user.findOne({ where: { email: email } }).then(async user_data => {
          if (user_data) {
            res.status(200).json({ status: false, message: "Email Already Exist Please Try Another Email!!" })
          }
          else {
            await user.update({
              email: email,
              roleName: roleName
            }, { where: { id:id } });
            await data.update({
              firstName: firstName,
              lastName: lastName,
              mobile: mobile,
              companyName:companyName,
              employeeId: employeeId
            });
            res.status(200).json({ message: "Edited Successfully", status: true });
          }

        })

      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false })
  }
};


// exports.addOrgRecruiter=async(req,res)=>{
//     try {
//         const {name,email,mobile,id}=req.body;
//         const newdata=await orgRecruiter.findOne({where:{email:req.body.email}})
//         if(newdata){
//             res.status(200).json({message:"Recruiter already exits",status:false})
//         }else{
//             await orgRecruiter.create({
//                 name:name,
//                 email:email,
//                 mobile:mobile,
//                 clientId:id,
//                 userId:req.recid
//             }).then(data=>{
//                 res.status(200).json({message:"Recruiter created successfully",status:true,data:data})
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message:"Error",status:false})
//     }
// };

exports.changeUserRole = async (req, res) => {
  try {
    const { role, id } = req.body;
    await recruiter
      .findOne({ where: { userId: id, mainId: req.mainId }, include: [user] })
      .then((rec_data) => {
        if (rec_data) {
          user.update({ roleName: role }, { where: { id: id } });
          res
            .status(200)
            .json({ message: "Updated Successfully", status: true });
        } else {
          res.status(200).json({ message: "Data Not Found", status: false });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR", status: false });
  }
};

exports.changeUserState = async (req, res) => {
  user
    .findOne({ where: { id: req.body.id, mainId: req.mainId } })
    .then((data) => {
      if (data) {
        if (data.isActive == true) {
          data.update({
            isActive: false,
          });
          res.status(200).json({ status: true, data: "Changed To Inactive" });
        } else {
          data.update({
            isActive: true,
          });
          res.status(200).json({ status: true, data: "Changed To Active" });
        }
      }
      else {
        res.status(200).json({ status: false, message: "User Not Found" })
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
};


// recruiter control ------------------------------------------------------------------------------------------------------------
exports.addUser = async (req, res) => {
  const { email, firstName, roleName, lastName, password, companyName, mobile, employeeId,companyAddress,headOfficeLocation,branchOfficeLocation,capabilities,recruiterCapacity ,totalExp ,currentLocation,willingToWork,hoursToWork} =
    req.body;
    const {minimumCommercialFee,contractStaffing,sourceProfileFrom,aboutATS,GSTNumber,minimumMarkup}=req.body;
  try {
    console.log(req.body);
    const checkuser_email = await user.findOne({ where: { [Op.or]: { email: email } } });
    const checkuser_mobile = await recruiter.findOne({ where: { [Op.or]: { mobile: mobile } } });
    if ((checkuser_email) && (checkuser_email.email == email)) {
      res.status(200).json({ message: "Email Id Already Exists", status: false });
    }
    else if ((checkuser_mobile) && (checkuser_mobile.mobile == mobile)) {
      res.status(200).json({ message: "Mobile Number Already Exists", status: false });
    }
    else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const Hash = await bcrypt.hash(password, salt);
      const user_data = await user.create({
        email: req.body.email,
        roleName: roleName,
        mobile: mobile,
        password: Hash,
        mainId: req.mainId,
        isMsme:false,
        isActive:true
      });
      rec_data={
        userId: user_data.id,
        firstName: firstName,
        lastName: lastName,
        mainId: req.mainId,
        mobile: mobile,
        employeeId: employeeId,
        companyName:companyName,
        companyAddress:companyAddress,
        headOfficeLocation:headOfficeLocation,
        branchOfficeLocation:branchOfficeLocation,
        capabilities:capabilities,
        recruiterCapacity:recruiterCapacity,
        totalExp:totalExp,
        currentLocation:currentLocation,
        willingToWork:willingToWork,
        hoursToWork:hoursToWork,
        minimumCommercialFee:minimumCommercialFee,
        contractStaffing:contractStaffing,
        sourceProfileFrom:sourceProfileFrom,
        aboutATS:aboutATS,
        GSTNumber:GSTNumber,
        minimumMarkup:minimumMarkup
      };
      recruiter.create(rec_data);
      res
        .status(200)
        .json({ status: true, message: "User Added Successfully" });
    }

  }
  catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error", status: false });
  }
};

exports.userEdit = async (req, res) => {
  try {
    const { firstName, lastName, mobile, employeeId,companyName } = req.body;
    await recruiter.findOne({ where: { userId: req.userId } }).then((data) => {
      if (data) {
        data.update({
          firstName: firstName,
          lastName: lastName,
          mobile: mobile,
          employeeId: employeeId,
          companyName:companyName
        });
        res
          .status(200)
          .json({ message: "User Successfully Updated", status: true });
      } else {
        res.status(200).json({ message: "User Not Found", status: false });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false });
  }
};

exports.changeMyPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await user.findOne({ where: { id: req.userId } }).then(async (data) => {
      const pass = await bcrypt.compare(oldPassword, data.password);
      if (pass) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hash = await bcrypt.hash(newPassword, salt);
        data.update({ password: hash });
        res.status(200).json({ message: "Successfully Updated", status: true });
      } else {
        res
          .status(200)
          .json({ message: "Old Password Is Wrong", status: false });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false });
  }
};

exports.viewAllUsers = async (req, res) => {
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
    // await user.findAndCountAll({where:{mainId:req.mainId,roleName:{[Op.ne]:"ADMIN"}},attributes:['id','email','roleName','isActive'],
    // include:[{
    //     model:recruiter
    // }],
    // limit:limit,
    // offset: (page * limit) - limit
    // }).then(data=>{
    //     res.status(200).json({data:data.rows,count:data.count,status:true})
    // })
    var mywhere = { mainId: req.mainId, userId: { [Op.ne]: req.mainId } };
    if (req.body.recruiterId) {
      mywhere.id = req.body.recruiterId;
    }
    if(req.body.roleName){
      mywhere["$user.roleName$"]=req.body.roleName;
    }
    if (req.body.fromDate && req.body.toDate) {
      const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
      const toDate = moment(req.body.toDate).endOf('day').toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate]
      }
    }
    await recruiter.findAndCountAll({
      distinct: true,
      where: mywhere,
      attributes: { exclude: ['updateAt'] },
      limit: limit,
      offset: (page * limit) - limit,
      include: [{ model: user, attributes: { exclude: ['password', 'updatedAt'] }, }],
      order: [['createdAt', 'DESC']]
    })

      .then(data => {
        res.status(200).json({ data: data.rows, count: data.count, status: true })
      })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error', status: false });
  }
};
exports.viewUser = async (req, res) => {
  try {
    await user.findOne({
      where: { id: req.body.id, mainId: req.mainId }, attributes: ['email', 'roleName','isActive'],
      include: [{
        model: recruiter
      }],
    }).then(data => {
      res.status(200).json({ data: data, status: true })
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error', status: false });
  }
};

exports.getMyCreditsHistory=async(req,res)=>{
  try{
    const page = req.body.page ? req.body.page : 1;
    const limit = 10;
    const offset = (page - 1) * limit;
      var creds_data = await recCredsRecord.findAndCountAll({
        distinct:true,
        where: { vendorId: req.recruiterId},
        include: [
          {model:recordsVaule,attributes:['value','reason','status','createdAt','id'],required:false},
          { model: recruiter, attributes: ['firstName', 'lastName'], as: 'vendor'},
          { model: requirement, attributes: ['requirementName', 'uniqueId'] },
          { 
            model: candidate, 
            attributes: ['id', 'uniqueId'], 
            required:false,
            include: [
              { model: candidateDetail, attributes: ['firstName', 'lastName']}
            ]
          }
        ],
        limit: limit, 
        offset: offset,
        order: [['createdAt', 'DESC']]
      });
        res.status(200).json({data:creds_data.rows,count:creds_data.count,status:true});
    }
    catch(e)
    {
      console.log(e);
      res.status(500).json({message:"Error",status:false})
    }
};

exports.getVendorCreds =async (req,res)=>{
  try{
    const page = req.body.page ? req.body.page : 1;
    const limit = 10;
    const offset = (page - 1) * limit;
      var creds_data = await recCredsRecord.findAndCountAll({
        distinct:true,
        where: { vendorId: req.body.id},
        include: [
          {model:recordsVaule,attributes:['value','reason','status','createdAt','id'],required:false},
          { model: recruiter, attributes: ['firstName', 'lastName'], as: 'vendor'},
          { model: requirement, attributes: ['requirementName', 'uniqueId'] },
          { 
            model: candidate, 
            attributes: ['id', 'uniqueId'], 
            required:false,
            include: [
              { model: candidateDetail, attributes: ['firstName', 'lastName']}
            ]
          }
        ],
        limit: limit, 
        offset: offset,
        order: [['createdAt', 'DESC']]
      });
        res.status(200).json({data:creds_data.rows,count:creds_data.count,status:true});
    }
    catch(e)
    {
      console.log(e);
      res.status(500).json({message:"Error",status:false})
    }
};
  
exports.getVendorCredsCC =async (req,res)=>{
  try{
    const page = req.body.page ? req.body.page : 1;
    const limit = 10;
    const offset = (page - 1) * limit;
      var creds_data = await recCredsRecord.findAndCountAll({
        distinct:true,
        where: { vendorId: req.body.id},
        include: [
          {model:recordsVaule,attributes:['value','reason','status','createdAt','id'],required:false},
          { model: recruiter, attributes: ['firstName', 'lastName'], as: 'vendor'},
          { model: requirement,required:true, attributes: ['requirementName', 'uniqueId'],include:[{model:client,attributes:['handlerId'],required:true,where:{handlerId:req.recruiterId}}] },
          { 
            model: candidate, 
            attributes: ['id', 'uniqueId'], 
            required:false,
            include: [
              { model: candidateDetail, attributes: ['firstName', 'lastName']}
            ]
          }
        ],
        limit: limit, 
        offset: offset,
        order: [['createdAt', 'DESC']]
      });
        res.status(200).json({data:creds_data.rows,count:creds_data.count,status:true});
    }
    catch(e)
    {
      console.log(e);
      res.status(500).json({message:"Error",status:false})
    }
};


exports.companySettings = async (req, res) => {
  console.log(req.body);
  const rec_data = await user.findOne({ where: { id: req.body.recruiterId }, include: [{ model: recruiter, attributes: ["id"] }] });

  recruitersSettings.findOne({ where: { mainId: rec_data.mainId } }).then(async data => {
    if (data) {
      await data.update({
        fbBaseUrl: req.body.fbBaseUrl,
        phoneNumberId: req.body.phoneNumber,
        waToken: req.body.waToken,
        fromMonth: req.body.fromMonth,
        toMonth: req.body.toMonth,
        isEnableFree: req.body.isEnableFree,
        isEnablePaid:req.body.isEnablePaid,    
        //isEnableEmail:req.body.isEnableEmail
      });
      res.status(200).json({ status: true, message: "Data Updated Successfully" });
    }
    else {
      var addObj = {
        fbBaseUrl: req.body.fbBaseUrl,
        phoneNumberId: req.body.phoneNumber,
        waToken: req.body.waToken,
        mainId: rec_data.mainId,
        recruiterId: rec_data.recruiter.id,
        fromMonth: req.body.fromMonth,
        toMonth: req.body.toMonth,
        isEnableFree: req.body.isEnableFree,
        isEnablePaid:req.body.isEnablePaid,
        //isEnableEmail:req.body.isEnableEmail
      }
      if (req.file) {
        addObj.image = req.file.path
      }
      await recruitersSettings.create(
        addObj
      ).then((data1) => {
        res.status(200).json({ status: true, message: "Data Saved Successfully" });
      }).catch(e => {
        console.log(e);
        res.status(500).json({ status: false, message: "Error" })
      })

    }
  }).catch(e => {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" })
  })
};
exports.companySettingsExist = async (req, res) => {
  const rec_data = await recruitersSettings.findOne({ where: { mainId: req.body.id } });
  if (rec_data) {
    console.log(rec_data);
    res.status(200).json({ status: true, data: rec_data });
  }
  else {
    res.status(200).json({ status: false });
  }
};

exports.setLogo = async (req, res) => {
  console.log(req.file);
 
  if(req.file){
  recruitersSettings.findOne({ where: { mainId: req.mainId } }).then(data => {
    if (data) {
      data.update({
        image: 'profilePicture'+"/"+req.file.key
      });
      res.status(200).json({ status: true, message: "Image Updated Successfully", image: process.env.liveUrl+'profilePicture'+"/"+req.file.key});
    }
    else {
      res.status(200).json({ status: false, message: "User Not Found" });
    }
  }).catch(e => {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
}
else{
  res.status(200).json({ status: false, message: "File not found!" });
}
};
exports.myCompanySettings=async(req,res)=>{
  recruitersSettings.findOne({ where: { mainId: req.mainId },attributes:["fromMonth","toMonth"]}).then((data)=>{
    res.status(200).json({ status: true,data:data});
  }).catch(e => {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
}
exports.editMyCompanySettings = async (req, res) => {
  recruitersSettings.findOne({ where: { mainId: req.mainId } }).then(data => {
    if (data) {
      data.update({
        fromMonth:req.body.fromMonth,
        toMonth:req.body.toMonth
      }).then((updated_data)=>{
        res.status(200).json({ status: true, message: "Settings Updated Successfully"});
      })
      
    }
    else {
      res.status(200).json({ status: false, message: "User Not Found" });
    }
  }).catch(e => {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
};

exports.userList = async (req, res) => {
  recruiter.findAll({ where: { mainId: req.mainId}, attributes: ['id', 'firstName', 'lastName','companyName','employeeId'] ,include:[{model:user,attributes:['isActive'],include:[role],where:{isActive:true},required:true}]}).then(data => {
    res.status(200).json({ status: true, data: data });  
  }).catch(e => {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
};

exports.allRecruiterList = async (req, res) => {
  recruiter.findAll({ where: { mainId: req.mainId, userId: { [Op.ne]: req.mainId } }, attributes: ['id', 'firstName', 'lastName', 'employeeId','companyName'],include:[{model:user,attributes:['isActive','roleName'],include:[role],where:{isActive:true},required:true}] }).then(data => {
    res.status(200).json({ status: true, data: data });
  }).catch(e => {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
};

exports.externalUserList=async(req,res)=>{
  recruiter.findAll({where:{mainId:req.mainId},include:[{model:user,where:{[Op.or]: [
    { roleName: 'FREELANCER' }, // Users with roleName 'admin'
    { roleName: 'SUBVENDOR' } // Users with roleName 'superadmin'
  ]}}]}).then(data=>{
    res.status(200).json({ status: true, data: data });
  }).catch(e => {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
};

exports.orgPocForCompany=async(req,res)=>{
  recruiter.findAll({where:{mainId:req.mainId},include:[{model:user,where:{[Op.or]: [
    { roleName: 'RECRUITER' }, // Users with roleName 'admin' // Users with roleName 'superadmin'
  ]}}]}).then(data=>{
    res.status(200).json({ status: true, data: data });
  }).catch(e => {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
};

exports.setUserNda=async(req,res)=>{
  try{
  var rec_data=await recruiter.findOne({where:{id:req.recruiterId}});
  rec_data.nda="nda/"+req.file.key;
  await rec_data.save();
  res.status(200).json({ status: true, message: "Success" });
  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  }
};

exports.getUserNda=async(req,res)=>{
  try
  {
    var rec_data=await recruiter.findOne({where:{id:req.recruiterId}});
    res.status(200).json({ status: true, nda: rec_data.nda});
  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  }
};

exports.removeNda=async(req,res)=>{
  try
  {
    var rec_data=await recruiter.findOne({where:{id:req.body.recruiterId}});
    console.log(rec_data);
    var result=await fileUpload.removeS3File(rec_data.nda);
    rec_data.nda=null;
    await rec_data.save();
    res.status(200).json({ status: true, message: "Removed Successfully"});
  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  }
};



async function autoAddTheClient(bodyData,rec_data,mainId)
{
  var myclient = {
    clientName: bodyData.companyName,
    recruiterId: rec_data.id,
    statusCode: 101,
    mainId: mainId
  };
  const clientData = await client.findOne({
    where: { mainId: mainId },
    order: [["clientInt", "DESC"]],
  });
  if (clientData) {
    myclient.clientInt = Number(clientData.clientInt) + 1;
    myclient.clientText = "CLI";
  } else {
    myclient.clientInt = 1001;
    myclient.clientText = "CLI";
  }
  myclient.uniqueId = `${myclient.clientText}${myclient.clientInt}`;
  await client.create(myclient);
}