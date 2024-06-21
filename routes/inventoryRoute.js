// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.getDetailsInventoryId);

//ROute to build management view
router.get("/", invController.managementView);

//Route to build add classification view
router.get("/add-classification", invController.classificationView);

//Route to build add inventory view
router.get("/add-inventory", invController.inventoryView);

module.exports = router;
