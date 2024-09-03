const chatController = require("../controllers/chatController");
const express = require("express");
const route = express.Router();
require("dotenv").config();
const multer=require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path=require('path');
const check_auth_admin = require("../middlewares/check_auth_admin");
const check_auth = require("../middlewares/check_auth");
const Fn=require("../functions/whatsappMedia");
const wallet=require("../functions/messageValidation");
const storage = new aws.S3({
  accessKeyId: process.env.s3_id,
  secretAccessKey: process.env.s3_key,
});
// const  upload = multer({
//   storage: multerS3({
//       s3: storage,
//       acl: 'public-read',
//       bucket: 'refo/media',
//       key: function (req, file, cb) {
//         Fn.mediaUpload(req,file);
//           if (!file.originalname.match(/\.(png|jpg|docx|doc|pdf)$/)) { 
//             // upload only png and jpg format
//             return cb(new Error('Please upload a another file'))
//           }
//           else{
//           cb(null,Date.now() +'_'+req.userId+path.extname(file.originalname)); //use Date.now() for unique file keys
//           }
//       }
//   })
// });
const fileStorage = multer.diskStorage({
    // Destination to store image      
    destination: 'media', 
      filename: async(req, file, cb) => {
        await Fn.mediaUpload(req,file);
          cb(null, Date.now() +'_'+req.userId
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});
const fileUpload = multer({
    storage: fileStorage,
    limits: {
      fileSize: 25000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|docx|doc|pdf)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a another file'))
       }
     cb(undefined, true) 
  }
});

route.post("/sendMessage", check_auth,chatController.sendMessage);
route.post(
  "/sendTemplateMessage",
  check_auth,
  wallet.checkInimessage,
  chatController.sendTemplateMessage
);
route.post("/getChatUsers", check_auth_admin, chatController.getChatUsers);
route.get("/getChatUserMessages", check_auth,chatController.getChatUserMessages);
//route.post("/receiveMessage", chatController.receiveMessage);
route.post("/searchChat", check_auth,chatController.searchChat);
route.post("/getOneChatUser", check_auth,chatController.getOneChatUser); 
route.post('/getIniChat',check_auth,chatController.getIniChat);
route.post('/sendImage',check_auth,fileUpload.single("file"),chatController.sendImage);
route.post('/sendDocument',check_auth,fileUpload.single("file"),chatController.sendDocument);
module.exports = route;
