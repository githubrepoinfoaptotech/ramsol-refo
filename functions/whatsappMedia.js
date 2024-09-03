const recruiterSettings=require("../models/recruiterSettings");
const http = require("axios").default; 
exports.mediaUpload=async(req,file)=>{
    console.log("in");
    console.log(file);
//     var settings = await recruiterSettings.findOne({
//         where: { mainId: req.mainId },
//      });
//         const FB_BASE_URL = settings.fbBaseUrl;
//         const PHONE_NUMBER_ID = settings.phoneNumberId;
//         const WHATSAPP_TOKEN = settings.waToken;
// //  http
// //  .post(
// //    FB_BASE_URL + PHONE_NUMBER_ID + "/media",
// //    {
// //      messaging_product: "whatsapp",
// //      file: {value:fs.createReadStream(file.path),options:{filename:file.name,contentType:file.type}},
// //    },
   
// //    {
// //      headers: {
// //        "Content-Type": "application/json",
// //        Authorization: "Bearer " + WHATSAPP_TOKEN,
// //      },
// //    }
// //  ).then(fileData=>{
// //    req.mediaId=fileData.id;
// //    next();
// //  });
}