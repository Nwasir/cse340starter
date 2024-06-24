// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const classification_Validate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.getDetailsInventoryId);

//ROute to build management view
router.get("/", invController.managementView);

//Route to build add classification view
router.get("/add-classification", invController.classificationView);
//Process classification view
router.post(
  "/add-classification",
  classification_Validate.addClassificationRules(),
  classification_Validate.checkAddClassification,
  utilities.handleErrors(invController.processClassification)
);

//Route to build add inventory view
router.get("/add-inventory", invController.inventoryView);
//Process inventory view
router.post(
  "/add-inventory",

  utilities.handleErrors(invController.processInventory)
);

module.exports = router;
