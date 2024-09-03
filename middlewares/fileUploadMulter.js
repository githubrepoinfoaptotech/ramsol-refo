const multer=require('multer');
var path=require('path');
const AWS = require("aws-sdk");
const multerS3 = require('multer-s3')
var maxSize = 25 * 1024 * 1024; // 25MB;
require("dotenv").config();
const s3 = new AWS.S3({
    accessKeyId: process.env.liveS3Id,
    secretAccessKey: process.env.liveS3Key,
  });
exports.ImageUpload = async function(req, res, next) {
    var upload = multer({
        limits: {
            fileSize: maxSize,
          },
        storage: multerS3({
            s3: s3,
            bucket: "ramsol-production-refo"+"/"+"profilePicture",
            key: function (req, file, cb) {
                if (path.extname(file.originalname).toLowerCase() === '.jpg'||path.extname(file.originalname).toLowerCase() === '.png'  ||path.extname(file.originalname).toLowerCase() === '.jpeg') {
                    cb(null, req.mainId+"/"+req.mainId+"_"+file.originalname);
                  }
                  else{
                    return cb(new Error('Only mages are allowed'));
                  }
              
            }
          })
    }).single('image',1);

     upload(req,res, async function(err){
        if(err){
            res.status(200).json({status:false,message: 'Unable to upload image check the image size and type!!'});

        } else {
            next();
        }
    });
};

exports.resumeUpload = async function(req, res, next) {
  console.log(req.firstName);
    var upload = multer({
        limits: { 
            fileSize: maxSize,
          },
          storage: multerS3({
            s3: s3,
            bucket: "ramsol-production-refo"+"/"+"resumes",
            key: function (req, file, cb) {
                    console.log(file)
                if (path.extname(file.originalname).toLowerCase() === '.pdf'||path.extname(file.originalname).toLowerCase() === '.docx'  ||path.extname(file.originalname).toLowerCase() === '.doc') {
                    cb(null, req.mainId+"/"+"refo_"+req.mainId+"_"+Date.now()+path.extname(file.originalname).toLowerCase());
                  }
                  else{
                    return cb(new Error('Only Documents are allowed'));
                  }
            }
          })
    }).single('resume',1);
    upload(req,res, function(err){
        if(err){
          console.log(err);
            res.status(200).json({status:false,message: 'Unable to upload resume check the resume size and type!!!!'});
        } else {
            next();
        }
    });
};

exports.documentUpload = async function(req, res, next) {
  //console.log(req.firstName);
    var upload = multer({
        limits: { 
            fileSize: maxSize,
          },
          storage: multerS3({
            s3: s3,
            bucket: "ramsol-production-refo"+"/"+"documents",
            key: function (req, file, cb) {
                    console.log(file)
                if (path.extname(file.originalname).toLowerCase() === '.pdf'||path.extname(file.originalname).toLowerCase() === '.docx'  ||path.extname(file.originalname).toLowerCase() === '.doc') {
                    cb(null, req.mainId+"/"+"refo_"+req.mainId+"_"+Date.now()+path.extname(file.originalname).toLowerCase());
                  }
                  else{
                    return cb(new Error('Only Documents are allowed'));
                  }
            }
          })
    }).single('document',1);
    upload(req,res, function(err){
        if(err){
          console.log(err);
            res.status(200).json({status:false,message: 'Unable to upload document check the document size and type!!!!'});
        } else {
            next();
        }
    });
};

exports.photoUpload=async(req,res,next)=>{
  var upload = multer({
    limits: {
        fileSize: maxSize,
      },
    storage: multerS3({
        s3: s3,
        bucket: "ramsol-production-refo"+"/"+"photos",
        key: function (req, file, cb) {
            if (path.extname(file.originalname).toLowerCase() === '.jpg'||path.extname(file.originalname).toLowerCase() === '.png'  ||path.extname(file.originalname).toLowerCase() === '.jpeg') {
                cb(null, req.mainId+"/"+req.mainId+"_"+file.originalname);
              }
              else{
                return cb(new Error('Only images are allowed'));
              }
          
        }
      })
}).single('image',1);

 upload(req,res, async function(err){
    if(err){
        res.status(200).json({status:false,message: 'Unable to upload image check the image size and type!!'});

    } else {
        next();
    }
});
};

