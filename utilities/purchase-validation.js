// Needed Resources
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const purchaseModel = require("../models/purchase-model");

const validate = {};

/**********************************************
 * Registration Data validation Rules
 ******************************************** */
validate.purchaseRules = () => {
  return [
    // firstname is required and must be string
    body("purchase_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    //lastname is required and must be string
    body("purchase_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in DB
    body("purchase_email")
      .trim()
      .escape()
      //   .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
      // .custom(async (purchase_email) => {
      //   const emailExists = await purchaseModel.checkExistingEmail(
      //     purchase_email
      //   );
      //   if (emailExists) {
      //     throw new Error("Email exists. Please log in or use different email");
      //   }
      // }),

    // Address is required
    body("purchase_address")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide address"),

    // Phone is required
    body("purchase_phone")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide phone number"),

    // price is required
    body("purchase_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide price"),

    // Card number is required
    body("purchase_cardnumber")
      .trim()
      .escape()
      .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/)
      .withMessage("Card number must be in the format XXXX-XXXX-XXXX-XXXX"),

    // Expiry date is required
    body("purchase_expirydate")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide expiry date"),

    // security code is required
    body("purchase_securitycode")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide security code"),
  ];
};

/*******************************************************
 * Check data and return errors or continue purchase
 * *****************************************************/
validate.checkPurchaseData = async (req, res, next) => {
  const {
    purchase_firstname,
    purchase_lastname,
    purchase_email,
    purchase_address,
    purchase_phone,
    purchase_price,
    purchase_cardnumber,
    purchase_expirydate,
    purchase_securitycode,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("purchase/order-vehicle", {
      errors,
      title: "Place Order",
      nav,
      purchase_firstname,
      purchase_lastname,
      purchase_email,
      purchase_address,
      purchase_phone,
      purchase_price,
      purchase_cardnumber,
      purchase_expirydate,
      purchase_securitycode,
    });
    return;
  }
  next();
};

module.exports = validate;
