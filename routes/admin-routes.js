const userController=require('../controllers/userController');
const clientController=require("../controllers/clientController");
const requirementController=require('../controllers/requirementController');
const authController=require('../controllers/authController');
const candidateController=require('../controllers/candidateController');
const recruiterTransactionController=require("../controllers/recruiterTransactionControllers");
const freeWhatsappCandidateController=require("../controllers/freeWhatsappCandidateController");
const supportTicketController=require("../controllers/supportTicketController");
const pricingController=require("../controllers/pricingController");
const backupController=require("../controllers/backupController");
const redeemCoinsControllers=require("../controllers/redeemCoinsControllers");
const express = require('express');
const route = express.Router();
require("dotenv").config();
const check_auth_admin=require('../middlewares/check_auth_admin');
const check_auth_CC=require('../middlewares/check_auth_clientCoordinater');
const validation=require("../middlewares/validation");
const { adminDashboard,adminDashboardCopy } = require('../controllers/dashboardController');
const fileUploader=require("../middlewares/fileUploadMulter");
const message=require("../functions/messageValidation");

//-------------------------------------
route.post('/addClient',check_auth_CC,validation.addClientValidation,clientController.addClient);
route.post('/editClient',check_auth_CC,clientController.editClient);
route.post('/getAllClients',check_auth_CC,clientController.viewAllClients);
route.post('/viewClient',check_auth_CC,clientController.viewClient);
route.post('/clientStatusCodeList',check_auth_CC,clientController.clientStatusCodeList);
route.post('/changeClientStatus',check_auth_CC,clientController.changeClientStatus);
route.post('/getAllClientList',check_auth_CC,clientController.getAllClientList);

// -------------------------------------
route.post("/adminDashboard",check_auth_admin,adminDashboard);


// -----
route.post('/addOrgRecruiter',check_auth_CC,validation.addOrgRecValidation,clientController.addOrgRecruiter);
route.post('/editOrgRecruiter',check_auth_CC,validation.editOrgRecValidation,clientController.editOrgRecruiter);
route.post('/changeOrgRecruiterStatus',check_auth_CC,clientController.changeOrgRecruiterStatus);
// ------
route.post('/changeUserRole',check_auth_admin,userController.changeUserRole);
route.post('/changeUserState',check_auth_admin,userController.changeUserState);
route.post('/addUser',check_auth_admin,userController.addUser);
route.post('/viewAllUsers',check_auth_admin,userController.viewAllUsers);
route.post('/editUser',check_auth_admin,userController.editUser);
route.post('/userList',check_auth_admin,userController.userList);
route.post('/allRecruiterList',check_auth_admin,userController.allRecruiterList);
route.post('/updateProfile',check_auth_admin,userController.updateProfile);
route.post('/editMyCompanySettings',check_auth_admin,userController.editMyCompanySettings)
route.post('/myCompanySettings',check_auth_admin,userController.myCompanySettings)

// editUser
//-------Requirement
route.post('/addRequirement',check_auth_admin,validation.addRequirementValidation,requirementController.addRequirement);
route.post('/AllRequirements',check_auth_admin,requirementController.viewAllRequirements);
route.post('/viewRequirement',check_auth_admin,requirementController.viewRequirement);
route.post('/editRequirement',check_auth_admin,requirementController.editRequirement);
route.post('/requirementStatusCodeList',check_auth_admin,requirementController.requirementStatusCodeList);
route.post("/getAllRequirementList",check_auth_admin,requirementController.getAllRequirementList);
route.post("/getAllCCList",check_auth_admin,requirementController.getAllCCList);


//-------Candidate
route.post('/addCandidate',check_auth_admin,validation.addCandidateValidation,message.checkCredsAvailable,candidateController.addCandidate);
route.post('/viewAllCanditates',check_auth_admin,candidateController.viewAllCanditates);
route.post('/viewCandidate',check_auth_admin,candidateController.viewCandidate);
route.post('/editCandidate',check_auth_admin,candidateController.editCandidate);
route.post('/candidateStatusCodeList',check_auth_admin,candidateController.candidateStatusCodeList);
route.post('/monthlyInvoiceData',check_auth_admin,candidateController.monthlyInvoiceData);
route.post('/getMonthlyData',check_auth_admin,candidateController.getMonthlyData);
route.post('/sendMonthTotal',check_auth_admin,candidateController.sendMonthTotal);
route.post('/invoicedCandidates',check_auth_admin,candidateController.invoicedCandidates);
route.post('/candidateReports',check_auth_admin,candidateController.candidateReports);
route.post('/updateCrediNoteStatus',check_auth_admin,candidateController.updateCrediNoteStatus);
route.post('/resetStatus',check_auth_admin,candidateController.resetStatus);
route.post('/adminEditCandidate',check_auth_admin,candidateController.adminEditCandidate);
route.post('/singleCandidateSearch',check_auth_admin,candidateController.singleCandidateSearch);
route.post("/candidateActivity",check_auth_admin,candidateController.candidateActivity);
//--settings
route.post('/setLogo',check_auth_admin,fileUploader.ImageUpload,userController.setLogo);
// ---recruiter TRansaction
route.post("/viewMyPurchase",check_auth_admin,recruiterTransactionController.viewMyPurchases);
route.post("/MyMessageActivity",check_auth_admin,recruiterTransactionController.MyMessageActivity);
route.post("/singlePurchase",check_auth_admin,recruiterTransactionController.singlePurchase);
route.post('/purchaseInvoice',check_auth_admin,recruiterTransactionController.purchaseInvoice);

