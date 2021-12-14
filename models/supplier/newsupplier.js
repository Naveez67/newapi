var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {ObjectId}= mongoose.Schema.Types;
var supplierSchema = mongoose.Schema({
  name: String,
  photo:String,
  address:{
    type:String,
    default:""
  },
  password:String,
  username:String,
  phone:String,
  regno:String,
  role:{
    type:String,
    default:"supplier",
  },
  accountcreated:{
    type:Date,
    default:Date.now,
  },
  rating:[{
    rate:Number,
    ratedBy:{type:ObjectId,ref:"User"}
}],
});
var Supplier = mongoose.model("Supplier", supplierSchema);
function validateSupplier(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).regex(/^[A-Za-z]+$/).required(),
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    photo: Joi.string().min(3).required(),
    phone: Joi.string().min(11).max(11).required(),
    regno: Joi.string().min(6).max(12).required(),
    // address:Joi.string().min,
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Supplier=Supplier;
module.exports.validate = validateSupplier;
