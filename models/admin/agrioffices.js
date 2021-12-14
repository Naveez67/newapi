var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var agricultureofficesSchema = mongoose.Schema({
  name: String,
  phone:String,
  Address:String,
  city:String,
});
var Agricultureoffices = mongoose.model("Agricultureoffices", agricultureofficesSchema);

function validateoffices(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(11).max(11).required(),
    Address: Joi.string().min(3).required(),
    city: Joi.string().min(3).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.Agricultureoffices = Agricultureoffices;
module.exports.validate = validateoffices;
