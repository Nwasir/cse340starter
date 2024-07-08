const jwt = require("jsonwebtoken");
require("dotenv").config();

async function checkAdminOrEmployee(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash("notice", "Please log in to access this page.");
    return res.redirect("/account/login");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      req.flash("notice", "Invalid token. Please log in again");
      return res.redirect("/account/login");
    }

    if (
      decoded.account_type === "Emloyee" ||
      decoded.account_type === "Admin"
    ) {
      req.user = decoded;
      next();
    } else {
      req.flash("notice", "You do not have permission to access this page.");
      return res.redirect("/account/login");
    }
  });
}

module.exports = checkAdminOrEmployee;