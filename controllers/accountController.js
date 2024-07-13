const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/***************************************
 * Deliver login view
 * *************************************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/***************************
 * Process Registration
 *********************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // Regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    // account_password
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${account_firstname}. Please log in`
    );

    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/**********************************************
 * Process Login
 * ********************************************/
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credential and try again");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      // req.session.log = accountData;
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/*******************************************
 * Buid the account management view
 * ****************************************/
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/**********************************************
 * Process Logout
 * ********************************************/
async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  // req.session.destroy();
  res.redirect("/");
}

/**********************************************
 * Update account Information view
 * ********************************************/
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  if (!accountData) {
    req.flash("notice", "Account not found");
    return res.redirect("/account/");
  }
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    accountData,
    errors: null,
  });
}

/**********************************************
 * Process Update Account Information
 * ********************************************/
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  // Convert account_id to integer
  // const accountIdInt = parseInt(account_id, 10);

  const updateResult = await accountModel.updateAccount(
    parseInt(account_id, 10),
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", "Account information updateed successfully.");
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Failed to update account information.");
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      },
    });
  }
}

/**********************************************
 * Process Change Password
 * ********************************************/
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { current_password, new_password, confirm_new_password, account_id } =
    req.body;

  if (new_password !== confirm_new_password) {
    req.flash("notice", "New passwords do not match.");
    return res.status(400).render("account/update", {
      title: "Update Account Information",
      nav,
      accountData: await accountModel.getAccountById(account_id),
      errors: null,
    });
  }

  const result = await accountModel.getAccountById(account_id);
  if (!result) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/");
  }

  if (!(await bcrypt.compare(current_password, result.account_password))) {
    req.flash("notice", "Current password is incorrect.");
    return res.status(400).render("account/update", {
      title: "Update Account Information",
      nav,
      result,
      errors: null,
    });
  }

  const hashedNewPassword = await bcrypt.hashSync(new_password, 10);
  const passwordUpdateResult = await accountModel.updatePassword(
    account_id,
    hashedNewPassword
  );

  if (passwordUpdateResult) {
    req.flash("notice", "Password updated successfully.");
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Failed to update password.");
    return res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      accountData,
      errors: null,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  accountLogout,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
};
