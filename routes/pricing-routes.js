const { Router } = require("express");
const pricingController=require("../controllers/pricingController");
const check_auth_superadmin=require('../middlewares/check_auth_superadmin');


const priceRoutes=Router();

priceRoutes.post("/addPrice",check_auth_superadmin,pricingController.addPrice);
priceRoutes.post("/editPrice",check_auth_superadmin,pricingController.editPrice);
priceRoutes.post("/viewAllPricing",check_auth_superadmin,pricingController.viewAllPricing);
priceRoutes.post("/viewPricing",check_auth_superadmin,pricingController.viewPricing);
priceRoutes.post("/pricingList",check_auth_superadmin,pricingController.pricingList);


module.exports=priceRoutes;