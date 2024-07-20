// Needed Resource
const purchaseModel = require("../models/purchase-model");
const utilities = require("../utilities");

const purchaseCont = {};

/************************************
 * Build Purchase view
 *************************************/
purchaseCont.purchaseView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("purchase/order-vehicle", {
    title: "Place Order",
    nav,
    errors: null,
  });
};

/***************************
 * Process purchase data
 *********************** */
purchaseCont.processPurchase = async function (req, res, next) {
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
    // purchase_type,
  } = req.body;

  // console.log("Purchase Data:", req.body);

  const result = await purchaseModel.insertPurchase(
    purchase_firstname,
    purchase_lastname,
    purchase_email,
    purchase_address,
    purchase_phone,
    purchase_price,
    purchase_cardnumber,
    purchase_expirydate,
    purchase_securitycode,
    // purchase_type
  );

  if (result) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `Congratulations, ${purchase_firstname}! The order was place successfully!`
    );

    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
    });
  } else {
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, the order failed.");
    res.status(501).render("purchase/order-vehicle", {
      title: "Place Order",
      nav,
    });
  }
};

module.exports = purchaseCont;
