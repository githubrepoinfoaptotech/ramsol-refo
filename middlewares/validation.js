const Joi = require("joi");


exports.addAdminValidation=async(req,res,next)=>{
    const addAdminSchema= Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(8).max(256).required(),
        firstName:Joi.string().alphanum().required(),
        lastName:Joi.string().alphanum().required(),
        companyName:Joi.string().alphanum().required(),
        mobile:Joi.number()
    });
    compObj={
        email:req.body.email,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        companyName:req.body.companyName,
        mobile:req.body.mobile
    }
   const  {error,value}= addAdminSchema.validate(compObj);
   if(error){
    console.log(error);
    res.status(500).json({status:false,message:error.details[0].message});
   }
   else{
    next();
   }
};
exports.editAdminValidation=async(req,res)=>{
    const editAdminSchema= Joi.object({
        email:Joi.string().email().required(),
        firstName:Joi.string().alphanum().required(),
        lastName:Joi.string().alphanum().required(),
        companyName:Joi.string().alphanum().required(),
        employeeId:Joi.string(),
        mobile:Joi.number()
    });
    compObj={
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        companyName:req.body.companyName,
        employeeId:req.body.employeeId,
        mobile:req.body.mobile
    };
    const  {error,value}= editAdminSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(500).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }

};
exports.addOrgRecValidation=async(req,res,next)=>{
    const addOrgSchema= Joi.object({
        email:Joi.string().email().required(),
        name:Joi.string().required(),
        mobile:Joi.number().required(),
        clientId:Joi.string().required(),
    });
    compObj={
        email:req.body.email,
        name:req.body.name,
        mobile:req.body.mobile,
        clientId:req.body.clientId,
    };
    const  {error,value}= addOrgSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(200).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }
};



exports.editOrgRecValidation=async(req,res,next)=>{

    const addOrgSchema= Joi.object({
        email:Joi.string().email().required(),
        name:Joi.string().required(),
        mobile:Joi.number().required(),
        id:Joi.string().required(),
    });
    compObj={
        email:req.body.email,
        name:req.body.name,
        mobile:req.body.mobile,
        id:req.body.id,
    };
    const  {error,value}= addOrgSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(200).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }
};
exports.addHiringLevelValidation=async(req,res,next)=>{
    const addOrgSchema= Joi.object({
        name:Joi.string().required(),
        noOfHires:Joi.number().required().messages({
            'number.base': 'Number of hires should be a type of number',
            'number.empty': 'Number of hires is required',
            'any.required': 'Number of hires is required'
        }),
        clientId:Joi.string().required(),
    });
    compObj={
        name:req.body.name,
        noOfHires:req.body.noOfHires,
        clientId:req.body.clientId,
    };
    const  {error,value}= addOrgSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(200).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }
};
exports.editHiringLevelValidation=async(req,res,next)=>{

    const addOrgSchema= Joi.object({
        name:Joi.string().required(),
        noOfHires:Joi.number().required().messages({
            'number.base': 'Number of hires should be a type of number',
            'number.empty': 'Number of hires is required',
            'any.required': 'Number of hires is required'
        }),
        id:Joi.string().required(),
    });
    compObj={
        name:req.body.name,
        noOfHires:req.body.noOfHires,
        id:req.body.id,
    };
    const  {error,value}= addOrgSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(200).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }
};
exports.companySettingsValidation=async(req,res,next)=>{
    const recruiterSettingSchema= Joi.object({
        fbBaseUrl:Joi.string(),
        phoneNumberId:Joi.string(),
        waToken:Joi.string(), 
        recruiterId:Joi.string(), 
    });
    var compObj={
        recruiterId:req.body.recruiterId
    };
    if(req.body.fbBaseUrl){
        compObj.fbBaseUrl=req.body.fbBaseUrl
    }
    if(req.body.phoneNumberId){
        compObj.phoneNumberId=req.body.phoneNumberId
    }
    if(req.body.waToken){
        compObj.waToken=req.body.waToken
    }
    const  {error,value}= recruiterSettingSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(200).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }
};

