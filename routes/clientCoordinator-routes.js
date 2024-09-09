const { Router } = require("express");
const requirementController=require('../controllers/requirementController');
const ClientController=require('../controllers/clientController');
const candidateController=require('../controllers/candidateController');
const check_auth_CC=require('../middlewares/check_auth_clientCoordinater');
const check_auth=require('../middlewares/check_auth');
const check_auth_mail=require('../middlewares/check_auth_mail');
const dashboardController=require('../controllers/dashboardController');
const validation=require("../middlewares/validation");
const filefunctions=require("../middlewares/fileUploadMulter");
const candidateNotes=require('../controllers/candidateNotesController');
const userController=require('../controllers/userController');
const invoiceCadidatesSubContractController = require("../controllers/invoiceCadidatesSubContractController");
const route=Router();

route.post('/addRequirement',check_auth_CC,validation.addRequirementValidation,requirementController.addRequirement);
route.post('/changeRequirementStatus',check_auth_CC,requirementController.changeRequirementStatus);
route.post('/editRequirement',check_auth_CC,requirementController.editRequirement);
route.post('/myRequirements',check_auth_CC,requirementController.myRequirements);
route.post('/getRequirement',check_auth,requirementController.viewRequirement);
route.post('/getClientList',check_auth_CC,ClientController.getClientList);
route.post('/getOrganisationReciruterList',check_auth_CC,ClientController.getOrganisationReciruterList);
route.post('/requirementStatusCodeList',check_auth_CC,requirementController.requirementStatusCodeList);
route.post('/candidateStatusCodeList',check_auth_CC,candidateController.candidateStatusCodeList);
route.post('/ccDashboard',check_auth_CC,dashboardController.ccDashboard);
route.post("/getAllRequirementList",check_auth_CC,requirementController.getAllRequirementList);
route.post("/getCCRequirementList",check_auth_CC,requirementController.getCCRequirementList);
route.post("/getEditClientList",check_auth_CC,ClientController.getEditClientList);
route.post("/getEditOrganisationReciruterList",check_auth_CC,ClientController.getEditOrganisationReciruterList);
route.post("/resetStatus",check_auth_CC,candidateController.resetStatus);
route.post("/updateRequirementJd",check_auth_CC,filefunctions.jdUpload,requirementController.updateRequirementJd);
route.post("/sendApprovalMail",check_auth_CC,ClientController.sendApprovalMail);
route.post("/approveClient",check_auth_mail,ClientController.approveClient);
route.post("/checkApprovalValidity",check_auth_mail,ClientController.checkApprovalValidity);
route.post("/addHiringLevel",check_auth_CC,validation.addHiringLevelValidation,ClientController.addHiringLevel);
route.post("/editHiringLevel",check_auth_CC,validation.editHiringLevelValidation,ClientController.editHiringLevel);
route.post("/approveNotes",check_auth_CC,candidateNotes.approveNotes);
route.post("/resendOtp",check_auth_mail,ClientController.resendOtp);
route.post("/getMyProjects",check_auth_CC,ClientController.getMyProjects);
route.post("/removeAssignedRequirements",check_auth_CC,requirementController.removeAssignedRequirements);
route.post("/viewAllAssigendRequirementsCC",check_auth_CC,requirementController.viewAllAssigendRequirementsCC);
route.post("/getVendorCreds",check_auth_CC,userController.getVendorCredsCC);
route.post("/getAllInvoiceableCandidatesCC",check_auth_CC,invoiceCadidatesSubContractController.getAllInvoiceableCandidatesCC);

module.exports=route;