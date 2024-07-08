const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const inventoryModel = require("../models/inventory-model");

/**********************************************
 * Add classification validation Rules
 ******************************************** */
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide proper name."),
  ];
};

/*******************************************************
 * Check data and return errors or continue with add classification
 * *****************************************************/
validate.checkAddClassification = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      errors,
      nav,
      classification_name,
    });
    return;
  }
  next();
};


/**********************************************
 * Add inventory Data validation Rules
 ******************************************** */
validate.addInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make cannot be empty.")
      .isLength({ min: 3 })
      // .withMessage("Make must be at least 3 characters long.")
      .escape(),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model cannot be empty.")
      .isLength({ min: 3 })
      // .withMessage("Model must be at least 3 characters long.")
      .escape(),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year cannot be empty.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a number and 4 digits long.")
      .isNumeric()
      // .withMessage("Year must be a number.")
      .escape(),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty.")
      .isLength({ max: 100 })
      // .withMessage("Description cannot be more than 100 characters long.")
      .escape(),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price cannot be empty.")
      .isNumeric()
      // .withMessage("Price must be a number.")
      .escape(),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles cannot be empty.")
      .isNumeric()
      // .withMessage("Miles must be a number.")
      .escape(),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color cannot be empty.")
      .escape(),

    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification.")
      .escape(),
  ];
};

/*******************************************************
 * Check data and return errors or continue registration
 *****************************************************/
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      classificationList,
      title: "Add New Vehicle",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

/*******************************************************
 * Check data and return errors or continue update
 *****************************************************/
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/edit-inventory", {
      errors,
      classificationList,
      title: "Update Vehicle",
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

module.exports = validate;
