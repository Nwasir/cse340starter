const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
// const auth = require("../utilities/authentication");
//route to build login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Route to build registration
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

//process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build account management
router.get(
  "/",
  utilities.handleErrors(accountController.buildManagement)
);

//route to process log out
router.get("/logout", accountController.accountLogout);

// Route to build update account information view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Route to process the update account information
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to process the change password form submission
router.post("/update/password", utilities.handleErrors(accountController.updatePassword));


module.exports = router;
