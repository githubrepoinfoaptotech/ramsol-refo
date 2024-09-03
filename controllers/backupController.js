const candidateDetails = require("../models/candidateDetail");
const candidate = require("../models/candidate");
const requirement = require("../models/requirement");
const candidateStatus = require("../models/myCandidateStatus");
const user=require("../models/user");
const recruiter=require("../models/recruiter");
const client=require("../models/client");
const freeCandidateMessageActivity=require("../models/freeCandidateMessageActivity");
const Source = require("../models/source");
const orgRecruiter=require("../models/orgRecruiter");
const supportTicket=require("../models/supportTicket");
const backupFunction=require("../functions/backupGenerateXL");
const recruiterMessageActivity=require("../models/recruiterMessageActivity");
const candidateNotes=require("../models/candidateNotes");
const chatUser=require("../models/chatUser");
const recruiterTransaction=require("../models/recruiterTransaction");
const recruiterSetting=require("../models/recruiterSettings");
const recruiterCandidateActivity=require("../models/recruiterCandidateActivity");
const existingCandidate=require("../models/existingCandidate");
const assignRequirements=require("../models/assignedRequirement");
const fs =require("fs");
const rimraf = require('rimraf');
const AdmZip = require('adm-zip');
const path=require('path');
const XLSX = require('xlsx'); 
const AWS = require("aws-sdk");
const recruiterSettings = require("../models/recruiterSettings");
const StreamZip = require('node-stream-zip');
exports.backupData=async(req,res)=>{
    try{
    const myCompanyName=await recruiter.findOne({where:{mainId:req.mainId,userId:req.mainId}});
    var myBackupArr=[];
    const user_data=await user.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"user",data:user_data});
    const recruiter_data=await recruiter.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"recruiter",data:recruiter_data});
    const candidate_data=await candidate.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"candidate",data:candidate_data});
    const cadidateDetails_data=await candidateDetails.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"candidateDetails",data:cadidateDetails_data});
    const requirement_data=await requirement.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"requirement",data:requirement_data});
    const candidateStatus_data=await candidateStatus.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"candidateStatus",data:candidateStatus_data});
    const client_data=await client.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"client",data:client_data});
    const freeCandidateMessageActivity_data=await freeCandidateMessageActivity.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"freeCandidateMessageActivity",data:freeCandidateMessageActivity_data});
    const source_data=await Source.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"source",data:source_data});
    const orgRecruiter_data=await orgRecruiter.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"orgRecruiter",data:orgRecruiter_data});
    const recruiterMessageActivity_data=await recruiterMessageActivity.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"recruiterMessageActivity",data:recruiterMessageActivity_data});
    const candidateNotes_data=await candidateNotes.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"candidateNotes",data:candidateNotes_data});
    const recruiterTransaction_data=await recruiterTransaction.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"recruiterTransaction",data:recruiterTransaction_data});
    const recruiterSetting_data=await recruiterSetting.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"recruiterSetting",data:recruiterSetting_data});
    const recruiterCandidateActivity_data=await recruiterCandidateActivity.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"recruiterCandidateActivity",data:recruiterCandidateActivity_data});
    const assignRequirements_data=await assignRequirements.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"assignRequirements",data:assignRequirements_data});
    const existingCandidate_data=await existingCandidate.findAll({where:{mainId:req.mainId}});
    myBackupArr.push({model:"existingCandidate",data:existingCandidate_data});
    await backupFunction.generateXL(req,myCompanyName.companyName).then(async (data)=>{
        if(data){
            // res.status(200).json({status:true,message:"Backup Compleate"});
            var isDone=await backupFunction.databaseBackup(req,myBackupArr,myCompanyName.companyName);
            if(isDone.status==true){
                res.status(200).json({status:true,message:"Backup Compleate"});
            }
            else{
                res.status(200).json({status:false,message:"Some problem occured wihle backing up please try again later!!"});
            }
        }
        else{
            res.status(200).json({status:false,message:"Some problem occured wihle backing up please try again later!!"});
        }
    });
    }
    catch(e){
        console.log(e);
        res.status(500).json({status:false,messahe:"Interal Server Error"});
    };
};



// exports.backupIsExist=async(req,res)=>{
//     var dir = "./backup/" + req.mainId + "/";
//     if (fs.existsSync(dir)) {
//         res.status(200).json({status:true,link:"/backup/" + req.mainId + "/"});
//     }
//     else{
//         res.status(200).json({status:false});
//     }
// };

