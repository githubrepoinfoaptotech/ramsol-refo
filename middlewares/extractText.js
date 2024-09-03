const multer = require('multer');
const path = require('path');
const pdf = require('pdf-parse');
const fs=require('fs');
const axios = require('axios');
const mime = require('mime');
const maxSize = 5 * 1024 * 1024; // 5MB
const WordExtractor = require("word-extractor");
// Multer configuration

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'resumes/'); // Save the file locally
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});


const upload = multer({
    limits: {
        fileSize: maxSize,
    },
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            //console.log(file);
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOCX, and DOC files are allowed.'));
        }
    },
}).single('resume');


const Jdstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'job_descriptions/'); // Save the file locally
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});


const jdUpoad = multer({
    limits: {
        fileSize: maxSize,
    },
    storage: Jdstorage,
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            //console.log(file);
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOCX, and DOC files are allowed.'));
        }
    },
}).single('job_description');


exports.job_descriptions = async function (req, res, next) {
    // Use the multer middleware here
    jdUpoad(req, res, async function (err) {
        if (err) {
            console.log(err);
            res.status(200).json({ status: false, message: 'Unable to upload resume. Check the resume size and type.' });
        } else {
            // Extract text from the uploaded document
            try {
                //console.log(req.file);
                const text = await extractTextFromDocument(req.file.path, req.file.mimetype);
                // Attach extracted text to req.body
                req.body.extractedText = text;
                next();
            } catch (extractionError) {
                console.error('Text Extraction Error:', extractionError);
                res.status(500).json({ status: false, message: 'Error extracting text from the document' });
            }
        }
    });
}
// Middleware for handling file upload and text extraction
exports.resumeUpload = async function (req, res, next) {
    // Use the multer middleware here
    upload(req, res, async function (err) {
        if (err) {
            console.log(err);
            res.status(200).json({ status: false, message: 'Unable to upload resume. Check the resume size and type.' });
        } else {
            // Extract text from the uploaded document
            try {
                //console.log(req.file.path);
                const text = await extractTextFromDocument(req.file.path, req.file.mimetype);
                //console.log('Extracted Text:', text);
                // Attach extracted text to req.body
                req.body.extractedText = text;
                
                next();
            } catch (extractionError) {
                console.error('Text Extraction Error:', extractionError);
                res.status(500).json({ status: false, message: 'Error extracting text from the document' });
            }
        }
    });
}

exports.textExtract = async function (req, res, next) {
    // Use the multer middleware here
    upload(req, res, async function (err) {
        if (err) {
            console.log(err);
            res.status(200).json({ status: false, message: 'Unable to upload resume. Check the resume size and type.' });
        } else {
            // Extract text from the uploaded document
            try {
                //console.log(req.file.path);
                const text = await extractTextFromDocument(req.file.path, req.file.mimetype);
                //console.log('Extracted Text:', text);
                // Attach extracted text to req.body
                //console.log(req.file)
                // req.body.extractedText = text;
                // req.body.fileName=req.file.originalname;
                var candidate_email =  text.match(
                    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
                  ); //For 
                var candidate_mobile = text.match(
                    /(\+?\d{10})\b/
                  );
                if(candidate_email)
                    {
                        req.body.candidate_email=candidate_email[0];
                    }
                if(candidate_mobile)
                    {
                        req.body.candidate_email=candidate_mobile[0];
                    }
                fs.unlinkSync(req.file.path);
                res.status(200).json({data:req.body,status:true});
            } catch (extractionError) {
                console.error('Text Extraction Error:', extractionError);
                res.status(500).json({ status: false, message: 'Error extracting text from the document' });
            }
        }
    });
};


exports.extractFromLink=async function(req,res,next){
 try {
    const response = await axios.get(req.body.resume, { responseType: 'arraybuffer' });

    // Extract file extension from the S3 link
    const fileExtension = path.extname(req.body.resume);
    const mimeType = mime.getType(fileExtension);
    // Extract filename from the S3 link
    const filename = path.basename(req.body.resume);

    // Build the dynamic local path
    const localFilePath = path.join('temp', filename);

    fs.writeFileSync(localFilePath, Buffer.from(response.data));
    const text = await extractTextFromDocument(localFilePath, mimeType);
    req.body.extractedText = text;
    fs.unlinkSync(localFilePath);
    next();
   // console.log(text);
  } catch (error) {
    console.error('Error downloading resume from S3:', error.message);
    throw error;
  }
}


// Function to extract text from different document types using textract
async function extractTextFromDocument(filePath, mimeType) {
    if (mimeType === 'application/pdf') {                                                            //pdf
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw error;
        }
    }
    else if(mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')//docx
    {
        try{
        // textract.fromFileWithPath(filePath, async function (error, mytext) {
        //     return mytext;
        // });
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(filePath);
        //console.log(extracted);
        return extracted.getBody()
    }
    catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw error;
    }
    }
    else if(mimeType ==="application/msword")  //doc
    {
        try
            {
                const extractor = new WordExtractor();
                const extracted = await extractor.extract(filePath);
                //console.log(extracted);
                return extracted.getBody()
            }
        catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw error;
        }
    }
    else {
        throw new Error('Unsupported document type for text extraction');
    }
}

