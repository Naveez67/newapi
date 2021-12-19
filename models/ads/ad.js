var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {ObjectId}= mongoose.Schema.Types;
var adsSchema = mongoose.Schema({
  title: String,
  body: String,
  photo:String,
  price:Number,
  dateofpost:{
      type:Date, 
      default:Date.now
  },
  postedby:{
      type:ObjectId,
      ref:"User"
  },
  type:String,
  category:String,

 expire_at: {type: Date, default: Date.now, expires: 16*24*60*60}
});
var Ads = mongoose.model("Ads", adsSchema);
function validateAd(data) {
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      body: Joi.string().min(6).required(),
      photo: Joi.string().min(3).required(),
      price: Joi.number().min(0).required(),
      type: Joi.string().min(3).required(),
      category: Joi.string().min(3).required(),
      // address:Joi.string().min,
    });
    return schema.validate(data, { abortEarly: false });
  }
module.exports.Ads=Ads;
module.exports.validate = validateAd;