exports.addClientValidation=async(req,res,next)=>{
    var clientSchema;
    if(req.companyType=="COMPANY")
           {
        clientSchema= Joi.object({
           clientName:Joi.string().required(),
           handlerId:Joi.string().required(),
           clientIndustry:Joi.string().required(),
           reasonForHiring:Joi.string().required(),
           projectRegion:Joi.string().required(),
           projectLocation:Joi.string().required(),
           hrbpCode:Joi.string().required(),
           aggStartDate:Joi.required(), 
           aggEndDate:Joi.required()
       });
       var compObj={
           clientName:req.body.clientName,
           hrbpCode:req.body.hrbpCode,
           handlerId:req.body.handlerId,
           projectLocation:req.body.projectLocation,
           reasonForHiring:req.body.reasonForHiring,
           projectRegion:req.body.projectRegion,
           clientIndustry:req.body.clientIndustry,
           aggStartDate:req.body.aggStartDate,
           aggEndDate:req.body.aggEndDate
       };
       }
       else{
        clientSchema= Joi.object({
           clientName:Joi.string().required(),
           clientIndustry:Joi.string().required(),
           clientWebsite:Joi.string().required(), 
           aggStartDate:Joi.required(), 
           aggEndDate:Joi.required()
       });
       var compObj={
           clientName:req.body.clientName,
           clientIndustry:req.body.clientIndustry,
           clientWebsite:req.body.clientWebsite,
           aggStartDate:req.body.aggStartDate,
           aggEndDate:req.body.aggEndDate
       };
       }
       const  {error,value}= clientSchema.validate(compObj);
       if(error){
           console.log(error);
        res.status(200).json({status:false,message:error.details[0].message});
       }
       else{
        next();
       }
   };
exports.addRequirementValidation=async(req,res,next)=>{
    if(req.companyType=="COMPANY")
        {
            const requirementSchema= Joi.object({
                requirementName:Joi.string().required(),
                jobLocation:Joi.string().required(),
                skill:Joi.string().required(),
                experience:Joi.string().required()   
            });
            var compObj={
                requirementName:req.body.requirementName,
                skill:req.body.skills,
                jobLocation:req.body.jobLocation,
                experience:req.body.experience
            };
            const  {error,value}= requirementSchema.validate(compObj);
            if(error){
                console.log(error);
             res.status(200).json({status:false,message:error.details[0].message});
            }
            else{
             next();
            }
        }
        else{
            const requirementSchema= Joi.object({
                clientName:Joi.string().required(),
                organisationRecruiter:Joi.string().required(),
                requirementName:Joi.string().required(),
                jobLocation:Joi.string().required(),
                skill:Joi.string().required(),
                experience:Joi.string().required()   
            });
            var compObj={
                clientName:req.body.clientId,
                organisationRecruiter:req.body.orgRecruiterId,
                requirementName:req.body.requirementName,
                skill:req.body.skills,
                jobLocation:req.body.jobLocation,
                experience:req.body.experience
            };
            const  {error,value}= requirementSchema.validate(compObj);
            if(error){
                console.log(error);
             res.status(200).json({status:false,message:error.details[0].message});
            }
            else{
             next();
            }
        }
    
};

exports.addCandidateValidation=(req,res,next)=>{
    const candidateSchema= Joi.object({
        requirementName:Joi.string().required(),
        source:Joi.string().required(),
        mobile:Joi.string().required(),
        email:Joi.string().required(),
        skill:Joi.string().required(),
        //experience:Joi.string().required(),
        firstName:Joi.string().required(),
        lastName:Joi.string().required(),
        gender:Joi.string().required()
    });
    var compObj={
        requirementName:req.body.requirementId,
        source:req.body.sourceId,
        mobile:req.body.mobile,
        skill:req.body.skills,
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        //experience:req.body.experience,
        gender:req.body.gender
    };
    const  {error,value}= candidateSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(200).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }
};

exports.addSourceValidation=async(req,res,next)=>{
    const sourceSchema=Joi.object({
        sourceName:Joi.string().required()
    });
    var compObj={
        sourceName:req.body.name
    };
    const  {error,value}= sourceSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(200).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }
};

exports.addPurchaseValidation=async(req,res,next)=>{
    const purchaseSchema=Joi.object({
        company:Joi.string().required(),
        paymentMethod:Joi.string().required(),
        pricing:Joi.string().required()
    });
    var compObj={
        company:req.body.mainId,
        paymentMethod:req.body.paymentTypes,
        pricing:req.body.pricingId
    };
    const  {error,value}= purchaseSchema.validate(compObj);
    if(error){
        console.log(error);
     res.status(200).json({status:false,message:error.details[0].message});
    }
    else{
     next();
    }
}

//HOLD
//Process Later