// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const purController = require("../controllers/purController");
// const checkAdminOrEmployee = require("../utilities/authentication");
const validateAll = require("../utilities/purchase-validation");

// Route to build order vehicle
router.get("/order",  purController.purchaseView);

// Process purchase vehicle
router.post(
  "/order",
  // checkAdminOrEmployee,
  validateAll.purchaseRules(),
  validateAll.checkPurchaseData,
  utilities.handleErrors(purController.processPurchase)
);

module.exports = router;
