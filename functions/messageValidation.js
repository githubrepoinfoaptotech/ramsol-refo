const recruiteWallet=require("../models/recruiterWallets");
const recruiterMessageActivity=require("../models/recruiterMessageActivity");
const recruiterSettings=require("../models/recruiterSettings");
const { QueryTypes, Op } = require("sequelize");
const Sequelize = require("../db/db");
exports.checkMessageAvailable=async (req,res,next)=>{
    var mySettings=recruiterSettings.findOne({Where:{mainId:req.mainId}});
    if(mySettings.isEnablePaid)
        {
    recruiteWallet.findOne({where:{mainId:req.mainId}}).then(data=>{
        
        if(data){
        if(data.remainingMessages==0){
            res.status(200).json({status:false,message:"No More Credit Left !"});
        }
        else{
            next();
        }
    }
    else{
        res.status(200).json({status:false,message:"No More Credit Left !"});
    }
    });
}
else{
    next();
}
};
exports.checkCredsAvailable=async(req,res,next)=>{
    var mySettings=recruiterSettings.findOne({Where:{mainId:req.mainId}});
    if(mySettings.isEnablePaid)
        {
    recruiteWallet.findOne({where:{mainId:req.mainId}}).then(data=>{ 
        if(data){
        if(data.remainingMessages==0){
            res.status(200).json({status:false,message:"No More Credit Left !"});
        }
        else{
            next();
        }
    }
    else{
        res.status(200).json({status:false,message:"No More Credit Left !"});
    }
    });
    }
    else{
        next();
    }
};
exports.checkInimessage=async (req,res,next)=>{
    console.log(req.body);
    console.log(req.mainId);
    var dateObj = new Date();
    var settingData=await recruiterSettings.findOne({where:{mainId:req.mainId}});
    console.log(settingData);
    mywhere={
        createdAt: {
          [Op.and]: [
            Sequelize.literal(`date_trunc('day', "createdAt") = '${dateObj.toISOString().slice(0, 10)}'`),
            Sequelize.literal(`extract(month from "createdAt") = ${dateObj.getMonth() + 1}`),
            Sequelize.literal(`extract(year from "createdAt") = ${dateObj.getFullYear()}`)
          ]
        },
        PHONE_NUMBER_ID:settingData.phoneNumberId,
        phoneNumber:req.body.phone_number,
        to:req.body.phone_number,
        mainId:req.mainId
      }
    var myhistory=await recruiterMessageActivity.findOne({where:mywhere});
    if(!myhistory){
    recruiteWallet.findOne({where:{mainId:req.mainId}}).then(data=>{
        if(data){
        if(data.remainingMessages==0){
            res.status(200).json({status:false,message:"No More Credit Left !"});
        }
        else{
            next();
        }
    }
    else{
        res.status(200).json({status:false,message:"No More Credit Left !"});
    }
    });
}
else{
    next();
}
};
exports.checkIsIniMessage=async(req,res,next)=>{
    console.log(req.body);
    console.log(req.mainId);
    var dateObj = new Date();
    var settingData=await recruiterSettings.findOne({where:{mainId:req.mainId}});
    console.log(settingData);
    mywhere={
        createdAt: {
          [Op.and]: [
            Sequelize.literal(`date_trunc('day', "createdAt") = '${dateObj.toISOString().slice(0, 10)}'`),
            Sequelize.literal(`extract(month from "createdAt") = ${dateObj.getMonth() + 1}`),
            Sequelize.literal(`extract(year from "createdAt") = ${dateObj.getFullYear()}`)
          ]
        },
        PHONE_NUMBER_ID:settingData.phoneNumberId,
        phoneNumber:req.body.phone_number,
        to:req.body.phone_number,
        mainId:req.mainId
      }
    var myhistory=await recruiterMessageActivity.findOne({where:mywhere});
    if(!myhistory){
        res.status(200).json({status:false,message:"Today's Initiation is yet to be done!!"});
}
else{
    next();
}
}
exports.checkRecivemessage=async (req,res,next)=>{
    var dateObj = new Date();
    const value = req.body.values[0].changes[0].value;
    if (value.messages) {
        const message = value.messages[0];
        const from = message.from;
        const username = value.contacts[0].profile.name;
        var PHONE_NUMBER_ID =
          req.body.values[0].changes[0].value.metadata.phone_number_id;
    var PHONE_NUMBER_ID =
    req.body.values[0].changes[0].value.metadata.phone_number_id;
    const settingData = await recruiterSettings.findOne({
        where: { phoneNumberId: PHONE_NUMBER_ID },
      });
    console.log(settingData);
    mywhere={
        createdAt: {
          [Op.and]: [
            Sequelize.literal(`date_trunc('day', "createdAt") = '${dateObj.toISOString().slice(0, 10)}'`),
            Sequelize.literal(`extract(month from "createdAt") = ${dateObj.getMonth() + 1}`),
            Sequelize.literal(`extract(year from "createdAt") = ${dateObj.getFullYear()}`)
          ]
        },
        PHONE_NUMBER_ID:settingData.phoneNumberId,
        phoneNumber:from,
        from:from,
        mainId:settingData.mainId
      }
    var myhistory=await recruiterMessageActivity.findOne({where:mywhere});
    if(!myhistory){
    recruiteWallet.findOne({where:{mainId:settingData.mainId}}).then(data=>{
        if(data){
        if(data.remainingMessages==0){
            res.status(200).json({status:false,message:"No More Credit Left !"});
        }
        else{
            next();
        }
    }
    else{
        res.status(200).json({status:false,message:"No More Credit Left !"});
    }
    });
}
else{
    next();
}
    }
};