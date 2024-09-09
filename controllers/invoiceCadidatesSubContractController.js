const Sequelize = require("../db/db");
const user = require('../models/user');
const recruiter = require('../models/recruiter');
const client = require('../models/client');
const  bankDetails= require('../models/bankDetails');
require("dotenv").config();
const mailFunction=require("../functions/sendReplyMail");
const invoiceableSubContractCandidates=require("../models/SubContractInvoice/invoiceableSubContractCandidates");
const subcontractInvoiceHistory=require("../models/SubContractInvoice/subContractInvoiceHistroy");
const candidate = require("../models/candidate");
const candidateDetail = require("../models/candidateDetail");
const requirement=require("../models/requirement");
const fn = Sequelize.fn;
const { Op, col } = require("sequelize");
exports.getInvoiceableCandidates=async(req,res)=>{
    try{

        var include=[{model:candidate,attributes:['uniqueId','invoiceValue','joinedDate'],include:[
            {model:requirement,attributes:['joinedSharePercentage','requirementName','uniqueId']},
            {model:candidateDetail,attributes:['firstName','lastName']}
        ]}];
        var page= req.body.page ? req.body.page:0;
        var limit = 10;
    var can_data=await invoiceableSubContractCandidates.findAndCountAll({where:{recruiterId:req.recruiterId},include:include,offset: page * limit - limit,order: [["createdAt", "DESC"]]});
    res.status(200).json({status:true,data:can_data.rows,count:can_data.count});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Internal Server Error"});
    }
};
exports.getAllInvoiceableCandidates=async(req,res)=>{
    try{
        var include=[{model:candidate,attributes:['uniqueId','invoiceValue','joinedDate'],include:[
            {model:requirement,attributes:['joinedSharePercentage','requirementName','uniqueId']},
            {model:candidateDetail,attributes:['firstName','lastName']}
        ]}];
        var page= req.body.page ? req.body.page:0;
        var limit = 10;
    var can_data=await invoiceableSubContractCandidates.findAndCountAll({where:{mainId:req.mainId},include:include,offset: page * limit - limit,order: [["createdAt", "DESC"]]});
    res.status(200).json({status:true,data:can_data.rows,count:can_data.count});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Internal Server Error"});
    }
};


exports.getAllInvoiceableCandidatesCC=async(req,res)=>{
    try{
        var include=[{model:candidate,attributes:['uniqueId','invoiceValue','joinedDate'],include:[
            {model:requirement,required:true,attributes:['joinedSharePercentage','requirementName','uniqueId'],include:[{model:client,attributes:['handlerId'],required:true,where:{handlerId:req.recruiterId}}]},
            {model:candidateDetail,attributes:['firstName','lastName']}
        ]}];
        var page= req.body.page ? req.body.page:0;
        var limit = 10;
    var can_data=await invoiceableSubContractCandidates.findAndCountAll({where:{mainId:req.mainId},include:include,offset: page * limit - limit,order: [["createdAt", "DESC"]]});
    res.status(200).json({status:true,data:can_data.rows,count:can_data.count});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Internal Server Error"});
    }
};

exports.invoiceCandidates=async(req,res)=>{
    try{
    console.log(req.body);
    var rec_data=await recruiter.findOne({where:{id:req.recruiterId}});
    var bank_data=await bankDetails.findOne({where:{recruiterId:req.recruiterId}});
    if(bank_data){
        var createRecord= {
            totalValue:req.body.totalValue,
            recruiterId:req.recruiterId,
            status:"PENDING",
            mainId:req.mainId,
            invoice:req.file.key,
            invoiId:req.body.invoiInt,
            InvTxt:req.body.invoiText,
            uniqueId:req.body.invoiText+req.body.invoiInt
        };
        
        var record=await subcontractInvoiceHistory.create(createRecord);
        await invoiceableSubContractCandidates.update({status:"INVOICED",invoiceId:record.id},{where:{id:req.body.record_ids}});
        res.status(200).json({status:true,message:"Invoice Raised Successfully"});
    }

}
catch(e)
{
    console.log(e);
    res.status(500).json({status:false,message:"Internal Server Error"});
}

};

exports.rejectSubContractInvoice=async(req,res)=>{
    try{
        await subcontractInvoiceHistory.update({status:"REJECTED",rejectReason:req.body.reason},{where:{id:req.body.id}});
        await invoiceableSubContractCandidates.update({status:"TO-INVOICE",invoiceId:null},{where:{invoiceId:req.body.id}});
        res.status(200).json({status:true,message:"Rejected"});
    }
    catch(e){
        console.log(e);
        res.status(500).json({status:false,message:"Internal Server Error"});
    }
};

exports.paySubContractInvoice=async(req,res)=>{
    try{
        await subcontractInvoiceHistory.update({status:"PAID",transactionNumber:req.body.transactionNumber},{where:{id:req.body.id}});
        await invoiceableSubContractCandidates.update({status:"REDEEMED"},{where:{invoiceId:req.body.id}});
        res.status(200).json({status:true,message:"REDEEMED"});
    }
    catch(e){
        console.log(e);
        res.status(500).json({status:false,message:"Internal Server Error"});
    }
};

exports.viewAllInvoicedCandidates=async(req,res)=>{
        try{
            var page= req.body.page ? req.body.page:0;
            var limit = 10;
            var include=[{model:recruiter,attributes:['id','firstName','lastName','companyName']}];
            const attributes = [
                "id",
                "recruiterId",
                "totalValue",
                "uniqueId",
                "status",
                "transactionNumber",
                [fn(
                  "concat",
                  process.env.liveUrl,  // Make sure this includes a trailing slash (e.g., "https://example.com/")
                  "subContractinvoice/",
                  col("invoice")
                ), "invoice"]  // Give the concatenated result an alias like "invoiceUrl"

              ];
            var history=await subcontractInvoiceHistory.findAndCountAll({where:{mainId:req.mainId},attributes:attributes,include:include,offset: page * limit - limit,order: [["createdAt", "DESC"]]});
            res.status(200).json({status:true,data:history.rows,count:history.count});
        }
        catch(e)
        {
            console.log(e);
            res.status(500).json({status:false,message:"Internal Server Error"});
        }
};

exports.viewAllInvoices=async(req,res)=>{
    try{
        var page= req.body.page ? req.body.page:0;
        var limit = 10;
        const attributes = [
            "id",
            "recruiterId",
            "totalValue",
            "uniqueId",
            "status",
            "transactionNumber",
            [fn(
              "concat",
              process.env.liveUrl,  // Make sure this includes a trailing slash (e.g., "https://example.com/")
              "subContractinvoice/",
              col("invoice")
            ), "invoice"]  // Give the concatenated result an alias like "invoiceUrl"

          ];
        var history=await subcontractInvoiceHistory.findAndCountAll({where:{recruiterId:req.recruiterId},attributes:attributes,offset: page * limit - limit,order: [["createdAt", "DESC"]]});
        res.status(200).json({status:true,data:history.rows,count:history.count});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Internal Server Error"});
    }
};