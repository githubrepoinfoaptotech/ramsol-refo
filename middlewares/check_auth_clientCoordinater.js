const jwt = require("jsonwebtoken");
const recruiter=require("../models/recruiter");
const user = require("../models/user");
const { where } = require("sequelize");
require("dotenv").config();


module.exports = async (req,res,next) => {
   try { 
        
        if (!req.headers['authorization']){
            return res.status(403).send({ 
                auth: false, message: 'No token provided.' 
            });
        }
        let token =  req.headers['authorization'].split(' ')[1];


       //const token = req.headers.authorization.split(" ")[1];
 
            const decodedToken =  jwt.verify(token, process.env.jwtKey);
            var myuser=await recruiter.findOne({where:{userId:decodedToken.user_id},include:[user]});
            
            if(myuser&&myuser.user.isActive==true){
            // var useraccess=await recruiterAccess.findOne({where:{page:req.url,recruiterId:decodedToken.user_id}});
            if(myuser&&(myuser.user.roleName=="CLIENTCOORDINATOR"||myuser.user.roleName=="ADMIN"))
            {
                req.userId=decodedToken.user_id;
                req.mainId=myuser.mainId;
                req.recruiterId=myuser.id;
                req.roleName=myuser.user.roleName;
                req.companyType=decodedToken.companyType;
                next();
            }
            // else if (myuser&&useraccess){
            //     req.userid=decodedToken.user_id
            //     next();
            // }
            else{
                res.status(401).json({status:false,message:"Invalid user"});
            }
            }
        else{
            res.status(401).json({ status: false, message: "User Inactive" });
        }
    }   
    catch(err){
        res.status(401).json({msg:"Invalid token or token expires"});
    }
}