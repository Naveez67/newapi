var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var customerSchema = mongoose.Schema({
  name: String,
  photo:String,
  username:String,
  password:String,
  address:{
    type:String,
    default:"",
  },
  phone:String,
  role:{
    type:String,
    default:"customer",
  },
  accountcreated:{
    type:Date,
    default:Date.now,
  }
});
var Customer = mongoose.model("Customer", customerSchema);
function validatecustomer(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).regex(/^[A-Za-z]+$/).required(),
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    photo: Joi.string().min(3).required(),
    phone: Joi.string().min(11).max(11).required(),
    // address:Joi.string(),

  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Customer=Customer;
module.exports.validate = validatecustomer;
