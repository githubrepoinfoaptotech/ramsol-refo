const Source = require("../models/source");

exports.addSource=async (req,res)=>{
    try {
        const {name}=req.body;
        var source_data=await Source.findOne({where:{ 
            mainId:req.mainId,
            name:name
        }});
        if(!source_data){
        Source.create({ 
            mainId:req.mainId,
            name:name
        }).then(()=>{
            res.status(200).json({message:"Source Created Successfully ",status:true})
        });
    }
    else{
        res.status(200).json({message:"Source Already Exist",status:false})
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false})
    }
}

exports.changeState=(req,res)=>{
    try {
        console.log(req.body);
        const {id}=req.body;
       Source.findOne({where:{id:id,mainId:req.mainId}}).then(data=>{
        if(data){
            if(data.status==true){
                data.update({status:false});
                res.status(200).json({message:"Inactive Successfully",status:true})
            }else{
                data.update({status:true});
                res.status(200).json({message:"Active Successfully",status:true})
            }
        }else{
            res.status(200).json({message:"Not Found",status:true})
        }
       })

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false})
    }
}

exports.editSource=(req,res)=>{
    try {
        const {id,name}=req.body;
        Source.findOne({where:{id:id}}).then(data=>{
            if(data){
                data.update({
                    mainId:req.mainId,
                    name:name
                }).then(()=>{
                    res.status(200).json({message:"Edited Successfully",status:true})
                }) 
            }else{
                res.status(200).json({message:"Item Not Found",status:false});
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false})
    }
}
exports.viewSourcesEditList=(req,res)=>{
    try {
        Source.findAndCountAll({where:{mainId:req.mainId},attributes:["id","name"]}).then(data=>{
            if(data){

            }
            res.status(200).json({data:data.rows,status:true,count:data.count});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false})
    }
}
exports.viewAllSources=(req,res)=>{
    try {
        Source.findAndCountAll({where:{mainId:req.mainId},order:[['createdAt','DESC']]}).then(data=>{
            res.status(200).json({data:data.rows,status:true,count:data.count});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false})
    }
}

exports.viewSourcesList=(req,res)=>{
    try {
        Source.findAndCountAll({where:{mainId:req.mainId,status:true},attributes:["id","name"]}).then(data=>{
            if(data){

            }
            res.status(200).json({data:data.rows,status:true,count:data.count});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false})
    }
}

exports.viewSource=(req,res)=>{
    try {
        const {id}=req.body;
        Source.findOne({where:{id:id,mainId:req.mainId}}).then(data=>{
            if(data){
                res.status(200).json({data:data,status:true})
            }else{
                res.status(200).json({data:[],status:false})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error",status:false})
    }
}
