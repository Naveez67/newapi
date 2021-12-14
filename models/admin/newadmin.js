var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var adminSchema = mongoose.Schema({
  name: String,
  phone:String,
  photo:String,
  role:{
    type:String,
    default:"admin",
  },
  accountcreated:{
    type:Date,
    default:Date.now,
  }
});

var Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Admin = Admin;
module.exports.validate = validateAdmin;
