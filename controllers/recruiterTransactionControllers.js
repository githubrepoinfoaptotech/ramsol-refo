const pricing=require("../models/pricing");
const recruiterTransaction=require("../models/recruiterTransaction");
const recruiterWallet=require("../models/recruiterWallets");
const recruiter=require("../models/recruiter");
const user=require("../models/user");
const statusList=require("../models/statusList")
const MyMessageActivity=require("../models/recruiterMessageActivity");
const { Op } = require("sequelize");
const moment=require("moment");
const recruiterCandidateActivity=require("../models/recruiterCandidateActivity");
require("dotenv").config();
//a2378b46-0926-4a58-bec3-ad622fab071d
exports.addPurchase=async(req,res)=>{
    const pricingDetails= await pricing.findOne({where:{id:req.body.pricingId}});
    const maxInt = await recruiterTransaction.findOne({
        where: { mainId: req.body.mainId },
        order: [["refInt", "DESC"]],
      });
    if (maxInt) {
        refInt = maxInt.refInt + 1;
        refTxt = "INV";
    } else {
        refInt = 10001;
        refTxt = "INV";
    } 
    const myRec=await recruiter.findOne({where:{mainId:req.body.mainId,userId:req.body.mainId}});

    var referenceNo = `${refTxt}${refInt}`;
    var basic_amount=pricingDetails.amount;
    var tax_perc=process.env.tax_perc;
    var gst_amount=Math.round(basic_amount*tax_perc)/100;
    var total_amount=parseFloat(basic_amount)+parseFloat(gst_amount); 
    var cgst=(gst_amount/2).toFixed(2);
    var sgst=cgst;
    recruiterTransaction.create({ 
        mainId:req.body.mainId,
        paymentTypes:req.body.paymentTypes, 
        pricingId:req.body.pricingId,
        recruiterId:req.body.recruiterId,  
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
      
        const wallet =await recruiterWallet.findOne({where:{mainId:req.body.mainId}});
        
        if(wallet){
            var pending_data=await recruiterTransaction.findOne({where:{statusCode:501,mainId:req.body.mainId},include:[pricing]});
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
                recruiterId:req.body.recruiterId,
                mainId:req.body.mainId,
                totalMessages:pricingDetails.numberOfMessages,
                remainingMessages:pricingDetails.numberOfMessages 
            });
        }  
        res.status(200).json({status:true,message:"Added successfully"});
    }).catch(e=>{ 
        console.log(e);
        res.status(500).json({ message: "Error", status: false });
    });
    
};
exports.addFreeCredits=async(req,res)=>{
    const pricingDetails= await pricing.findOne({where:{uniqueId:"PLAN10002"}});
    console.log(pricingDetails)
    const is_pending=await recruiterTransaction.findOne({where:{pricingId:pricingDetails.id,mainId:req.mainId,statusCode:501}});
    if(is_pending){
        res.status(200).json({ message: "Previous Emergency Creds Payment Pending", status: false });
    }
    else{    
    const maxInt = await recruiterTransaction.findOne({
        where: { mainId: req.mainId },
        order: [["refInt", "DESC"]],
      });
    if (maxInt) {
        refInt = maxInt.refInt + 1;
        refTxt = "INV";
    } else {
        refInt = 10001;
        refTxt = "INV";
    } 
    const myRec=await recruiter.findOne({where:{mainId:req.mainId,userId:req.mainId}});
    var referenceNo = `${refTxt}${refInt}`;
    var basic_amount=pricingDetails.amount;
    var tax_perc=process.env.tax_perc;
    var gst_amount=Math.round(basic_amount*tax_perc)/100;
    var total_amount=parseFloat(basic_amount)+parseFloat(gst_amount); 
    var cgst=(gst_amount/2).toFixed(2);
    var sgst=cgst;
    recruiterTransaction.create({ 
        mainId:req.mainId,
        paymentTypes:"Yet to pay", 
        pricingId:pricingDetails.id,
        recruiterId:req.recruiterId,  
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
        statusCode:501
    }).then(async(data)=>{
        const wallet =await recruiterWallet.findOne({where:{mainId:req.mainId}});
        if(wallet){
            await wallet.increment({
                totalMessages:pricingDetails.numberOfMessages,
                remainingMessages:pricingDetails.numberOfMessages
            });
        }
        else{
            await recruiterWallet.create({
                recruiterId:req.recruiterId,
                mainId:req.mainId,
                totalMessages:pricingDetails.numberOfMessages,
                remainingMessages:pricingDetails.numberOfMessages
            });
        }
        res.status(200).json({status:true,message:"Added successfully"});
    }).catch(e=>{
        console.log(e);
        res.status(500).json({ message: "Error", status: false });
    });
}
}
exports.changePendingPaymentStatus=async(req,res)=>{
    recruiterTransaction.findOne({where:{id:req.body.id,statusCode:501}}).then(data=>{
        if(data){
        data.update({
            statusCode:502
        });
        res.status(200).json({status:true,message:"Changed to Paid successfully"});
    }else{
        res.status(200).json({status:false,message:"Not found"});
    }
    }).catch(e=>{
        console.log(e);
        res.status(500).json({ message: "Error", status: false });
    });
}
exports.editPurchase=async(req,res)=>{
    try {
        const {id}=req.body
        recruiterTransaction.findOne({where:{id:id}}).then(data=>{
            data.update({
                recruiterId:req.body.recruiterId,
                mainId:req.body.mainId,
                purchasedMessages:req.body.purchasedMessages,
                paymentTypes:req.body.paymentTypes,
                pricingId:req.body.pricingId
            }).then(()=>{
                res.status(200).json({message:"Successfully Edited",status:true})
            })
        })
    } catch (error) {
        console.log(e);
        res.List(500).json({ message: "Error", status: false });
    }
};

