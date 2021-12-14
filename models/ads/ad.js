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
module.exports=Ads;