exports.inactiveBackup=async(req,res)=>{
    try{
    // const user_data=await user.destroy({where:{mainId:req.mainId}});
    // const recruiter_data=await recruiter.destroy({where:{mainId:req.mainId}});
    await candidateStatus.destroy({where:{mainId:req.mainId}});
    await candidate.destroy({where:{mainId:req.mainId}});
    await candidateDetails.destroy({where:{mainId:req.mainId}});
    await requirement.destroy({where:{mainId:req.mainId}});
    await orgRecruiter.destroy({where:{mainId:req.mainId}});
    await client.destroy({where:{mainId:req.mainId}});
    await freeCandidateMessageActivity.destroy({where:{mainId:req.mainId}});
    await Source.destroy({where:{mainId:req.mainId}});
    await recruiterMessageActivity.destroy({where:{mainId:req.mainId}});
    await candidateNotes.destroy({where:{mainId:req.mainId}});
    await recruiterCandidateActivity.destroy({where:{mainId:req.mainId}});
    await existingCandidate.destroy({where:{mainId:req.mainId}});
    await assignRequirements.destroy({where:{mainId:req.mainId}});
   // await chatUser.destroy({where:{mainId:req.mainId}});
    backupFunction.deleteS3ResumesFolder(req);
    backupFunction.deleteS3RequirementsFolder(req);
    var dir = "./backup/" + req.mainId + "/";
    var zipDir="./zip/" + req.mainId + "/";
    deleteFolder(dir);
    deleteFolder(zipDir);
    await user.update({isDelete:"YES"},{where:{id:req.mainId}});
    res.status(200).json({status:true,message:"Deleted!"});
    }
   catch(e){
    console.log(e);
    res.status(500).json({status:false,messahe:"Interal Server Error"});
   }
};
exports.inactiveUserSuperAdmin=async(req,res)=>{
    try{
        await user.update({isDelete:"YES-Support"},{where:{id:req.body.mainId}});
         await recruiter.destroy({where:{mainId:req.body.mainId}});
         await user.destroy({where:{mainId:req.body.mainId}});
         await recruiterSetting.findAll({where:{mainId:req.body.mainId}});
         res.status(200).json({status:true});
    }
    catch(e){
        console.log(e);
        res.status(500).json({status:false,messahe:"Interal Server Error"});
       }
};
exports.resumeBackup=async(req,res)=>{
  try{
  var dir = "./backup/" + req.mainId + "/";
  var zipDir="./zip/" + req.mainId + "/";
  if (fs.existsSync(zipDir)) {
    deleteFolder(zipDir);
    }
    if(fs.existsSync(dir)){
      deleteFolder(dir);
    }
  await backupFunction.s3Backup(req);
  res.status(200).json({status:true,message:"Backup Compleate"});
}
catch(e){
  console.log(e);
  res.status(500).json({status:false,messahe:"Interal Server Error"});
 }
};



exports.archiveDownload=async(req,res)=>{
  try{
  const myCompanyName=await recruiter.findOne({where:{mainId:req.mainId,userId:req.mainId}});
  var isDone=await backupFunction.zipfolder(req,myCompanyName.companyName);
    if(isDone.status==true){
        res.status(200).json({status:true,message:"Backup Compleate",link:isDone.path});
    }
    else{
        res.status(200).json({status:false,message:"Some problem occured wihle backing up please try again later!!"});
    }
  }
  catch(e){
    console.log(e);
    res.status(500).json({status:false,messahe:"Interal Server Error"});
   }
};
// exports.inactiveBackupFile=async(req,res)=>{
//     try{
//     var dir = "./backup/" + req.mainId + "/";
//     if (fs.existsSync(dir)) {
//         fs.readdirSync(dir).forEach((file) => {
//             const curPath = dir + '/' + file;
//             if (fs.lstatSync(curPath).isDirectory()) {
//               deleteFolder(curPath); // Recursively delete subdirectories
//             } else {
//               fs.unlinkSync(curPath); // Delete files
//             }
//           });
//           fs.rmdirSync(dir); // Delete the empty directory
//           res.status(200).json({status:true,message:"Done"});
//     }
// }
// catch(e){
//     console.log(e);
//     res.status(500).json({status:false,messahe:"Interal Server Error"});
//    }
// };

