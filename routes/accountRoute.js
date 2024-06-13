const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

//route to build login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Route to build registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;