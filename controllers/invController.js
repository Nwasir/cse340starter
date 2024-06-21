const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ********************************
 * Build inventory view details
 * ********************************* */
invCont.getDetailsInventoryId = async function (req, res, next) {
  const inventory_id = req.params.invId;
  const details = await invModel.getDetailsInventoryId(inventory_id);
  const nav = await utilities.getNav();
  res.render("./inventory/details", {
    title: details.inv_make + " " + details.inv_model,
    nav,
    details,
  });
};

/************************************
 * Build management view
 * *********************************/
invCont.managementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
  });
};

/**********************************
 * Build Add classification view
 * ********************************/
invCont.classificationView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/***********************************
 * Build Add Inventory view
 * *********************************/
invCont.inventoryView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
  });
};

module.exports = invCont;
