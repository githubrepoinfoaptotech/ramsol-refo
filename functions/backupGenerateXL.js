const ExcelJS = require('exceljs');
const fs = require('fs');
var archiver = require('archiver');
const AWS = require("aws-sdk");
const util = require('util');
const path=require("path");
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
const writeFileAsync = util.promisify(fs.writeFile);
const existingCandidate=require("../models/existingCandidate");


exports.dataBaseRestoreSupport=async(req)=>{
  var backupPath=req.body.foldName;
  const user_jsonData=fs.readFileSync(backupPath+"/"+"user.json");
  var user_data=JSON.parse(user_jsonData);
 

  const recruiter_jsonData=fs.readFileSync(backupPath+"/"+"recruiter.json");
  var recruiter_data=JSON.parse(recruiter_jsonData);
  

  const recruiterSetting_jsonData=fs.readFileSync(backupPath+"/"+"recruiterSetting.json");
  var recruiterSetting_data=JSON.parse(recruiterSetting_jsonData);
  

  const client_jsonData=fs.readFileSync(backupPath+"/"+"client.json");
  var client_data=JSON.parse(client_jsonData);
  

  const orgRecruiter_jsonData=fs.readFileSync(backupPath+"/"+"orgRecruiter.json");
  var orgRecruiter_data=JSON.parse(orgRecruiter_jsonData);
 

  const requirement_jsonData=fs.readFileSync(backupPath+"/"+"requirement.json");
  var requirement_data=JSON.parse(requirement_jsonData);
 
  

  const source_jsonData=fs.readFileSync(backupPath+"/"+"source.json");
  var source_data=JSON.parse(source_jsonData);


  const candidateDetails_jsonData=fs.readFileSync(backupPath+"/"+"candidateDetails.json");
  var candidateDetails_data=JSON.parse(candidateDetails_jsonData);

  

  const candidate_jsonData=fs.readFileSync(backupPath+"/"+"candidate.json");
  var candidate_data=JSON.parse(candidate_jsonData);
 

  const candidateStatus_jsonData=fs.readFileSync(backupPath+"/"+"candidateStatus.json");
  var candidateStatus_data=JSON.parse(candidateStatus_jsonData);


  const freeCandidateMessageActivity_jsonData=fs.readFileSync(backupPath+"/"+"freeCandidateMessageActivity.json");
  var freeCandidateMessageActivity_data=JSON.parse(freeCandidateMessageActivity_jsonData);
 

  const recruiterMessageActivity_jsonData=fs.readFileSync(backupPath+"/"+"recruiterMessageActivity.json");
  var recruiterMessageActivity_data=JSON.parse(recruiterMessageActivity_jsonData);
  

  const candidateNotes_jsonData=fs.readFileSync(backupPath+"/"+"candidateNotes.json");
  var candidateNotes_data=JSON.parse(candidateNotes_jsonData);
  
  //entries  
  await user.bulkCreate(user_data.data);
  await recruiter.bulkCreate(recruiter_data.data);
  await recruiterSetting.bulkCreate(recruiterSetting_data.data);
  await client.bulkCreate(client_data.data);
  await orgRecruiter.bulkCreate(orgRecruiter_data.data);
  await Source.bulkCreate(source_data.data);
  await requirement.bulkCreate(requirement_data.data);
  await candidateDetails.bulkCreate(candidateDetails_data.data);
  await candidate.bulkCreate(candidate_data.data);
  await candidateStatus.bulkCreate(candidateStatus_data.data);
  await freeCandidateMessageActivity.bulkCreate(freeCandidateMessageActivity_data.data);
  await recruiterMessageActivity.bulkCreate(recruiterMessageActivity_data.data);
  await candidateNotes.bulkCreate(candidateNotes_data.data);
};

