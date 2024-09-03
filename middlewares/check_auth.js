const jwt = require("jsonwebtoken");
const recruiter = require("../models/recruiter");
const user=require("../models/user")
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
// console.log(decodedToken);
            var myuser=await recruiter.findOne({where:{userId:decodedToken.user_id},include:[user]});
            if(myuser&&myuser.user.isActive==true){
            // console.log(myuser.firstName);
            if(myuser){
                req.userId=decodedToken.user_id;
                req.mainId=myuser.mainId;
                req.recruiterId=myuser.id;
                req.roleName=myuser.user.roleName;
                req.companyType=decodedToken.companyType;
                next();
            }
            else{
                res.status(401).json({status:false,message:"Invalid user"})
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