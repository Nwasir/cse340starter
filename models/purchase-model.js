const pool = require("../database/");

/***********************
 * insert new purchase
 ************************ */
async function insertPurchase(
  purchase_firstname,
  purchase_lastname,
  purchase_email,
  purchase_address,
  purchase_phone,
  purchase_price,
  purchase_cardnumber,
  purchase_expirydate,
  purchase_securitycode,
  purchase_type = "Client"
) {
  try {
    const sql = `INSERT INTO public.purchase 
      (purchase_firstname, purchase_lastname, purchase_email, 
      purchase_address, purchase_phone, purchase_price, purchase_cardnumber,
      purchase_expirydate, purchase_securitycode, purchase_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const result = await pool.query(sql, [
      purchase_firstname,
      purchase_lastname,
      purchase_email,
      purchase_address,
      purchase_phone,
      parseFloat(purchase_price),
      purchase_cardnumber.replace(/-/g, ""),
      purchase_expirydate,
      purchase_securitycode,
      purchase_type,
    ]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
}

module.exports = { insertPurchase };
