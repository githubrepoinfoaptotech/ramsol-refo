//models

const statusCode=require('../models/statusList')

//

exports.addCode=async(req,res)=>{
    statusCode.findOne({where:{statusCode:req.body.code}}).then(async data=>{
        if(data){
            res.status(200).json({status:false,message:"Code Already Exist"});
        }
        else{
            await statusCode.create({
                statusCode:req.body.code,
                statusName:req.body.name,
                statusType:req.body.type,
                statusDescription:req.body.description
            });
            res.status(200).json({status:true,message:"Code Added Successfully"});
        }
    }).catch(e=>{
        console.log(e);
        res.status(500).json({status:false,message:"Error"})});
};

exports.editCode=async(req,res)=>{
    statusCode.findOne({where:{id:req.body.id}}).then(async data=>{
        await data.update({title:req.body.code});
        res.status(200).json({status:true,message:"Code Added Successfully"});   
    }).catch(e=>{
        res.status(500).json({status:false,message:"Error"})});
};