exports.purchaseHistory=async(req,res)=>{
    try {
        const {page}=req.body;
        const limit=50;
        var myWhere={};
        if (req.body.fromDate && req.body.toDate) {

            const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
            const toDate = moment(req.body.toDate).endOf('day').toISOString();
            myWhere.createdAt = {
              [Op.between]: [fromDate, toDate]
            }
          }
          if(req.body.companyId){
            myWhere.mainId=req.body.companyId;
          }
        recruiterTransaction.findAndCountAll({where:myWhere,distinct: true,include:[pricing,recruiter,statusList],limit:limit,offset:(page*limit)-limit,order:[['createdAt','DESC']]}).then(data=>{
            res.status(200).json({data:data.rows,status:true,count:data.count})
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error", status: false });
    }
};

exports.singlePurchase=async(req,res)=>{
    try {
        recruiterTransaction.findOne({where:{id:req.body.purchaseId},include:[pricing,recruiter,statusList]}).then(data=>{
            res.status(200).json({data:data,status:true})
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error", status: false });
    }
};

exports.viewMyPurchases=(req,res)=>{
    try {
        const {page}=req.body;
        const limit=10;
        var myWhere={mainId:req.mainId};
        if (req.body.fromDate && req.body.toDate) {

            const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
            const toDate = moment(req.body.toDate).endOf('day').toISOString();
            myWhere.createdAt = {
              [Op.between]: [fromDate, toDate]
            }
          }
        recruiterTransaction.findAndCountAll({where:myWhere,distinct: true,include:[pricing,recruiter,statusList],limit:limit,offset:(page*limit)-limit,order:[['createdAt','DESC']]}).then(data=>{
            res.status(200).json({data:data.rows,status:true,count:data.count})
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error", status: false });
    }
};
exports.purchaseInvoice=async(req,res)=>{
    var{id}=req.body;
    recruiterTransaction.findOne({where:{id:req.body.id},include:[{model:pricing,attributes:["title"]},{model:recruiter,attributes:["companyName"]}]}).then(async data=>{
        res.status(200).json({data:data,status:true});
    }).catch(e=>{
        console.log(e);
        res.status(500).json({ message: "Error", status: false });  
    })
};
// exports.getBillingCounts=async(req,res)=>{
//     var transaction_count=await recruiterTransaction.count({where:{mainId:req.mainId}});
//     var used_candidates_count=await recruiterCandidateActivity.count({where:{mainId:req.mainId}});
//     res.List(200).json({List:true,billing:transaction_count,used_candidates_count:used_candidates_count});
// }
exports.MyMessageActivity=(req,res)=>{
    try {
        const {page,fromUs,fromCandidate}=req.body;
        const limit=10; 
        var myWhere={mainId:req.mainId};
        if (req.body.fromDate && req.body.toDate) {
            const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
            const toDate = moment(req.body.toDate).endOf('day').toISOString();
            myWhere.createdAt = {
              [Op.between]: [fromDate, toDate]
            }
          }
        // if(fromUs){
        //     myWhere={...myWhere,[Op.and]:{to:{[Op.ne]:null},from:null}}
        // }
        // if(fromCandidate){
        //     myWhere={...myWhere,[Op.and]:{from:{[Op.ne]:null},to:null}}
        // }
        //
        if(req.body.phoneNumber){
            myWhere.phoneNumber=req.body.phoneNumber;
        }
        MyMessageActivity.findAndCountAll({where:myWhere,limit:limit,offset:(page*limit)-limit,order:[["createdAt","DESC"]]}).then(data=>{
            res.status(200).json({data:data.rows,count:data.count,status:true});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error", status: false });
    }
};

 