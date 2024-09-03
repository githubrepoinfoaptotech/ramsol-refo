const pricing=require("../models/pricing");

const { Op, col } = require('sequelize');
exports.addPrice=async(req,res)=>{
    try {
        const {numberOfMessages,amount,description}=req.body;
        pricing_data=await pricing.findOne({order:[['DESC',uniqueId]]});
        if (pricing_data) {
            var pricingInt = requnidata.requirementInt + 1;
            var pricingText = "PLAN";
          } else {
            var pricingInt = 10001;
            var pricingText = "PLAN";
          }
        var uniqueId = `${pricingText}${pricingInt}`;
        pricing.create({
            numberOfMessages:numberOfMessages, 
            amount:amount,
            description:description,
            title:req.body.title
        }).then(data=>{
            res.status(200).json({message:"Created Successfully",status:true,data:data})
        })
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({message:"Error",status:false});
    }
};

exports.editPrice=(req,res)=>{
    try {
        const {id,numberOfMessages,amount,description}=req.body;
        pricing.findOne({where:{id:id}}).then(data=>{
            if(data){
                data.update({
                    numberOfMessages:numberOfMessages,
                    amount:amount,
                    description:description,
                    title:req.body.title
                }).then(()=>{
                    res.status(200).json({message:"Updated Sucessfully",status:true})
                })
            }else{
                res.status(200).json({message:"Item Not Found",status:false});
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false});
    }
};

exports.viewAllPricing=(req,res)=>{
    try {
        const limit=50;
        const {page}=req.body;
        pricing.findAndCountAll({limit:limit,page:(page*limit)-limit,order:[['pricingInt','ASC']]}).then(data=>{
            res.status(200).json({data:data.rows,status:true,count:data.count});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false});
    }
};

exports.viewPricing=(req,res)=>{
    try {
        const {id}=req.body;
        pricing.findOne({where:{id:id}}).then(data=>{
            res.status(200).json({data:data,status:true});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false});
    }
};

exports.pricingList=(req,res)=>{
    try {
        pricing.findAndCountAll({where:{pricingInt:{[Op.gt]:10002}},attributes:['amount','id','numberOfMessages','title','description'],order:[['pricingInt','ASC']]}).then(data=>{
            res.status(200).json({data:data.rows,status:true,count:data.count});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false});
    }
};