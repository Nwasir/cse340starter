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
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationList,
  });
};

/**********************************
 * Build Add classification view
 * ********************************/
invCont.classificationView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classifications = await invModel.getClassifications();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    classifications,
    errors: null,
  });
};

/***********************************
 * Build Add Inventory view
 * *********************************/
invCont.inventoryView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  });
};

/***************************
 * Process Add classification
 *********************** */
invCont.processClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const result = await invModel.addNewClassifiaction(classification_name);
  if (result) {
    req.flash(
      "notice",
      `Congratulations! You have added ${classification_name}`
    );
    // const nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the classification failed");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

/***************************
 * Process Add inventory
 *********************** */
invCont.processInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
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

  const result = await invModel.addNewInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (result) {
    req.flash("notice", `Congratulations! You have added a new Vehicle`);
    const nav = await utilities.getNav();
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    const nav = await utilities.getNav();
    req.flash("notice", "Sorry, the inventory failed");
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicles",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/***********************************
 * Build edit Inventory
 * *********************************/
invCont.editInventory = async function (req, res, next) {
  console.log("editInventory method called")
  const nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  console.log("inv_id:", inv_id);
  const itemData = await invModel.getDetailsInventoryId(inv_id);
  console.log("itemData:", itemData);
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/***************************
 * Update inventory Data process
 *********************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was succesfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the inserted failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
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
  }
};

/***********************************
 * Build delete Inventory view
 * *********************************/
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await invModel.getDetailsInventoryId(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    // itemData,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/***************************
 * Delete inventory Data process
 *********************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);
  // const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  if (deleteResult) {
    req.flash("notice", `The deletion was succesfully deleted.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the Deletion failed.");
  res.redirect(`/inv/delete/${inv_id}`);
  }
};

module.exports = invCont;
