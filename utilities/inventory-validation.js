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

module.exports = validate;
