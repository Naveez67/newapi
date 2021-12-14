var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {ObjectId}= mongoose.Schema.Types;
var farmerSchema = mongoose.Schema({
  name: String,
  photo:String,
  address:{
    type:String,
    default:""
  },
  phone:String,
  password:String,
  username:String,
  role:{
    type:String,
    default:"farmer",
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
var Farmer = mongoose.model("Farmer", farmerSchema);

function validateFarmer(data) {
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
module.exports.Farmer = Farmer;
module.exports.validate = validateFarmer;
