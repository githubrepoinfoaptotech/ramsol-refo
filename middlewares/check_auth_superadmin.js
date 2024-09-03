const jwt = require("jsonwebtoken");
const user = require("../models/user");
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
            var myuser=await user.findOne({where:{id:decodedToken.user_id}});

            if(myuser&&myuser.roleName=="SUPERADMIN"){
                req.userId=decodedToken.user_id
                next();
            }
            else{
                res.status(401).json({status:false,message:"Invalid user"});
            }
    }   
    catch(err){
        res.status(401).json({msg:"Invalid token or token expires"});
    }
}