exports.dataBaseRestoreClient=async(req)=>{
  var backupPath=req.body.foldName+"/"+"databasebackup";

  const client_jsonData=fs.readFileSync(backupPath+"/"+"client.json");
  var client_data=JSON.parse(client_jsonData);
  

  const orgRecruiter_jsonData=fs.readFileSync(backupPath+"/"+"orgRecruiter.json");
  var orgRecruiter_data=JSON.parse(orgRecruiter_jsonData);
 

  const requirement_jsonData=fs.readFileSync(backupPath+"/"+"requirement.json");
  var requirement_data=JSON.parse(requirement_jsonData);
 
  

  const source_jsonData=fs.readFileSync(backupPath+"/"+"source.json");
  var source_data=JSON.parse(source_jsonData);


  const candidateDetails_jsonData=fs.readFileSync(backupPath+"/"+"candidateDetails.json");
  var candidateDetails_data=JSON.parse(candidateDetails_jsonData);

  

  const candidate_jsonData=fs.readFileSync(backupPath+"/"+"candidate.json");
  var candidate_data=JSON.parse(candidate_jsonData);
 

  const candidateStatus_jsonData=fs.readFileSync(backupPath+"/"+"candidateStatus.json");
  var candidateStatus_data=JSON.parse(candidateStatus_jsonData);


  const freeCandidateMessageActivity_jsonData=fs.readFileSync(backupPath+"/"+"freeCandidateMessageActivity.json");
  var freeCandidateMessageActivity_data=JSON.parse(freeCandidateMessageActivity_jsonData);
 

  const recruiterMessageActivity_jsonData=fs.readFileSync(backupPath+"/"+"recruiterMessageActivity.json");
  var recruiterMessageActivity_data=JSON.parse(recruiterMessageActivity_jsonData);
  

  const candidateNotes_jsonData=fs.readFileSync(backupPath+"/"+"candidateNotes.json");
  var candidateNotes_data=JSON.parse(candidateNotes_jsonData);

  const recruiterCandidateActivity_jsonData=fs.readFileSync(backupPath+"/"+"recruiterCandidateActivity.json");
  var recruiterCandidateActivity_data=JSON.parse(recruiterCandidateActivity_jsonData);

  const existingCandidate_jsonData=fs.readFileSync(backupPath+"/"+"existingCandidate.json");
  var existingCandidate_data=JSON.parse(existingCandidate_jsonData);
  //entries
  await client.bulkCreate(client_data.data);
  await orgRecruiter.bulkCreate(orgRecruiter_data.data);
  await Source.bulkCreate(source_data.data);
  await requirement.bulkCreate(requirement_data.data);
  await candidateDetails.bulkCreate(candidateDetails_data.data);
  await candidate.bulkCreate(candidate_data.data);
  await candidateStatus.bulkCreate(candidateStatus_data.data);
  await freeCandidateMessageActivity.bulkCreate(freeCandidateMessageActivity_data.data);
  await recruiterMessageActivity.bulkCreate(recruiterMessageActivity_data.data);
  await candidateNotes.bulkCreate(candidateNotes_data.data);
  await recruiterCandidateActivity.bulkCreate(recruiterCandidateActivity_data.data);
  await existingCandidate.bulkCreate(existingCandidate_data.data);
};

