const express = require('express');
const route = express.Router();

const aiController=require("../controllers/usingAiControllers");
const extractText=require('../middlewares/extractText');
const check_auth=require('../middlewares/check_auth');
route.post('/resumePraser',extractText.resumeUpload,aiController.resumePraser);
route.post('/jdmatcher',check_auth,aiController.jdmatcher);
route.post('/resumeUpload',check_auth,extractText.textExtract,aiController.uploadResume); 
route.post('/resume_jd_match',extractText.extractFromLink,aiController.resume_jd_match);
route.post('/getCanididateResumeInfo',check_auth,aiController.getCanididateResumeInfo);
route.post('/resume_and_gist_match',extractText.textExtract,aiController.resume_jd_match);
module.exports = route;     
