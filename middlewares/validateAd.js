const { validate } = require("../models/ads/ad");
function validateAd(req, res, next) {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateAd;