exports.generateXL=async (req,companyName)=>{

  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  const AWS = require('aws-sdk');
  var todayDate = "("+year + "-" + month + "-" + day+")";
  const filePath = './backup/'+ req.mainId + "/"+companyName+"_"+todayDate+'.xlsx';
  // create new directory
  
  if (fs.existsSync(filePath)) {
      console.log('File already exists. Skipping file creation.');
  } 
  else {
      // Create a new workbook
      const newWorkBook = new ExcelJS.Workbook();
    
      // Add a worksheet
      // Save the workbook as an Excel file
      await newWorkBook.xlsx.writeFile(filePath)
        .then(() => {
          console.log('Empty Excel file created successfully.');
        })
        .catch(error => {
          console.error('Error creating Excel file:', error);
        });
  }
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('./backup/'+ req.mainId + "/"+companyName+"_"+todayDate+'.xlsx');
  try {
      // Fetch data from the User table
      // Extract column names from the fetched data
          var my_clients=await client.findAll({where:{mainId:req.mainId},attributes:['clientName','clientWebsite','clientIndustry','aggStartDate','aggEndDate','uniqueId']});
          var mylength=my_clients.length;
          if(mylength>0){
              const columns = Object.keys(my_clients[0].dataValues).map(key => ({
                  header: key, 
                  key: key,
                  width: 20
              }));
            // Create a new workbook and worksheet 
            const worksheet = await workbook.addWorksheet('clients');
            // Define the headers for the worksheet
            worksheet.columns = columns;
            // Populate the worksheet with data 
          //   await currten_pos.forEach(async ele => {
          //     await worksheet.addRow(ele.toJSON()); S
          //   });
          for(j=0;j<my_clients.length;j++){
              await worksheet.addRow(my_clients[j].toJSON());
          }
          }
          var my_requirement=await requirement.findAll({where:{mainId:req.mainId},seperate:true,attributes:['requirementName','skills','experience','gist','uniqueId']});
          var mylength=my_requirement.length;
          if(mylength>0){
              const columns = Object.keys(my_requirement[0].dataValues).map(key => ({
                  header: key, 
                  key: key,
                  width: 20
              }));
            // Create a new workbook and worksheet 
            const worksheet = await workbook.addWorksheet('requirement');
            // Define the headers for the worksheet
            worksheet.columns = columns;
            // Populate the worksheet with data 
          //   await currten_pos.forEach(async ele => {
          //     await worksheet.addRow(ele.toJSON()); S
          //   });
          for(j=0;j<my_requirement.length;j++){
              await worksheet.addRow(my_requirement[j].toJSON());
          }
          }
          var my_candidates=await candidate.findAll({where:{mainId:req.mainId},seperate:true,attributes:['isAnswered','uniqueId','invoiceValue','invoicedDate','joinedDate','droppedReason','ditchReason','creditNoteReason','offerDeclinedReason']});
          var mylength=my_candidates.length;
          if(mylength>0){
              const columns = Object.keys(my_candidates[0].dataValues).map(key => ({
                  header: key, 
                  key: key,
                  width: 20
              }));
            // Create a new workbook and worksheet 
            const worksheet = await workbook.addWorksheet('candidates');
            // Define the headers for the worksheet
            worksheet.columns = columns;
            // Populate the worksheet with data 
          //   await currten_pos.forEach(async ele => {
          //     await worksheet.addRow(ele.toJSON()); S
          //   });
          for(j=0;j<my_candidates.length;j++){
              await worksheet.addRow(my_candidates[j].toJSON());
          }
          }
          //include:[{model:requirement,attributes:['requirementName','uniqueId']}}]
          var my_candidateDetails=await candidateDetails.findAll({where:{mainId:req.mainId},attributes:{model:candidateDetails,attributes:{exclude: ['id', 'mainId','resume']}}});
          var mylength=my_candidateDetails.length;
          if(mylength>0){
              const columns = Object.keys(my_candidateDetails[0].dataValues).map(key => ({
                  header: key, 
                  key: key,
                  width: 20
              })); 
            // Create a new workbook and worksheet 
            const worksheet = await workbook.addWorksheet('candidateDetails');
            // Define the headers for the worksheet
            worksheet.columns = columns;
            // Populate the worksheet with data 
          //   await currten_pos.forEach(async ele => {
          //     await worksheet.addRow(ele.toJSON()); S
          //   });
          for(j=0;j<my_candidateDetails.length;j++){
              await worksheet.addRow(my_candidateDetails[j].toJSON());
          }
          }
          var my_existingCandidate=await existingCandidate.findAll({where:{mainId:req.mainId}});
          var mylength=my_existingCandidate.length;
          if(mylength>0){
              const columns = Object.keys(my_existingCandidate[0].dataValues).map(key => ({
                  header: key, 
                  key: key,
                  width: 20
              })); 
            // Create a new workbook and worksheet 
            const worksheet = await workbook.addWorksheet('existingCandidate');
            // Define the headers for the worksheet
            worksheet.columns = columns;
            // Populate the worksheet with data 
          //   await currten_pos.forEach(async ele => {
          //     await worksheet.addRow(ele.toJSON()); S
          //   });
          for(j=0;j<my_existingCandidate.length;j++){
              await worksheet.addRow(my_existingCandidate[j].toJSON());
          }
          }
            // Save the workbook as an Excel file 
      console.log("here");
      await workbook.xlsx.writeFile('./backup/'+ req.mainId + "/"+companyName+"_"+todayDate+'.xlsx');
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false 
    }
}

exports.zipfolder=async(req,companyName)=>{
    try{
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var todayDate = "("+year + "-" + month + "-" + day+")";
        const sourceFolder = './backup/'+req.mainId;
        const zipFilePath = './zip/'+req.mainId+"/"+companyName+"_"+todayDate+'.zip';  
        // Create a write stream to the zip file
        const output = fs.createWriteStream(zipFilePath);
      
        // Create a new instance of archiver
        const archive = archiver('zip', {
          zlib: { level: 9 } // Set compression level (optional)
        });
      
        // Listen for 'error' event
        archive.on('error', function(err) {
          throw err; 
        });
      
        // Pipe the output stream to the archive
        archive.pipe(output);
      
        // Add the folder to the archive
        archive.directory(sourceFolder, false);
      
        // Finalize the archive
        archive.finalize();
        
        // Usage
        return {status:true,path:zipFilePath};
    }
    catch(e){
        console.log(e);
        return {sttaus:false};
    }
}
exports.s3Backup=async(req)=>{
  try {
    await createDirectiory(req);
    const s3 = new AWS.S3({
      accessKeyId: process.env.liveS3Id,
      secretAccessKey: process.env.liveS3Key,
    });
    const resumeParams = {
      Bucket: "ramsol-production-refo",
      Prefix: "resumes" + "/" + req.mainId
    };
    const jdParams = {
      Bucket: "ramsol-production-refo",
      Prefix: "requirement" + "/" + req.mainId
    };
    const resumeData = await util.promisify(s3.listObjectsV2).bind(s3)(resumeParams);
    const requirementData=await util.promisify(s3.listObjectsV2).bind(s3)(jdParams);
    const promises1 = resumeData.Contents.map((s3Object) => {
      const s3ObjectParams = {
        Bucket: "ramsol-production-refo",
        Key: s3Object.Key
      };
      return util.promisify(s3.getObject).bind(s3)(s3ObjectParams)
        .then((s3Data) => {
          console.log(s3Object.Key.split("/"));
          const localFilePath = path.join('./backup/' + req.mainId + "/resumes/", s3Object.Key.split("/")[2]);
          return writeFileAsync(localFilePath, s3Data.Body);
        })
        .catch((err) => {
          console.log(err);
          return Promise.reject(err);
        });
    });
    const promises2 = requirementData.Contents.map((s3Object) => {
      const s3ObjectParams = {
        Bucket: "ramsol-production-refo",
        Key: s3Object.Key
      };
      return util.promisify(s3.getObject).bind(s3)(s3ObjectParams)
        .then((s3Data) => {
          console.log(s3Object.Key.split("/"));
          const localFilePath = path.join('./backup/' + req.mainId + "/requirement/", s3Object.Key.split("/")[2]);
          return writeFileAsync(localFilePath, s3Data.Body);
        })
        .catch((err) => {
          console.log(err);
          return Promise.reject(err);
        });
    });
    await Promise.all(promises1);
  } catch (e) {
    console.log(e);
  }
};
async function createDirectiory (req){
    try {
        // Check if the directory already exists
        var dir = "./backup/" + req.mainId;
        var ZipDir="./zip/" + req.mainId;
        var subDir1="./backup/"+req.mainId+"/resumes";
        var subDir2="./backup/"+req.mainId+"/databasebackup";
        var subDir3="./backup/"+req.mainId+"/requirement";
        if (!fs.existsSync(dir)) {
            // Create the directory and any missing parent directories
            fs.mkdirSync(dir, { recursive: true });
            fs.mkdirSync(ZipDir,{recursive:true});
            fs.mkdirSync(subDir1,{recursive:true});
            fs.mkdirSync(subDir2,{recursive:true});
            fs.mkdirSync(subDir3,{recursive:true});
            console.log("Directory is created.");
        }
    } catch (err) {
        console.log(err);
    }
};