exports.jdUpload = async function(req, res, next) {
  var maxSize = 10 * 1000 * 1000;
    var upload = multer({
        limits: { 
            fileSize:maxSize,
          },
          storage: multerS3({
            s3: s3,
            bucket: "ramsol-production-refo"+"/"+"requirement",
            key: function (req, file, cb) {
                if (path.extname(file.originalname).toLowerCase() === '.pdf'||path.extname(file.originalname).toLowerCase() === '.docx'  ||path.extname(file.originalname).toLowerCase() === '.doc') {
                    cb(null, req.mainId+"/"+"refo_"+req.mainId+"_"+Date.now()+path.extname(file.originalname).toLowerCase());
                  }
                  else{
                    return cb(new Error('Only Documents are allowed'));
                  }
            }
          })
    }).single('file',1);
    upload(req,res, function(err){
        if(err){
          console.log(err);
            res.status(200).json({status:false,message: 'Unable to upload JD check the JD size and type!!'});
        } else {
            next();
        }
    });
};
exports.backupFile=async (req,res,next)=>{
  const fileStorage = multer.diskStorage({
    // Destination to store image      
    destination: 'restoreBackup', 
      filename: async(req, file, cb) => {
          cb(null, file.originalname)
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
      if (!file.originalname.match(/\.(zip)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a another file'))
       }
     cb(undefined, true) 
  }
}).single('backup',1)
fileUpload(req,res, function(err){
    if(err){
        res.status(200).json({status:false,message: 'Unable to upload Check file type or if  the file is curropted!!'});
    } else {
        next();
    }
});
};

exports.existingCandidateUpload=async(req,res,next)=>{
  const fileStorage = multer.diskStorage({
    // Destination to store image      
    destination: "./"+req.mainId+"/"+"exitingCandidates"+"/", 
      filename: async(req, file, cb) => {
          cb(null, file.originalname)
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});
const fileUpload = multer({
    storage: fileStorage,
    // limits: {
    //   fileSize: 25000000 // 1000000 Bytes = 1 MB
    // },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(xlsx)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a another file'))
       }
     cb(undefined, true) 
  }
}).single('backup',1);
fileUpload(req,res, function(err){
    if(err){
      console.log(err);
        res.status(200).json({status:false,message: 'Unable to upload Check file type or if  the file is curropted!!'});
    } else {
        next();
    }
});
};

exports.screenShotUploader=async(req,res,next)=>{
  var upload = multer({
    limits: {
        fileSize: maxSize,
      },
    storage: multerS3({
        s3: s3,
        bucket: "ramsol-production-refo"+"/"+"screenShots",
        key: function (req, file, cb) {
            if (path.extname(file.originalname).toLowerCase() === '.jpg'||path.extname(file.originalname).toLowerCase() === '.png'  ||path.extname(file.originalname).toLowerCase() === '.jpeg') {
                cb(null, req.mainId+"/"+req.mainId+"_"+file.originalname);
              }
              else{
                return cb(new Error('Only mages are allowed'));
              }
          
        }
      })
}).single('image',1);

 upload(req,res, async function(err){
    if(err){
        res.status(200).json({status:false,message: 'Unable to upload image check the image size and type!!'});

    } else {
        next();
    }
});
};

exports.candidateMindsetAssessmentUpload=async(req,res,next)=>{
  var upload1 = multer({
    limits: {
        fileSize: maxSize,
      },
    storage: multerS3({
        s3: s3,
        bucket: "ramsol-production-refo"+"/"+"candidateAssessment",
        key: function (req, file, cb) {
            console.log(req.file);
            if (path.extname(file.originalname).toLowerCase() === '.jpg'||path.extname(file.originalname).toLowerCase() === '.png'  ||path.extname(file.originalname).toLowerCase() === '.jpeg') {
                cb(null, req.mainId+"/"+req.mainId+"_"+file.originalname);
              }
              else{
                return cb(new Error('Only mages are allowed'));
              }
          
        }
      })
}).single('file',1);

 upload1(req,res, async function(err){
    if(err){
      console.log(err);
        res.status(200).json({status:false,message: 'Unable to upload image check the image size and type!!'});

    } else {
        next();
    }
});
};


exports.inVoiceUploader=async(req,res,next)=>{

  var upload = multer({
    limits: {
        fileSize: maxSize,
      },
    storage: multerS3({
        s3: s3,
        bucket: "ramsol-production-refo"+"/"+"invoice",
        key: function (req, file, cb) {
            if (path.extname(file.originalname).toLowerCase() === '.pdf') {
                cb(null, req.mainId+"/"+req.mainId+"_"+file.originalname);
              }
              else{
                return cb(new Error('Only Pdf are allowed'));
              }
          
        }
      })
}).single('invoice',1);

 upload(req,res, async function(err){
  console.log(req.file);
    if(err){
        res.status(200).json({status:false,message: 'Unable to upload pdf check the document size and type!!'});

    } else {
        next();
    }
});
};

exports.ndaUploader=async(req,res,next)=>{
  console.log(process.env.liveS3Key);
  var upload = multer({
    limits: {
        fileSize: maxSize,
      },
    storage: multerS3({
        s3: s3,
        bucket: "ramsol-production-refo"+"/"+"nda",
        key: function (req, file, cb) {
            if (path.extname(file.originalname).toLowerCase() === '.pdf') {
                cb(null, req.mainId+"/"+req.mainId+"_"+file.originalname);
              }
              else{
                return cb(new Error('Only Pdf are allowed'));
              }
          
        }
      })
}).single('nda',1);

 upload(req,res, async function(err){
  console.log(req.file);
    if(err){
      console.log(err);
        res.status(200).json({status:false,message: 'Unable to upload pdf check the document size and type!!'});

    } else {
        next();
    }
});
};



exports.removeS3File=async(file)=>{
    const params = {
      Bucket: "ramsol-production-refo",
      Key: file,
  };

  return s3.deleteObject(params).promise()
      .then(() => {
        console.log("Done");
          return true;
      })
      .catch((err) => {
        console.log(err);
         return false
      });
};