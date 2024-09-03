const {Router}=require("express");
const sourcesController=require("../controllers/sourcesController");
const check_auth_admin=require('../middlewares/check_auth_admin');
const check_auth=require('../middlewares/check_auth');
const validation=require('../middlewares/validation');

const sourceRoutes= Router();

sourceRoutes.post("/addSource",check_auth_admin,validation.addSourceValidation,sourcesController.addSource);
sourceRoutes.post("/editSource",check_auth_admin,sourcesController.editSource);
sourceRoutes.post("/viewAllSources",check_auth_admin,sourcesController.viewAllSources);
sourceRoutes.post("/viewSource",check_auth_admin,sourcesController.viewSource);
sourceRoutes.post("/viewSourcesList",check_auth,sourcesController.viewSourcesList);
sourceRoutes.post("/changeSourceState",check_auth_admin,sourcesController.changeState);
sourceRoutes.post("/viewSourcesEditList",check_auth,sourcesController.viewSourcesEditList);

module.exports=sourceRoutes;