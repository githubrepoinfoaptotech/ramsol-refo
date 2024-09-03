const userController=require('../controllers/userController');
const statusCodeController=require('../controllers/statusCodeController');
const dashboardController=require('../controllers/dashboardController');
const authController=require("../controllers/authController");
const recruiterTransactionController=require("../controllers/recruiterTransactionControllers");
const supportTicketController=require("../controllers/supportTicketController");
const chatController=require("../controllers/chatController");
const express = require('express');
const route = express.Router();
const validation=require("../middlewares/validation");
const check_auth_superadmin=require('../middlewares/check_auth_superadmin');
const backupController=require("../controllers/backupController");
var fileFunctions=require("../middlewares/fileUploadMulter");
const multer=require('multer');
var path=require('path');

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'images', 
      filename: (req, file, cb) => {
          cb(null, Date.now() +'_'+req.userid
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});
const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
  }
});
route.post('/changeMyPassword',check_auth_superadmin,userController.changeMyPassword);
//
route.post('/addAdmin',check_auth_superadmin,userController.addAdmin);
route.post('/editAdmin',check_auth_superadmin,userController.editAdmin);
route.post('/viewAllAdmin',check_auth_superadmin,userController.viewAllAdmin);
route.post('/viewAdmin',check_auth_superadmin,userController.viewAdmin);
route.post('/adminList',check_auth_superadmin,userController.adminList);
route.post('/editAdmin',check_auth_superadmin,userController.editAdmin);
route.post('/changeAdminState',check_auth_superadmin,userController.changeAdminState);
route.post('/addCode',check_auth_superadmin,statusCodeController.addCode);
route.post('/superAdminDashboard',check_auth_superadmin,dashboardController.superAdminDashboard);
route.post('/companySettings',check_auth_superadmin,validation.companySettingsValidation,imageUpload.single('image'),userController.companySettings);
route.post('/companySettingsExist',check_auth_superadmin,userController.companySettingsExist);
route.post('/superAdminlogin',authController.superAdminlogin);
// -------------------------------------------------------------------------------------------------------------------------
route.post('/addPurchase',check_auth_superadmin,validation.addPurchaseValidation,recruiterTransactionController.addPurchase);
route.post('/editPurchase',check_auth_superadmin,recruiterTransactionController.editPurchase);
route.post('/purchaseHistory',check_auth_superadmin,recruiterTransactionController.purchaseHistory);
route.post('/singlePurchase',check_auth_superadmin,recruiterTransactionController.singlePurchase);
route.post('/getWallet',check_auth_superadmin,authController.getWallet);
route.post('/viewAllChats',check_auth_superadmin,chatController.viewAllChats);
route.post('/purchaseInvoice',check_auth_superadmin,recruiterTransactionController.purchaseInvoice);
route.post('/changePendingPaymentStatus',check_auth_superadmin,recruiterTransactionController.changePendingPaymentStatus);

route.post('/supportViewAllTickets',check_auth_superadmin,supportTicketController.supportViewAllTickets);
route.post('/changePendingPaymentStatus',check_auth_superadmin,recruiterTransactionController.changePendingPaymentStatus);
route.post('/ViewAllSupportConversation',check_auth_superadmin,supportTicketController.ViewAllSupportConversation);
route.post('/superAdminSupportConversation',check_auth_superadmin,supportTicketController.superAdminSupportConversation);


route.post('/inactiveUserSuperAdmin',check_auth_superadmin,backupController.inactiveUserSuperAdmin);
route.post('/SupportRestoreBackup',check_auth_superadmin,fileFunctions.backupFile,backupController.SupportRestoreBackup);
route.post('/supportRestoreDatabase',check_auth_superadmin,backupController.supportRestoreDatabase);

route.post('/viewAllcompanyregisteration',check_auth_superadmin,authController.viewAllcompanyregisteration);
route.post('/viewCompanyregisteration',check_auth_superadmin,authController.viewCompanyregisteration);
route.post('/viewAllRequests',check_auth_superadmin,authController.viewAllRequests);
route.post('/viewRequest',check_auth_superadmin,authController.viewRequest);


route.post('/comapnyApproved',check_auth_superadmin,authController.comapnyApproved);
route.post('/msmeApproved',check_auth_superadmin,authController.msmeApproved);

module.exports = route;  