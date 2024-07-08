// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const ValidateAll = require("../utilities/inventory-validation");
const checkAdminOrEmployee = require("../utilities/authentication");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.getDetailsInventoryId);

//ROute to build management view
router.get("/", checkAdminOrEmployee, invController.managementView);

//Route to build add classification view
router.get(
  "/add-classification",
  checkAdminOrEmployee,
  invController.classificationView
);
//Process classification view
router.post(
  "/add-classification",
  checkAdminOrEmployee,
  ValidateAll.addClassificationRules(),
  ValidateAll.checkAddClassification,
  utilities.handleErrors(invController.processClassification)
);

//Route to build add inventory view
router.get("/add-inventory", checkAdminOrEmployee, invController.inventoryView);
//Process inventory view
router.post(
  "/add-inventory",
  checkAdminOrEmployee,
  ValidateAll.addInventoryRules(),
  ValidateAll.checkInventoryData,
  utilities.handleErrors(invController.processInventory)
);
// Route inventory for Ajax route
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);
// Route for editing inventory
router.get("/edit/:inv_id", checkAdminOrEmployee, invController.editInventory);

// Route to process inventory update
router.post(
  "/update/",
  ValidateAll.addInventoryRules(),
  ValidateAll.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to process delete inventory
router.get(
  "/delete/:inv_id",
  checkAdminOrEmployee,
  invController.deleteInventoryView
);

// Route to process delete inventory
router.post(
  "/delete",
  checkAdminOrEmployee,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