exports.SupportRestoreBackup=async(req,res)=>{
  try {
    console.log(req.file);
    const zip = new StreamZip({
      file: req.file.path,
      storeEntries: true
    });
  
    zip.on('ready', () => {
      const zipEntries = Object.values(zip.entries());
      const foldName = req.file.originalname.split('_')[0];
      const targetPath = './' + foldName;
  
      // Ensure the target folder exists before extraction
      fs.mkdirSync(targetPath, { recursive: true });
  
      zipEntries.forEach((zipEntry) => {
        console.log(zipEntry);
        console.log(zipEntry.isDirectory);
        if (!zipEntry.isDirectory) {
          const entryName = zipEntry.name;
          const entryPath = path.join(targetPath, entryName);
          const entryDir = path.dirname(entryPath);
  
          // Ensure the entry's directory exists before extraction
          fs.mkdirSync(entryDir, { recursive: true });
  
          // Extract the file to the desired location
          zip.extract(entryName, entryPath, (err) => {
            if (err) {
              console.error('Failed to extract file:', entryName);
            } else {
              console.log('File extracted:', entryName);
            }
          });
        }
      });
  
      zip.close();
      deleteFolder('./restoreBackup');
      res.status(200).json({ status: true, message: 'File Restored', foldername: './' + foldName });
    });
  
    zip.on('error', (err) => {
      console.error('Error while processing ZIP file:', err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    });
  } catch (e) {
    console.error('Error during ZIP extraction:', e);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

exports.supportRestoreDatabase=async(req,res)=>{
  try{
    
    await uploadS3files(req);
    await backupFunction.dataBaseRestoreSupport(req);
    await user.update({isDelete:"NO"},{where:{isDelete:"YES-Support"}});
    deleteFolder(req.body.foldName);
    res.status(200).json({status:true,message:"Database Restored"});
}
catch(e){
  console.log(e);
  res.status(500).json({status:false,messahe:"Interal Server Error"});
}
}
exports.clientRestoreBackup=async(req,res)=>{
  try {
    console.log(req.file);
    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();
    const foldName = req.file.originalname.split('_')[0];
    const targetPath = './' + foldName;
  
    // Ensure the target folder exists before extraction
    fs.mkdirSync(targetPath, { recursive: true });
  
    zipEntries.forEach((zipEntry) => {
      if (!zipEntry.isDirectory) {
        const entryNameParts = zipEntry.entryName.split('/');
        const folders = entryNameParts.slice(0, entryNameParts.length - 1);
        const entryPath = path.join(targetPath, ...folders);
        
        // Ensure the entry's directory exists before extraction
        fs.mkdirSync(entryPath, { recursive: true });
  
        try {
          zip.extractEntryTo(zipEntry, entryPath, false, true);
          console.log('File extracted:', zipEntry.entryName);
        } catch (err) {
          console.error('Failed to extract file:', zipEntry.entryName);
        }
      }
    });
  
    
    res.status(200).json({ status: true, message: 'File Restored', foldername: './' + foldName });
  } catch (e) {
    console.error('Error during ZIP extraction:', e);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

exports.clientrestoreDataBase=async(req,res)=>{
  try{
    console.log(req.body);
    deleteFolder('./restoreBackup');
    await user.findOne({where:{id:req.mainId}}).then(async data=>{
      if(data.isDelete=="YES"){
       await uploadS3files(req);
       await backupFunction.dataBaseRestoreClient(req);
       await user.update({isDelete:"NO"},{where:{id:req.mainId}});
       deleteFolder(req.body.foldName);
      
   res.status(200).json({status:true,message:"Database Restored"});
}
else{
  res.status(200).json({status:false,message:"Your data already exist please recheck before uploading!"})
}
    });
}
catch(e){
  console.log(e);
  res.status(500).json({status:false,messahe:"Interal Server Error"});
}
};

//functions


function deleteFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = folderPath + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) { 
          deleteFolder(curPath); // Recursively delete subdirectories 
        } else { 
          fs.unlinkSync(curPath); // Delete files
        }
      });
      fs.rmdirSync(folderPath); // Delete the empty directory
    } 
  };
  

  async function uploadS3files(req){ 
    const s3 = new AWS.S3({
      accessKeyId: process.env.liveS3Id,
      secretAccessKey: process.env.liveS3Key,
    });
    fs.readdirSync(req.body.foldName+"/"+"resumes"+"/").forEach(async file=>{
      if (path.extname(file).toLowerCase() === '.pdf'||path.extname(file).toLowerCase() === '.docx' ||path.extname(file).toLowerCase() === '.doc'){
      const data=await fs.readFileSync(req.body.foldName+"/"+"resumes"+"/"+file); 
      // Set the S3 upload parameters
      const filePath="resumes"+"/"+req.mainId+"/"+file;
      const uploadParams = {
        Bucket: 'ramsol-production-refo',
        Key: filePath, // Desired S3 file name
        Body: data
      };
      // Upload the file to S3
      s3.upload(uploadParams, (err, result) => {
        if (err) {
          console.error('Error uploading file:', err);
          return;
        }
      });
    }
    });
    fs.readdirSync(req.body.foldName+"/"+"requirement"+"/").forEach(async file=>{
      if (path.extname(file).toLowerCase() === '.pdf'||path.extname(file).toLowerCase() === '.docx' ||path.extname(file).toLowerCase() === '.doc'){
      const data=await fs.readFileSync(req.body.foldName+"/"+"requirement"+"/"+file); 
      // Set the S3 upload parameters
      const filePath="requirement"+"/"+req.mainId+"/"+file;
      const uploadParams = {
        Bucket: 'ramsol-production-refo',
        Key: filePath, // Desired S3 file name
        Body: data
      };
      // Upload the file to S3
      s3.upload(uploadParams, (err, result) => {
        if (err) {
          console.error('Error uploading file:', err);
          return;
        }
      });
    }
    });
  }