exports.deleteS3ResumesFolder=(req)=>
{
  const s3 = new AWS.S3({
    accessKeyId: process.env.liveS3Id,
    secretAccessKey: process.env.liveS3Key,
  });
  var bucketName="ramsol-production-refo";
  const params = {
    Bucket: "ramsol-production-refo",
    Prefix: "resumes"+"/"+req.mainId
  };

  // List all objects in the folder
  s3.listObjects(params, function (err, data) {
    if (err) {
      console.log(err);
      return false;
    }

    if (data.Contents.length === 0) {
      // No objects found, the folder is already empty
      console.log("no data");
      return true;
    }

    // Prepare the objects for deletion
    const objects = data.Contents.map(function (object) {
      return { Key: object.Key };
    });

    // Delete the objects
    s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: objects } }, function (err, delData) {
      if (err) {
        console.log(err);
      } 
      else {
        // If there are more objects to delete, recursively call the function
        if (data.Contents.length === 1000) {
          deleteS3Folder(req);
        } else {
          return true
        }
      } 
    });
  });
};
exports.deleteS3RequirementsFolder=(req)=>
{
  const s3 = new AWS.S3({
    accessKeyId: process.env.liveS3Id,
    secretAccessKey: process.env.liveS3Key,
  });
  var bucketName="ramsol-production-refo";
  const params = {
    Bucket: "ramsol-production-refo",
    Prefix: "requirement"+"/"+req.mainId
  };

  // List all objects in the folder
  s3.listObjects(params, function (err, data) {
    if (err) {
      console.log(err);
      return false;
    }

    if (data.Contents.length === 0) {
      // No objects found, the folder is already empty
      console.log("no data");
      return true;
    }

    // Prepare the objects for deletion
    const objects = data.Contents.map(function (object) {
      return { Key: object.Key };
    });

    // Delete the objects
    s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: objects } }, function (err, delData) {
      if (err) {
        console.log(err);
      } 
      else {
        // If there are more objects to delete, recursively call the function
        if (data.Contents.length === 1000) {
          deleteS3Folder(req);
        } else {
          return true
        }
      } 
    });
  });
};
exports.databaseBackup=async(req,data,companyName)=>{
  try{
  for(i=0;i<data.length;i++){
    var currten_pos=data[i].data;
    const filePath = "./backup/"+req.mainId+"/databasebackup"+"/"+data[i].model+'.json'; // Replace with the desired file path
    var mydata={
      data:currten_pos
    }
    const jsonData = JSON.stringify(mydata, null, 2);
    // Write the JSON data to a file
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
    });
  };
  return {status:true};
}
catch(e){
  console.log(e);
  return {status:false};
}

};

// async function backupTables(req,data,companyName) {
//   const csvContent = data[0].map(row => Object.values(row).join(',')).join('\n');
//   fs.writeFileSync("./backup/"+req,mainId+"/", csvContent);
//   console.log(`Backup created`);
// }