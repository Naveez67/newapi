const { validate } = require("../models/admin/agrioffices");
function validateOffice(req, res, next) {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateOffice;