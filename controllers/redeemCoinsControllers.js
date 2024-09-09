

const Sequelize = require("../db/db");
const redeemHistory=require("../models/redeemHistory");
const user = require('../models/user');
const recruiter = require('../models/recruiter');
const reedemedInvoiced = require('../models/reedemedInvoiced');
const  bankDetails= require('../models/bankDetails');
require("dotenv").config();
const mailFunction=require("../functions/sendReplyMail");
const { stat } = require("fs");
const { v4: uuidv4 } = require('uuid');
const recCredsRecord = require("../models/recCredsRecords");
const recordsValue=require("../models/recordsVaule");
const fn = Sequelize.fn;
const { Op, col } = require("sequelize");
exports.redeemCoins=async(req,res)=>{
    console.log(req.body); 
    var rec_data=await recruiter.findOne({where:{id:req.recruiterId}});
    var bank_data=await bankDetails.findOne({where:{recruiterId:req.recruiterId}});
    if(rec_data.recCreds>=50)
        {
            var createRecord= {
                redeemValue:req.body.redeemValue,
                inrValue:req.body.redeemValue*5,
                recruiterId:req.recruiterId,
                status:"PENDING",
                mainId:req.mainId,
                invoice:req.file.key,
                invoiId:req.body.invoiInt,
                InvTxt:req.body.invoiText,
                uniqueId:req.body.invoiText+req.body.invoiInt
            };
            var historyData=await redeemHistory.create(createRecord);
            mailData={
                name:rec_data.firstName+" "+rec_data.lastName,
                value:req.body.redeemValue,
                totalValue:req.body.redeemValue*5,
                accountNumber:bank_data.accountNumber,
                ifscCode:bank_data.ifscCode,
                bankName:bank_data.bankName
            }
            for(i=0;i<req.body.record_ids.length;i++)
            {
                await reedemedInvoiced.create({
                    historyId:historyData.id,
                    recordValueId:req.body.record_ids[i]
                });
                await recordsValue.update({status:"INVOICED"},{where:{id:req.body.record_ids[i]}});
            }
            await mailFunction.sendRedumptionRequest(mailData);
            res.status(200).json({status:true,message:"Redemption Request Successfull"});
        }
    else
        {
            res.status(200).json({status:false,message:"Insuuficient Creds"});
        }    
   
    
};

exports.getUniqueIdForInvoice=async(req,res)=>{
    try
    {
        invoiInt=uuidv4();
        res.status(200).json({invoiInt:invoiInt,invoiText:"BILL#",status:true});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }
};

exports.viewAllRedumptionsVendor=async(req,res)=>{
    try{
    if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
    var limit = 10;
    var getdata=await redeemHistory.findAndCountAll({where:{recruiterId:req.recruiterId},limit: limit,attributes:['id','status','redeemValue','inrValue','uniqueId','rejectReason','transactionNumber',[
        fn(
          "concat",
          process.env.liveUrl,
          "invoice/",
          col("invoice")
        ),
        "invoice",
      ]],
        offset: page * limit - limit,order: [["createdAt", "DESC"]]});
        res.status(200).json({status:true,data:getdata.rows,count:getdata.count});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }
};

// exports.viewAllRedumptionsVendor=async(req,res)=>{
//     try{
//     if(req.body.page)
//     {
//         if(req.body.page)
//     {
//         var page = req.body.page;
//     }
//     else
//     {
//         var page=1;
//     }
//     }
//     else
//     {
//         var page=1;
//     }
//     var limit = 10;
//     var getdata=await redeemHistory.findAndCountAll({where:{recruiterId:req.recruiterId},limit: limit,
//         offset: page * limit - limit,order: [["createdAt", "DESC"]]});
//         res.status(200).json({status:false,data:getdata.rows,count:getdata.count});
//     }
//     catch(e)
//     {
//         console.log(e);
//         res.status(500).json({status:false,message:"Error"});
//     }
// };
exports.adminViewAllRedemption=async(req,res)=>{
    try{
        if(req.body.page)
        {
            if(req.body.page)
        {
            var page = req.body.page;
        }
        else
        {
            var page=1;
        }
        }
        else 
        {
            var page=1;
        }
        var limit = 10;
        var getdata=await redeemHistory.findAndCountAll({where:{mainId:req.mainId},limit: limit,include:[{model:recruiter,attributes:['id','firstName','lastName','companyName']}],attributes:['id','status','redeemValue','inrValue','uniqueId','rejectReason','transactionNumber',[
            fn(
              "concat",
              process.env.liveUrl,
              "invoice/",
              col("invoice")
            ),
            "invoice",
          ]],
            offset: page * limit - limit,order: [["createdAt", "DESC"]]});
            res.status(200).json({status:true,data:getdata.rows,count:getdata.count});
        }
        catch(e)
        {
            console.log(e);
            res.status(500).json({status:false,message:"Error"});
        }
};