//--Report

route.post("/stcReport",check_auth_admin,candidateController.stcReport);
route.post("/scheduleInterviewReport",check_auth_admin,candidateController.scheduleInterviewReport);
route.post("/InterviewScheduleReport",check_auth_admin,candidateController.InterviewScheduledReport);
route.post("/FISReport",check_auth_admin,candidateController.FISReport);
route.post("/FICReport",check_auth_admin,candidateController.FICReport);
route.post("/DCReport",check_auth_admin,candidateController.DCReport);
route.post("/SBSReport",check_auth_admin,candidateController.SBSReport);
route.post("/OfferedReport",check_auth_admin,candidateController.OfferedReport);
route.post("/YTJReport",check_auth_admin,candidateController.YTJReport);
route.post("/JoinedReport",check_auth_admin,candidateController.JoinedReport);
route.post("/ODReport",check_auth_admin,candidateController.ODReport);
route.post("/InvoicedReport",check_auth_admin,candidateController.InvoicedReport);
route.post("/CNReport",check_auth_admin,candidateController.CNReport);
route.post("/DitchedReport",check_auth_admin,candidateController.DitchedReport); 
route.post("/getReportCount",check_auth_admin,candidateController.getReportCount);
route.post("/getAllDropedCandidate",check_auth_admin,candidateController.getAllDropedCandidate);

//freemessageActivity
route.post("/freeMessageActivity",check_auth_admin,freeWhatsappCandidateController.freeMessageActivity);
route.post("/viewSingleFreeMessage",check_auth_admin,freeWhatsappCandidateController.viewSingleFreeMessage);
route.post("/uploadScreenShot",check_auth_admin,fileUploader.screenShotUploader,freeWhatsappCandidateController.uploadScreenShot);
//supportTicket
route.post("/addTicket",check_auth_admin,supportTicketController.addTicket);
route.post("/supportConversation",check_auth_admin,supportTicketController.supportConversation);
route.post("/viewAllTickets",check_auth_admin,supportTicketController.viewAllTickets);
route.post("/viewTicket",check_auth_admin,supportTicketController.viewTicket);
route.post("/ViewAllSupportConversation",check_auth_admin,supportTicketController.ViewAllSupportConversation);
route.post("/closeTicket",check_auth_admin,supportTicketController.closeTicket)
//Pricing
route.post("/pricingList",check_auth_admin,pricingController.pricingList);

//Billing
// route.post("/getBillingCounts",check_auth_admin,recruiterTransactionController.getBillingCounts);

//transactions
route.post("/addFreeCredits",check_auth_admin,recruiterTransactionController.addFreeCredits);

//Backup
route.post("/backupData",check_auth_admin,backupController.backupData);
route.post("/inactiveBackup",check_auth_admin,backupController.inactiveBackup);
//route.all("/inactiveBackupFile",check_auth_admin,backupController.inactiveBackupFile);
route.post("/archiveDownload",check_auth_admin,backupController.archiveDownload);
route.post("/resumeBackup",check_auth_admin,backupController.resumeBackup);
route.post("/clientRestoreBackup",check_auth_admin,fileUploader.backupFile,backupController.clientRestoreBackup);
route.post("/clientrestoreDataBase",check_auth_admin,backupController.clientrestoreDataBase);

//external User
route.post("/assignRequirements",check_auth_CC,requirementController.assignRequirements);
route.post("/viewAllAssigendRequirements",check_auth_admin,requirementController.viewAllAssigendRequirements);

route.post("/changeAssignedRequirementStatus",check_auth_admin,requirementController.changeAssignedRequirementStatus);
//existing Candidates
route.post("/uploadExistingCandidates",check_auth_admin,fileUploader.existingCandidateUpload,candidateController.uploadExistingCandidates)
route.post("/sendCV",check_auth_admin,candidateController.sendCV);

route.post("/msmeSearchCompany",check_auth_admin,authController.msmeSearchCompany);

route.post("/getAssignedCompanies",check_auth_admin,requirementController.getAssignedCompanies);
route.post("/viewRequirementCandidates",check_auth_admin,requirementController.viewRequirementCandidates);
route.post("/candidateCvLink",check_auth_admin,candidateController.candidateCvLink);
route.post("/orgPocForCompany",check_auth_CC,userController.orgPocForCompany);


//userdata
route.post("/getVendorCreds",check_auth_admin,userController.getVendorCreds);


//reccoins

route.post("/confirmTransfer",check_auth_admin,redeemCoinsControllers.confirmTransfer);
route.post("/adminViewAllRedemption",check_auth_admin,redeemCoinsControllers.adminViewAllRedemption);
route.post("/rejectInvoice",check_auth_admin,redeemCoinsControllers.rejectInvoice);


//assigned data
route.post("/getAssigendData",check_auth_admin,requirementController.getAssigendData);
route.post("/assignMulitpleRecuritersToRequirements",check_auth_admin,requirementController.assignMulitpleRecuritersToRequirements);
//nda
route.post("/removeNda",check_auth_admin,userController.removeNda);

module.exports = route;     
