var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var marketratesSchema = mongoose.Schema({
  productname: String,
  productprice:Number,
  quantity:Number,
  city:String,
  distric:String,
  date:{
     type:Date,
     default: Date.now,
  },
  expire_at: {type: Date, default: Date.now, expires: 8*24*60*60}
});
var Marketrates = mongoose.model("Marketrates", marketratesSchema);

function validaterates(data) {
  const schema = Joi.object({
    productname: Joi.string().min(3).required(),
    productprice: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
    city: Joi.string().min(3).required(),
    distric: Joi.string().min(3).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.Marketrates = Marketrates;
module.exports.validate = validaterates;