exports.confirmTransfer=async(req,res)=>{
    try
    {
        var theData=await redeemHistory.findOne({where:{id:req.body.id}});
        var bankData=await bankDetails.findOne({where:{recruiterId:theData.recruiterId},include:[{model:recruiter,include:[{model:user}]}]});
        if(theData)
        {
            theData.status="PAID";
            theData.transactionNumber=req.body.transactionNumber;
            await theData.save();
            const recordsToUpdate = await reedemedInvoiced.findAll({
                where: { historyId: req.body.id },
              });
            for (const record of recordsToUpdate) {
              await record.update({ status: 'PAID' });
              await recordsValue.update({status:'REDEEMED'},{where:{id:record.recordValueId}});
            }

            await recruiter.increment(
                { recCreds: -theData.redeemValue }, // Decrement the reccreds column by the specified value
                { where: { id: theData.recruiterId } } // Find the recruiter by ID
            );
            mainData={
                name:bankData.recruiter.firstName+" "+bankData.recruiter.lastName,
                transactionId:req.body.transactionNumber,
                redeemValue:theData.redeemValue,
                totalAmount:theData.redeemValue*5,
                bankName:bankData.bankName
            }
            await mailFunction.redeemSuccess(mainData,bankData.recruiter.user.email);
            res.status(200).json({status:true,message:"Success"});
        }
        else
        {
            res.status(200).json({status:false,message:"Invalid Action"});
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }
};
exports.rejectInvoice=async(req,res)=>{
    try
    {var theData=await redeemHistory.findOne({where:{id:req.body.id}});
    if(theData)
        {
            theData.status="REJECTED";
            theData.rejectReason=req.body.reason;
            await theData.save();
            const recordsToUpdate = await reedemedInvoiced.findAll({
                where: { historyId: req.body.id },
              });
            for (const record of recordsToUpdate) {
              await record.update({ status: 'REJECTED' });
              await recordsValue.update({status:'TO-INVOICE'},{where:{id:record.recordValueId}});
            }

            // await recruiter.increment(
            //     { reccreds: -theData.redeemValue }, // Decrement the reccreds column by the specified value
            //     { where: { id: theData.recruiterId } } // Find the recruiter by ID
            // );
            res.status(200).json({status:true,message:"Success"});
        }
        else
        {
            res.status(200).json({status:false,message:"Invalid Action"});
        }}
        catch(e)
        {
            console.log(e);
            res.status(500).json({status:false,message:"Error"});
        }
};

exports.addBankDetails=async(req,res)=>{
    try{
        console.log(req.body);
        await bankDetails.create({
            recruiterId:req.recruiterId,
            bankName:req.body.bankName,
            accountNumber:req.body.accountNumber,
            ifscCode:req.body.ifscCode,
            micrCode:req.body.micrCode,
            gstNumber:req.body.gstNumber,
            panNumber:req.body.panNumber
        });
        res.status(200).json({status:true,message:"Successfully Added Bank Details"});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }
};

exports.getBankDetails=async(req,res)=>{
    try{
        var bank_data =await bankDetails.findOne({where:{
            recruiterId:req.recruiterId
        }});
        if(bank_data)
        {
            res.status(200).json({status:true,data:bank_data});
        }
        else
        {
            res.status(200).json({status:false,message:"Details Not Found"});
        }
        
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }
};

exports.editBankDetails=async(req,res)=>{
    try{
        console.log(req.body);
        await bankDetails.update({
            bankName:req.body.bankName,
            accountNumber:req.body.accountNumber,
            ifscCode:req.body.ifscCode,
            micrCode:req.body.micrCode,
            gstNumber:req.body.gstNumber,
            panNumber:req.body.panNumber
        },{where:{recruiterId:req.recruiterId}});
        res.status(200).json({status:true,message:"Successfully Updated Bank Details"});
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }
};

exports.getVendorsBankDetails=async(req,res)=>{
    try
    {
        var bank_data =await bankDetails.findOne({where:{
            recruiterId:req.body.id
        }});
        if(bank_data)
        {
            res.status(200).json({status:true,data:bank_data});
        }
        else
        {
            res.status(200).json({status:false,message:"Details Not Found"});
        }
        
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }
};