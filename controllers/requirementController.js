//models
const requirements = require("../models/requirement");
const client = require("../models/client");
const orgRecruiter=require("../models/orgRecruiter");
const user = require("../models/user");
const moment=require("moment");
const statusList=require("../models/statusList");
const recruiter = require("../models/recruiter");
const assignedRequirements=require("../models/assignedRequirement");
const candidateDetails=require("../models/candidateDetail");
const Source=require("../models/source");
const candidateStatus=require("../models/myCandidateStatus");
const levelOfHiring=require("../models/levelOfHiring");
const { Op, col } = require("sequelize");
const Sequelize = require("../db/db");
const fn = Sequelize.fn;

const candidate=require("../models/candidate");
const e = require("express");
//

exports.addRequirement = async (req, res) => {
  try{
  var client_data=await client.findOne({where:{id:req.body.clientId,mainId:req.mainId}});
  let ord_data;
  let rec_data;
  if(client_data){
    var myreq;
    if(req.companyType="COMPANY")
      {
        myreq = {
        clientId: client_data.id,
        requirementName: req.body.requirementName,
        skills: req.body.skills,
        statusCode: 201,
        mainId: req.mainId,
        recruiterId: req.recruiterId,
        //orgRecruiterId: req.body.orgRecruiterId,
        experience:req.body.experience,
        jobLocation:req.body.jobLocation,
        hideFromInternal:req.body.hideFromInternal,
        gist:req.body.gist,
        modeOfWork:req.body.modeOfWork,
        specialHiring:req.body.specialHiring,
        levelOfHiringId:req.body.levelOfHiringId,
        cvShareValue:req.body.cvShareValue,
        cvInterviewDoneValue:req.body.cvInterviewDoneValue,
        cvJoinValue:req.body.cvJoinValue,
        createdBy:req.userId,
        isSendCpv:req.body.isSendCpv,
        joinedSharePercentage:req.body.joinedSharePercentage
      };
      // ord_data=await orgRecruiter.findOne({where:{id:req.body.orgRecruiterId,mainId:req.mainId}});
      // user_data=await user.findOne({where:{email:ord_data.email,mainId:req.mainId},include:[recruiter]});
      // console.log(user_data);
      }
      
    else
    {
      myreq = {
        clientId: client_data.id,
        requirementName: req.body.requirementName,
        skills: req.body.skills,
        statusCode: 201,
        mainId: req.mainId,
        recruiterId: req.recruiterId,
        orgRecruiterId: req.body.orgRecruiterId,
        experience:req.body.experience,
        jobLocation:req.body.jobLocation,
        hideFromInternal:req.body.hideFromInternal,
        gist:req.body.gist,
        modeOfWork:req.body.modeOfWork,
        specialHiring:req.body.specialHiring,
        createdBy:req.userId
      };
    }
    const requnidata = await requirements.findOne({
      where: { mainId: req.mainId },
      order: [["requirementInt", "DESC"]],
    });
    if (requnidata) {
      myreq.requirementInt = requnidata.requirementInt + 1;
      myreq.requirementText = "REQ";
    } else {
      myreq.requirementInt = 10001;
      myreq.requirementText = "REQ";
    }
    myreq.uniqueId = `${myreq.requirementText}${myreq.requirementInt}`;
    await requirements.create(myreq).then(async (data) => {
      var recList=req.body.assignRecruitersList;
      var rec;
      if(recList.length>0)
        {
          for(i=0;i<recList.length;i++)
            {
              rec=recList[i];
              console.log(rec);
              var isAssigned=await assignedRequirements.findOne({where:{recruiterId:rec,requirementId:data.id,mainId:req.mainId}});
              if(!isAssigned)
                {
                  await assignedRequirements.create({
                    recruiterId:rec,//towho(req.body.)
                    assignedBy:req.recruiterId,//bywho(req.)
                    mainId:req.mainId,
                    requirementId:data.id
                  });
                }
            }
        }
     
      res
        .status(200)
        .json({ status: true, message: "Requirement Added Successfully",requirementId:data.dataValues.id });
    });
  }
  else{
    res
        .status(200)
        .json({ status: false, message: "Unable To Find Client" });
  }
  
}
catch(e){
  console.log(e);
  res.status(500).json({message:"Error",status:false});
}

};
exports.viewAllRequirements = async (req, res) => {
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
  var limit = 10;
  //attributes=[]
 var mywhere={mainId:req.mainId};
 if(req.body.recruiterId){
    mywhere['$client.handlerId$']=req.body.recruiterId;
 }
  if(req.body.requirementId){
    mywhere.id=req.body.requirementId;
}


    if (req.body.fromDate && req.body.toDate) {

      const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
      const toDate = moment(req.body.toDate).endOf('day').toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate]
      }
    }
    if(req.body.fileDownload){
      requirements
    .findAll({
      distinct: true,
      where: mywhere,
      attributes: [
        '*',
        [fn('COUNT', col('candidate.id')), 'candidateCount']
      ],
      include:[
        {
          model:client,
          attributes:['clientName','uniqueId'],
          include:[ { model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
          { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }]
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
        },
        {
          model:candidate,
          
        }
      ],
   //   attributes:[''],
      order:[['createdAt','DESC']]
    })
    .then(async (data) => {
      const xldata=await data.map((data,index)=>{
        return {
            S_no:index+1,
            RequirementName:data.requirementName+"("+data.uniqueId+")",
            CCName:data.recruiter.firstName+" "+data.recruiter.lastName,
            clientName:data.client.clientName+"("+data.client.uniqueId+")",
            orgRecruiterName:data.orgRecruiter.name,
            experience:data.experience,
            skills:data.skills,
            location:data.jobLocation,
            gist:data.gist,
            statusName:data.statusList.statusName,
            created:moment(data.createdAt).format('DD-MM-YYYY')
        }
    })
      res
        .status(200)
        .json({ status: true, data: xldata });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
    }
  else{
    requirements
    .findAndCountAll({
      distinct: true,
      where: mywhere,
      include:[
        {
          model:client,
          attributes:['id','clientName','uniqueId','handlerId'],
          include:[ { model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
          { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }]
        },
        {
          model:orgRecruiter,
          attributes:['id','name']
        },
        {
          model:recruiter,
          attributes:['id','firstName','lastName']
        },
        {
          model:statusList,
          attributes:['id',"statusName","statusType","statusDescription"]
        }
      ],
      limit: limit,
      offset: page * limit - limit,
   //   attributes:[''],
      order:[['createdAt','DESC']]
    })
    .then(async (data) => {

      res
        .status(200)
        .json({ status: true, data: data.rows, count: data.count });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
  }
};
exports.myRequirements = async (req, res) => {
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
  var limit = 10;
  var mywhere={mainId:req.mainId};
  mywhere.recruiterId=req.recruiterId
 
  if(req.body.requirementId){ 
    mywhere.id=req.body.requirementId;
}
  if(req.body.fromDate&&req.body.toDate){
    if (req.body.fromDate && req.body.toDate) {

      const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
      const toDate = moment(req.body.toDate).endOf('day').toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate]
      }
    }
  }
  requirements
    .findAndCountAll({
      distinct: true,
      where: mywhere,
      include:[
        {
          model:client,
          attributes:['id','clientName','uniqueId'],
          include:[ { model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
          { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }]
        },
        {
          model:orgRecruiter,
          attributes:['id','name']
        },
        {
          model:recruiter,
          attributes:['id','firstName','lastName']
        },
        {
          model:statusList,
          attributes:['id',"statusName","statusType","statusDescription"]
        }
      ],
      limit: limit,
      offset: page * limit - limit,
      order:[['createdAt','DESC']]
    })
    .then(async (data) => {
      res
        .status(200)
        .json({ status: true, data: data.rows, count: data.count });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
};
exports.viewRequirement = async (req, res) => {
  console.log("here");
  console.log(req.body);
  try{
  requirements
    .findOne({ where: { id: req.body.id },include:[
      {
        model:client,
        attributes:['clientName','uniqueId'],
        include:[ { model: recruiter, as: 'recruiter', attributes: ['id', 'firstName', 'lastName'] },
          { model: recruiter, as: 'handler', attributes: ['id', 'firstName', 'lastName'] }]
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
      },
      {
        model:levelOfHiring,
        attributes:["name","id"]
      },
      {
        model:assignedRequirements,
        attributes:["recruiterId","id"],
        include:[{model:recruiter,required:true,attributes:["firstName","lastName"],include:[{model:user,required:true,where: {
          roleName: {
            [Op.and]: [
              { [Op.ne]: "SUBVENDOR" },
              { [Op.ne]: "SUBCONTRACT" }
            ]
          }
        }}]}]
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
      'levelOfHiringId',
      'hideForFrontDisplay',
      'cvJoinValue',
      'cvShareValue',
      'cvInterviewDoneValue',
      'joinedSharePercentage',
      [
        fn(
          "concat",
          process.env.liveUrl,
          col("requirementJd")
        ),
        "requirementJd",
      ],
      'isSendCpv'
    ]})
    .then(async (data) => {
      console.log(data);
      if (data) {
        var candidate_count=await candidate.count({where:{requirementId:req.body.id,mainId:req.mainId}});
        res.status(200).json({ status: true, data:data,candidateCount:candidate_count});
      } else {
        res.status(200).json({ status: false });  
      }
    })
    .catch((e) => {
      console.log("error Occured");
      console.log(e);
      res.status(500).json({ status: false, message: "Error While Fetiching" });
    });
  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  }
};


// exports.clientRequirements=async(req,res)=>{
//     requirements.findOne({where:{clientId:req.body.id}}).then(async data=>{
//         res.status(200).json({status:true,data:data});
//     }).catch(e=>{
//         res.status(500).json({status:false,message:"Error"});
//     }); 
// };

exports.getAllRequirementsForDisplay=async(req,res)=>{
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
  var limit = 10;
  await requirements.findAll({where: {statusCode:201,hideForFrontDisplay:false},limit: limit,
    offset: page * limit - limit,
    order:[['createdAt','DESC']]}).then(data=>{
    res.status(200).json({ status: true, data: data });
  }).catch(e=>{
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
};

exports.editRequirement = async (req, res) => {
  console.log(req.body);
  const myreq = {
    clientId: req.body.clientId,
    requirementName: req.body.requirementName, 
    skills: req.body.skills,
    orgRecruiterId: req.body.orgRecruiterId,
    experience:req.body.experience,
    gist:req.body.gist,
    jobLocation:req.body.jobLocation,          
    updatedBy:req.userId,
    hideFromInternal:req.body.hideFromInternal,
    specialHiring:req.body.specialHiring,
    modeOfWork:req.body.modeOfWork,
    hideForFrontDisplay:req.body.hideForFrontDisplay,
    cvShareValue:req.body.cvShareValue,
    cvJoinValue:req.body.cvJoinValue,
    cvInterviewDoneValue:req.body.cvInterviewDoneValue,
    isSendCpv:req.body.isSendCpv,
    joinedSharePercentage:req.body.joinedSharePercentage
  };
  requirements
    .findOne({where:{id:req.body.id}})
    .then(async (data) => { 
      await data.update(myreq); 
      res
        .status(200)
        .json({ status: true, message: "Requirement Edited successfully" });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
};

exports.requirementList=async(req,res)=>{
  if(req.roleName=="RECRUITER"){
    await requirements.findAll({where: { mainId: req.mainId ,statusCode:201,hideFromInternal:false},attributes:['id','requirementName','uniqueId']}).then(data=>{
      res.status(200).json({ status: true, data: data });
    }).catch(e=>{
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
  }
  else{
    await requirements.findAll({where: { mainId: req.mainId ,statusCode:201},attributes:['id','requirementName','uniqueId']}).then(data=>{
      res.status(200).json({ status: true, data: data });
    }).catch(e=>{
      console.log(e);
      res.status(500).json({ status: false, message: "Error" });
    });
  }

};

exports.getAllRequirementList=async(req,res)=>{
  
  await requirements.findAll({where:{mainId:req.mainId,statusCode:201},attributes:['id','requirementName','uniqueId']}).then(data=>{
    res.status(200).json({ status: true, data: data });
  }).catch(e=>{
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
}
exports.getCCRequirementList=async(req,res)=>{

  await requirements.findAll({where:{mainId:req.mainId,recruiterId:req.recruiterId},attributes:['id','requirementName','uniqueId']}).then(data=>{
    res.status(200).json({ status: true, data: data });
  }).catch(e=>{
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
}
exports.requirementStatusCodeList=async(req,res)=>{ 
  statusCode.findAll({where:{statusType:"REQUIREMENT"},attributes:['statusCode','id','statusName']}).then(data=>{
    res.status(200).json({status:true,data:data});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  });
}; 

exports.changeRequirementStatus=async (req,res)=>{
  console.log(req.body);
  await requirements.findOne({where:{id:req.body.requirementId}}).then(async data=>{
    if(data.statusCode==201){
      await data.update({  
        statusCode:202,
        updatedBy:req.userId
      });
      res.status(200).json({status:true,message:"Requirement Is Now Inactive"});
      await assignedRequirements.update({isActive:false},{where:{requirementId:req.body.requirementId}});
    } 
    else{ 
      await data.update({
        statusCode:201,
        updatedBy:req.userId
      }); 
      res.status(200).json({status:true,message:"Requirement Is Now Active"});
      await assignedRequirements.update({isActive:false},{where:{requirementId:req.body.requirementId}});
    }
  }).catch(e=>{
    console.log(e);
    res.status(500).json({ status: false, message: "Error" });
  })
};


exports.getAllCCList=async (req,res)=>{
  try {
    recruiter.findAll({where:{mainId:req.mainId},
      attributes:["id","firstName","lastName","employeeId"],
      include:[{
      model:user,
      attributes:["id","roleName"],
      where:{roleName:{[Op.or]:["CLIENTCOORDINATOR","ADMIN"]}},
      required:true
    }]}).then(data=>{
      res.status(200).json({data:data,status:true})
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Error",status:false});
  }
};
//External Use


exports.assignRequirements=async(req,res)=>{
  console.log(req.body);
  var isAssigned=await assignedRequirements.findOne({where:{recruiterId:req.body.recruiterId,requirementId:req.body.requirementId,mainId:req.mainId}});
  if(!isAssigned){
  await assignedRequirements.create({
    recruiterId:req.body.recruiterId,//towho(req.body.)
    assignedBy:req.recruiterId,//bywho(req.)
    mainId:req.mainId,
    requirementId:req.body.requirementId
  }).then(data=>{
    res.status(200).json({status:true,message:"Requirement Assigend",addedData:{id:data.id,recruiterId:data.recruiterId}});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({status:false,message:"ERROR"});
  });
 }
 else{
  res.status(200).json({status:false,message:"Requirement already assigned to user!"});
 }
};

exports.removeAssignedRequirements=async(req,res)=>{
  try{
    await assignedRequirements.destroy({where:{id:req.body.id}});
    res.status(200).json({status:true,message:"Removed"});
  }
 catch(e)
 {
  console.log(e);
  res.status(500).json({message:"Error",status:false});
 } 
 
};

exports.getAssignedRequierments=async(req,res)=>{
  if(req.roleName=="ADMIN"){
    var mywhere={recruiterId:req.recruiterId,isActive:true};
  }
  else{
    var mywhere={mainId:req.mainId,recruiterId:req.recruiterId,isActive:true};
  }
  await assignedRequirements.findAll({where:mywhere,include:[{model:requirements,where:{statusCode:201},attributes:['requirementName','uniqueId'],include:[recruiter]},{model:recruiter}]}).then(data=>{
    res.status(200).json({status:true,data:data});
  }).catch(e=>{
    res.status(500).json({status:false,message:"ERROR"});
  });
};


exports.changeAssignedRequirementStatus=async(req,res)=>{
  await assignedRequirements.findOne({where:{id:req.body.id,mainId:req.mainId},include:[{model:requirements,attributes:['statusCode']}]}).then(async data=>{
    console.log(data);
    if(data.isActive==true){
      await data.update({
        isActive:false
      });
      res.status(200).json({status:true,message:"Assigned requirement changed to Inactive"});
    }
    else{
      if(data.requirement.statusCode==201)
      {
        data.isActive=true;
        await data.update({
          isActive:true
        });
        res.status(200).json({status:true,message:"Assigned requirement changed to Active"});
      }
      else
      {
        res.status(200).json({status:false,message:"The Requirement Is Inactive"});
      }   
    }
  }).catch(e=>{
    console.log(e);
    res.status(500).json({status:false,message:"ERROR"});
  }); 
};
exports.getAssignedCompanies=async(req,res)=>{
  await assignedRequirements.findAndCountAll({where:{requirementId:req.body.requirementId},include:[{model:recruiter,include:[user]},{model:requirements,include:[recruiter]}]}).then(data=>{
    res.status(200).json({status:true,data:data.rows,count:data.count});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({status:false,message:"ERROR"});
  });
 }
exports.myAssignedRequirements=async(req,res)=>{
  var limit=50;
  var page=req.body.page;
  console.log(req.recruiterId);
  if(req.roleName=="ADMIN"){
    var mywhere={mainId:req.mainId,isActive:true};
  }
  else{
    var mywhere={mainId:req.mainId,recruiterId:req.recruiterId,isActive:true};
  }
  if(req.body.fromDate&&req.body.toDate){
    if (req.body.fromDate && req.body.toDate) {

      const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
      const toDate = moment(req.body.toDate).endOf('day').toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate]
      }
    }
  }
  if(req.body.requirementId){
    mywhere.requirementId=req.body.requirementId;
  }
  await assignedRequirements.findAndCountAll({where:mywhere,include:[{model:requirements,include:[orgRecruiter,client,statusList,recruiter]},{model:recruiter,attributes:['firstName','lastName']}], limit: limit,
  offset: page * limit - limit,
  order:[['createdAt','DESC']]}).then(data=>{
    console.log(data);
    res.status(200).json({status:true,data:data.rows,count:data.count});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({status:false,message:"ERROR"});
  });
}

exports.viewAllAssigendRequirements=async(req,res)=>{
  var limit=50;
  var page=req.body.page;
  var mywhere={mainId:req.mainId,recruiterId:req.body.recruiterId};
  if(req.body.fromDate&&req.body.toDate){
    if (req.body.fromDate && req.body.toDate) {

      const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
      const toDate = moment(req.body.toDate).endOf('day').toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate]
      }
    }
  }
  if(req.body.requirementId){
    mywhere.requirementId=req.body.requirementId;
  }
  
  await assignedRequirements.findAndCountAll({where:mywhere,include:[{model:requirements,attributes:['requirementName','uniqueId']},{model:recruiter,attributes:['firstName','lastName']}], limit: limit,
  offset: page * limit - limit,
  order:[['createdAt','DESC']]}).then(data=>{
    res.status(200).json({status:true,data:data.rows,count:data.count});
  }).catch(e=>{
    res.status(500).json({status:false,message:"ERROR"});
  });
}

exports.viewAllAssigendRequirementsCC=async(req,res)=>{
  console.log("in");
  var limit=50;
  var page=req.body.page;
  var mywhere={mainId:req.mainId,recruiterId:req.body.recruiterId};
  if(req.body.fromDate&&req.body.toDate){
    if (req.body.fromDate && req.body.toDate) {

      const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
      const toDate = moment(req.body.toDate).endOf('day').toISOString();
      mywhere.createdAt = {
        [Op.between]: [fromDate, toDate]
      }
    }
  }
  if(req.body.requirementId){
    mywhere.requirementId=req.body.requirementId;
  }
  console.log(mywhere);
  await assignedRequirements.findAndCountAll({
    where: mywhere,
    include: [
      {
        model: requirements,
        required: true,
        attributes: ['requirementName', 'uniqueId'],
        include: [
          {
            model: client,
            attributes: ['handlerId'],
            where: { handlerId: req.recruiterId },
            required: true
          }
        ]
      },
      {
        model: recruiter,
        attributes: ['firstName', 'lastName']
      }
    ],
    limit: limit,
    offset: page * limit - limit,
    order: [['createdAt', 'DESC']]
  })
  .then(data=>{
    res.status(200).json({status:true,data:data.rows,count:data.count});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({status:false,message:"ERROR"});
  });
}

exports.viewRequirementCandidates=async(req,res)=>{
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
    var limit = 10;
    var mywhere = {requirementId:req.body.requirementId};

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
    candidate.findAndCountAll({
      distinct: true,
      attributes:{exclude:['candidateInt','candidateText']},
      include: [
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
          include: [{ model: statusList, attributes: ["statusName","statusCode"] }],
        },

        {
          model: requirements,
          attributes: ["requirementName", "uniqueId"],
          include: [
            {
              model: statusList,
              attributes: ["statusName","statusCode"],
            },
            {
              model: client,
              attributes: ["clientName"],
              include: [{ model: statusList, attributes: ["statusName"] }],
            },
            {
              model: recruiter,
              attributes: ["firstName", "lastName", "mobile"],
            },
          ],
        },
        {
          model: statusList,
          attributes: ["statusName","statusCode"],
        },
        {
          model: recruiter,
          attributes: ["firstName", "lastName", "mobile"],
        },
      ],
      where: mywhere,
      limit: limit,
      offset: page * limit - limit,
      order: [["createdAt", "DESC"]],
    }).then(data=>{
      if (data) {
        res
          .status(200)
          .json({ data: data.rows, count: data.count, status: true });
      } else {
        res.status(200).json({ data: [], count: 0, status: false });
      }
    }).catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error" });
    });
};
exports.updateRequirementJd= async (req, res) => {
  console.log(req.file);
  requirements
    .findOne({ where: { id: req.body.id } })
    .then(async (data) => {
      console.log(data);
      if (req.file) {
        await data.update({
          requirementJd: "requirement" + "/" + req.file.key,
        });
        res.status(200).json({ status: true, message: "Requirement Jd Added" });
      } else {
        res.status(200).json({ status: true, message: "No Requirement Submitted" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error" });
    });
};

exports.myassignedRequirementsList= async (req, res) => {
  mywhere={};
  if(req.roleName=="RECRUITER")
    {
      mywhere={recruiterId:req.recruiterId};
    }
    else
    {
      mywhere={mainId:req.mainId};
    }
  await assignedRequirements.findAndCountAll({where:mywhere,include:[{model:requirements,include:[orgRecruiter,client,statusList,recruiter]},{model:recruiter,attributes:['firstName','lastName']}], 
  order:[['createdAt','DESC']]}).then(data=>{
    console.log(data);
    res.status(200).json({status:true,data:data.rows,count:data.count});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({status:false,message:"ERROR"});
  });
};

exports.getAssigendData= async (req, res) => {
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
    var limit = 10;
  if(!req.body.roleName)
  {
    roleName="SUBVENDOR"
  }
  else
  {
    roleName=req.body.roleName;
  }
  await assignedRequirements.findAndCountAll({ limit: limit,
    offset: page * limit - limit,
    order: [["createdAt", "DESC"]],where:{requirementId:req.body.requirementId},attributes:['id','createdAt'],include:[{model:recruiter,required:true,include:[{model:user,required:true,where:{roleName:roleName}}]}]}).then(data=>{
      res.status(200).json({status:true,data:data.rows,count:data.count});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({status:false,message:"ERROR"});
  });
};

exports.getAssigendDataCC= async (req, res) => {
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
    var limit = 10;
  if(!req.body.roleName)
  {
    roleName="SUBVENDOR"
  }
  else
  {
    roleName=req.body.roleName;
  }
  await assignedRequirements.findAndCountAll({ limit: limit,
    offset: page * limit - limit,
    order: [["createdAt", "DESC"]],where:{requirementId:req.body.requirementId},attributes:['id','createdAt'],include:[{model:requirements},{model:recruiter,required:true,include:[{model:user,required:true,where:{roleName:roleName}}]}]}).then(data=>{
      res.status(200).json({status:true,data:data.rows,count:data.count});
  }).catch(e=>{
    console.log(e);
    res.status(500).json({status:false,message:"ERROR"});
  });
};

exports.assignMulitpleRecuritersToRequirements=async(req,res)=>{
  try{
    var freelancerecruiters=req.body.freelancerecruiters;
    for(i=0;i<freelancerecruiters.length;i++)
    {
      var isAssigned=await assignedRequirements.findOne({where:{recruiterId:freelancerecruiters[i],requirementId:req.body.requirementId,mainId:req.mainId}});
      if(!isAssigned){
        await assignedRequirements.create({
          recruiterId:req.body.freelancerecruiters[i],//towho(req.body.)
          assignedBy:req.recruiterId,//bywho(req.)
          mainId:req.mainId,
          requirementId:req.body.requirementId
        });
      }
    }
    res.status(200).json({status:true,message:"Success"});
  }
 catch(e)
 {
  console.log(e);
 }
};