// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const ValidateAll = require("../utilities/inventory-validation");

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
  ValidateAll.addClassificationRules(),
  ValidateAll.checkAddClassification,
  utilities.handleErrors(invController.processClassification)
);

//Route to build add inventory view
router.get("/add-inventory", invController.inventoryView);
//Process inventory view
router.post(
  "/add-inventory",
  ValidateAll.addInventoryRules(),
  ValidateAll.checkInventoryData,
  utilities.handleErrors(invController.processInventory)
);
// Route that workswith inventory.js
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

module.exports = router;
